package com.yedc.academy.controller;

import com.yedc.academy.dto.ApiResponse;
import com.yedc.academy.dto.ReviewRequest;
import com.yedc.academy.dto.ReviewResponse;
import com.yedc.academy.security.UserPrincipal;
import com.yedc.academy.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/courses/{courseId}/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    /** Public: list all reviews for a course */
    @GetMapping
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getCourseReviews(
            @PathVariable Long courseId) {
        List<ReviewResponse> reviews = reviewService.getCourseReviews(courseId);
        return ResponseEntity.ok(new ApiResponse<>("SUCCESS", "Reviews retrieved successfully.", reviews));
    }

    /** Authenticated enrolled student: create or update own review */
    @PostMapping
    public ResponseEntity<ApiResponse<ReviewResponse>> upsertReview(
            @PathVariable Long courseId,
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody ReviewRequest request) {
        ReviewResponse response = reviewService.upsertReview(principal.getId(), courseId, request);
        return ResponseEntity.ok(new ApiResponse<>("SUCCESS", "Review saved successfully.", response));
    }

    /** Authenticated enrolled student: delete own review */
    @DeleteMapping("/mine")
    public ResponseEntity<ApiResponse<Void>> deleteMyReview(
            @PathVariable Long courseId,
            @AuthenticationPrincipal UserPrincipal principal) {
        reviewService.deleteMyReview(principal.getId(), courseId);
        return ResponseEntity.ok(new ApiResponse<>("SUCCESS", "Review deleted successfully.", null));
    }
}
