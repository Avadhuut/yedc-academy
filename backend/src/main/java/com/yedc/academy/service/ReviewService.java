package com.yedc.academy.service;

import com.yedc.academy.dto.ReviewRequest;
import com.yedc.academy.dto.ReviewResponse;
import com.yedc.academy.exception.BadRequestException;
import com.yedc.academy.exception.ResourceNotFoundException;
import com.yedc.academy.model.Account;
import com.yedc.academy.model.Course;
import com.yedc.academy.model.Review;
import com.yedc.academy.repository.AccountRepository;
import com.yedc.academy.repository.CourseRepository;
import com.yedc.academy.repository.EnrollmentRepository;
import com.yedc.academy.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final AccountRepository accountRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;

    /** Enrolled students only. Creates or updates the review (upsert). */
    @Transactional
    public ReviewResponse upsertReview(Long accountId, Long courseId, ReviewRequest request) {
        if (!enrollmentRepository.existsByAccountIdAndCourseId(accountId, courseId)) {
            throw new BadRequestException("You must be enrolled in this course to leave a review.");
        }

        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found: " + accountId));
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found: " + courseId));

        Review review = reviewRepository.findByAccountIdAndCourseId(accountId, courseId)
                .orElse(Review.builder().account(account).course(course).build());

        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review = reviewRepository.save(review);

        return toResponse(review);
    }

    /** Delete authenticated user's own review. */
    @Transactional
    public void deleteMyReview(Long accountId, Long courseId) {
        Review review = reviewRepository.findByAccountIdAndCourseId(accountId, courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found for this course."));
        reviewRepository.delete(review);
    }

    /** Public — returns all reviews for a course, newest first. */
    @Transactional(readOnly = true)
    public List<ReviewResponse> getCourseReviews(Long courseId) {
        return reviewRepository.findAllByCourseIdOrderByCreatedAtDesc(courseId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // ── helpers ──────────────────────────────────────────────────────────────

    private ReviewResponse toResponse(Review r) {
        ReviewResponse res = new ReviewResponse();
        res.setId(r.getId());
        res.setAccountId(r.getAccount().getId());
        res.setStudentName(r.getAccount().getFullName());
        res.setRating(r.getRating());
        res.setComment(r.getComment());
        res.setCreatedAt(r.getCreatedAt());
        res.setUpdatedAt(r.getUpdatedAt());
        return res;
    }
}
