package com.yedc.academy.service;

import com.yedc.academy.dto.AdminAnalyticsResponse;
import com.yedc.academy.dto.AdminPaymentResponse;
import com.yedc.academy.dto.AdminUserResponse;
import com.yedc.academy.exception.BadRequestException;
import com.yedc.academy.exception.ResourceNotFoundException;
import com.yedc.academy.model.*;
import com.yedc.academy.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final AccountRepository accountRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final PaymentRepository paymentRepository;

    @Transactional(readOnly = true)
    public AdminAnalyticsResponse getDashboardAnalytics() {
        // Total revenue
        List<Payment> payments = paymentRepository.findAll();
        BigDecimal totalRevenue = payments.stream()
                .filter(p -> "SUCCESS".equals(p.getStatus()))
                .map(Payment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Total students
        long totalStudents = accountRepository.findAll().stream()
                .filter(acc -> "STUDENT".equals(acc.getRole().getName().name()))
                .count();

        // Total courses
        long totalCourses = courseRepository.count();

        // Total enrollments
        long totalEnrollments = enrollmentRepository.count();

        // Recent enrollments (latest 5)
        List<Enrollment> recentEnrollmentsRaw = enrollmentRepository.findAll(
                PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "purchasedAt"))
        ).getContent();

        List<AdminAnalyticsResponse.RecentEnrollment> recentEnrollments = recentEnrollmentsRaw.stream()
                .map(env -> new AdminAnalyticsResponse.RecentEnrollment(
                        env.getId(),
                        env.getAccount().getFullName(),
                        env.getAccount().getEmail(),
                        env.getCourse().getTitle(),
                        env.getPurchasedAt()
                ))
                .collect(Collectors.toList());

        // Course revenues
        List<Course> courses = courseRepository.findAll();
        List<AdminAnalyticsResponse.CourseRevenue> courseRevenues = new ArrayList<>();
        for (Course course : courses) {
            List<Enrollment> enrolls = enrollmentRepository.findAllByCourseId(course.getId());
            BigDecimal revenue = BigDecimal.ZERO;
            long enrollCount = enrolls.size();
            for (Enrollment env : enrolls) {
                List<Payment> pmts = paymentRepository.findAllByEnrollmentId(env.getId());
                for (Payment p : pmts) {
                    if ("SUCCESS".equals(p.getStatus())) {
                        revenue = revenue.add(p.getAmount());
                    }
                }
            }
            courseRevenues.add(new AdminAnalyticsResponse.CourseRevenue(
                    course.getId(),
                    course.getTitle(),
                    revenue,
                    enrollCount
            ));
        }

        AdminAnalyticsResponse response = new AdminAnalyticsResponse();
        response.setTotalRevenue(totalRevenue);
        response.setTotalStudents(totalStudents);
        response.setTotalCourses(totalCourses);
        response.setTotalEnrollments(totalEnrollments);
        response.setRecentEnrollments(recentEnrollments);
        response.setCourseRevenues(courseRevenues);
        return response;
    }

    @Transactional(readOnly = true)
    public List<AdminUserResponse> getAllUsers() {
        return accountRepository.findAll().stream()
                .map(acc -> {
                    AdminUserResponse res = new AdminUserResponse();
                    res.setId(acc.getId());
                    res.setFullName(acc.getFullName());
                    res.setEmail(acc.getEmail());
                    res.setPhone(acc.getPhone());
                    res.setRole(acc.getRole().getName().name());
                    res.setStatus(acc.getStatus());
                    res.setCreatedAt(acc.getCreatedAt());
                    return res;
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public AdminUserResponse updateUserStatus(Long userId, String status) {
        Account account = accountRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (!"ACTIVE".equalsIgnoreCase(status) && !"INACTIVE".equalsIgnoreCase(status)) {
            throw new BadRequestException("Invalid status: " + status + ". Allowed values: ACTIVE, INACTIVE");
        }

        account.setStatus(status.toUpperCase());
        account = accountRepository.save(account);

        AdminUserResponse res = new AdminUserResponse();
        res.setId(account.getId());
        res.setFullName(account.getFullName());
        res.setEmail(account.getEmail());
        res.setPhone(account.getPhone());
        res.setRole(account.getRole().getName().name());
        res.setStatus(account.getStatus());
        res.setCreatedAt(account.getCreatedAt());
        return res;
    }

    @Transactional(readOnly = true)
    public List<AdminPaymentResponse> getAllPayments() {
        List<Payment> payments = paymentRepository.findAllByOrderByPaidAtDesc();
        return payments.stream()
                .map(p -> {
                    AdminPaymentResponse res = new AdminPaymentResponse();
                    res.setId(p.getId());
                    res.setTransactionId(p.getTransactionId());
                    res.setStudentName(p.getEnrollment().getAccount().getFullName());
                    res.setStudentEmail(p.getEnrollment().getAccount().getEmail());
                    res.setCourseTitle(p.getEnrollment().getCourse().getTitle());
                    res.setAmount(p.getAmount());
                    res.setPaymentMethod(p.getPaymentMethod());
                    res.setStatus(p.getStatus());
                    res.setPaidAt(p.getPaidAt());
                    return res;
                })
                .collect(Collectors.toList());
    }
}
