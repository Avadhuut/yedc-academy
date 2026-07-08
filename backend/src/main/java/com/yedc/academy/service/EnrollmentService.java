package com.yedc.academy.service;

import com.yedc.academy.dto.EnrollmentRequest;
import com.yedc.academy.dto.EnrollmentResponse;
import com.yedc.academy.exception.BadRequestException;
import com.yedc.academy.exception.ResourceNotFoundException;
import com.yedc.academy.model.*;
import com.yedc.academy.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final PaymentRepository paymentRepository;
    private final CourseRepository courseRepository;
    private final AccountRepository accountRepository;
    private final LessonRepository lessonRepository;
    private final ProgressRepository progressRepository;

    @Transactional
    public EnrollmentResponse enrollStudent(Long accountId, EnrollmentRequest request) {
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + request.getCourseId()));

        if (!"ACTIVE".equals(course.getStatus())) {
            throw new BadRequestException("This course is currently not available for enrollment.");
        }

        if (enrollmentRepository.existsByAccountIdAndCourseId(accountId, request.getCourseId())) {
            throw new BadRequestException("You are already enrolled in this course.");
        }

        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + accountId));

        // Create Enrollment
        Enrollment enrollment = Enrollment.builder()
                .account(account)
                .course(course)
                .status("ACTIVE")
                .build();
        enrollment = enrollmentRepository.save(enrollment);

        // Create Payment
        String txnId = "TXN-" + UUID.randomUUID().toString().replace("-", "").substring(0, 12).toUpperCase();
        Payment payment = Payment.builder()
                .enrollment(enrollment)
                .amount(course.getPrice())
                .transactionId(txnId)
                .paymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "MOCK")
                .status("SUCCESS")
                .build();
        paymentRepository.save(payment);

        // Pre-initialize Lesson Progress placeholders
        List<Lesson> lessons = lessonRepository.findAllBySectionCourseId(course.getId());
        List<Progress> progresses = new ArrayList<>();
        for (Lesson lesson : lessons) {
            Progress progress = Progress.builder()
                    .enrollment(enrollment)
                    .lesson(lesson)
                    .completed(false)
                    .watchPercentage(0)
                    .build();
            progresses.add(progress);
        }
        progressRepository.saveAll(progresses);

        return mapToResponse(enrollment, payment, 0);
    }

    @Transactional(readOnly = true)
    public List<EnrollmentResponse> getStudentEnrollments(Long accountId) {
        List<Enrollment> enrollments = enrollmentRepository.findAllByAccountIdOrderByPurchasedAtDesc(accountId);
        List<EnrollmentResponse> responses = new ArrayList<>();

        for (Enrollment enrollment : enrollments) {
            // Find corresponding payment
            // Note: Since each enrollment has exactly one payment in our design, we can query it. Or since we just want details:
            Payment payment = paymentRepository.findAll().stream()
                    .filter(p -> p.getEnrollment().getId().equals(enrollment.getId()))
                    .findFirst()
                    .orElse(null);

            // Calculate progress percentage
            long totalLessons = lessonRepository.countBySectionCourseId(enrollment.getCourse().getId());
            long completedLessons = progressRepository.countByEnrollmentIdAndCompleted(enrollment.getId(), true);
            int progressPercentage = totalLessons > 0 ? (int) ((completedLessons * 100) / totalLessons) : 0;

            responses.add(mapToResponse(enrollment, payment, progressPercentage));
        }

        return responses;
    }

    private EnrollmentResponse mapToResponse(Enrollment enrollment, Payment payment, int progressPercentage) {
        EnrollmentResponse response = new EnrollmentResponse();
        response.setId(enrollment.getId());
        response.setCourseId(enrollment.getCourse().getId());
        response.setCourseTitle(enrollment.getCourse().getTitle());
        response.setCourseSubtitle(enrollment.getCourse().getSubtitle());
        response.setCourseThumbnail(enrollment.getCourse().getThumbnail());
        response.setPurchasedAt(enrollment.getPurchasedAt());
        response.setStatus(enrollment.getStatus());
        response.setProgressPercentage(progressPercentage);

        if (payment != null) {
            response.setTransactionId(payment.getTransactionId());
            response.setAmount(payment.getAmount());
        }

        return response;
    }
}
