package com.yedc.academy.service;

import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import com.yedc.academy.dto.PaymentOrderRequest;
import com.yedc.academy.dto.PaymentOrderResponse;
import com.yedc.academy.dto.PaymentVerificationRequest;
import com.yedc.academy.exception.BadRequestException;
import com.yedc.academy.exception.ResourceNotFoundException;
import com.yedc.academy.model.*;
import com.yedc.academy.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

    private final EnrollmentRepository enrollmentRepository;
    private final PaymentRepository paymentRepository;
    private final CourseRepository courseRepository;
    private final AccountRepository accountRepository;
    private final LessonRepository lessonRepository;
    private final ProgressRepository progressRepository;

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    private boolean isMockMode() {
        return keyId == null || keyId.isBlank() || keyId.startsWith("rzp_test_mock");
    }

    @Transactional
    public PaymentOrderResponse createOrder(Long accountId, PaymentOrderRequest request) {
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + request.getCourseId()));

        if (!"ACTIVE".equals(course.getStatus())) {
            throw new BadRequestException("This course is currently not available for enrollment.");
        }

        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + accountId));

        // Check if user already has an enrollment
        Optional<Enrollment> existingEnrollmentOpt = enrollmentRepository.findByAccountIdAndCourseId(accountId, request.getCourseId());
        if (existingEnrollmentOpt.isPresent()) {
            Enrollment existing = existingEnrollmentOpt.get();
            if ("ACTIVE".equalsIgnoreCase(existing.getStatus())) {
                throw new BadRequestException("You are already enrolled in this course.");
            }
        }

        String orderId;
        boolean mock = isMockMode();

        if (mock) {
            orderId = "order_mock_" + UUID.randomUUID().toString().replace("-", "").substring(0, 14).toUpperCase();
            log.info("Razorpay configured in mock mode. Generated mock order: {}", orderId);
        } else {
            try {
                RazorpayClient client = new RazorpayClient(keyId, keySecret);
                JSONObject orderRequest = new JSONObject();
                // Amount in paise (price * 100)
                int amountInPaise = course.getPrice().multiply(new BigDecimal(100)).intValue();
                orderRequest.put("amount", amountInPaise);
                orderRequest.put("currency", "INR");
                orderRequest.put("receipt", "rec_acct_" + accountId + "_course_" + course.getId() + "_" + System.currentTimeMillis());

                com.razorpay.Order order = client.orders.create(orderRequest);
                orderId = order.get("id");
                log.info("Successfully created Razorpay order: {}", orderId);
            } catch (Exception e) {
                log.error("Failed to create Razorpay order. Falling back to mock order creation.", e);
                // Fall back to mock order if integration fails due to incorrect credentials
                orderId = "order_mock_" + UUID.randomUUID().toString().replace("-", "").substring(0, 14).toUpperCase();
                mock = true;
            }
        }

        // Save or update enrollment to PENDING status
        Enrollment enrollment;
        if (existingEnrollmentOpt.isPresent()) {
            enrollment = existingEnrollmentOpt.get();
            enrollment.setStatus("PENDING");
        } else {
            enrollment = Enrollment.builder()
                    .account(account)
                    .course(course)
                    .status("PENDING")
                    .build();
        }
        enrollment = enrollmentRepository.save(enrollment);

        // Find or create payment
        List<Payment> existingPayments = paymentRepository.findAllByEnrollmentId(enrollment.getId());
        Payment payment;
        if (!existingPayments.isEmpty()) {
            payment = existingPayments.get(0);
            payment.setAmount(course.getPrice());
            payment.setTransactionId(orderId);
            payment.setStatus("PENDING");
            payment.setPaymentMethod(mock ? "MOCK_RAZORPAY" : "RAZORPAY");
        } else {
            payment = Payment.builder()
                    .enrollment(enrollment)
                    .amount(course.getPrice())
                    .transactionId(orderId)
                    .status("PENDING")
                    .paymentMethod(mock ? "MOCK_RAZORPAY" : "RAZORPAY")
                    .build();
        }
        paymentRepository.save(payment);

        return PaymentOrderResponse.builder()
                .orderId(orderId)
                .amount(course.getPrice().multiply(new BigDecimal(100)).longValue())
                .currency("INR")
                .keyId(mock ? "rzp_test_mockKeyId" : keyId)
                .mockMode(mock)
                .build();
    }

    @Transactional
    public void verifyPayment(Long accountId, PaymentVerificationRequest request) {
        boolean mock = request.getRazorpayOrderId().startsWith("order_mock_");
        boolean signatureValid = false;

        if (mock) {
            signatureValid = "mock_signature".equals(request.getRazorpaySignature());
        } else {
            try {
                String payload = request.getRazorpayOrderId() + "|" + request.getRazorpayPaymentId();
                signatureValid = Utils.verifySignature(payload, request.getRazorpaySignature(), keySecret);
            } catch (Exception e) {
                log.error("Error occurred while verifying signature", e);
                signatureValid = false;
            }
        }

        // Find the payment associated with the order ID
        Payment payment = paymentRepository.findByTransactionId(request.getRazorpayOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found for order: " + request.getRazorpayOrderId()));

        Enrollment enrollment = payment.getEnrollment();

        // Security check: Make sure this payment belongs to the correct logged-in student
        if (!enrollment.getAccount().getId().equals(accountId)) {
            throw new BadRequestException("Unauthorized payment verification attempt.");
        }

        if (!signatureValid) {
            payment.setStatus("FAILED");
            enrollment.setStatus("FAILED");
            paymentRepository.save(payment);
            enrollmentRepository.save(enrollment);
            throw new BadRequestException("Payment verification failed. Invalid signature.");
        }

        // Check if already processed
        if ("SUCCESS".equalsIgnoreCase(payment.getStatus())) {
            log.info("Payment for order {} already processed successfully.", request.getRazorpayOrderId());
            return;
        }

        // Mark enrollment and payment as successful
        enrollment.setStatus("ACTIVE");
        enrollmentRepository.save(enrollment);

        payment.setStatus("SUCCESS");
        // Update transaction ID to payment ID upon success
        payment.setTransactionId(request.getRazorpayPaymentId());
        payment.setPaidAt(LocalDateTime.now());
        paymentRepository.save(payment);

        // Pre-initialize Lesson Progress placeholders
        List<Lesson> lessons = lessonRepository.findAllBySectionCourseId(enrollment.getCourse().getId());
        List<Progress> progresses = new ArrayList<>();
        for (Lesson lesson : lessons) {
            // Check if progress already exists to avoid duplicate constraint violations
            if (!progressRepository.findByEnrollmentIdAndLessonId(enrollment.getId(), lesson.getId()).isPresent()) {
                Progress progress = Progress.builder()
                        .enrollment(enrollment)
                        .lesson(lesson)
                        .completed(false)
                        .watchPercentage(0)
                        .build();
                progresses.add(progress);
            }
        }
        if (!progresses.isEmpty()) {
            progressRepository.saveAll(progresses);
        }

        log.info("Payment verified and enrollment activated for account {} and course {}", accountId, enrollment.getCourse().getId());
    }
}
