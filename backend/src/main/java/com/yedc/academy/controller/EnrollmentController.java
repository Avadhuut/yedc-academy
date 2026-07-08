package com.yedc.academy.controller;

import com.yedc.academy.dto.ApiResponse;
import com.yedc.academy.dto.EnrollmentRequest;
import com.yedc.academy.dto.EnrollmentResponse;
import com.yedc.academy.security.UserPrincipal;
import com.yedc.academy.service.EnrollmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    @PostMapping("/enrollments")
    @PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<EnrollmentResponse>> enrollStudent(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody EnrollmentRequest request) {
        EnrollmentResponse response = enrollmentService.enrollStudent(userPrincipal.getId(), request);
        return ResponseEntity.ok(
                new ApiResponse<>("SUCCESS", "Successfully enrolled in the course.", response)
        );
    }

    @GetMapping("/me/courses")
    @PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<EnrollmentResponse>>> getEnrolledCourses(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<EnrollmentResponse> courses = enrollmentService.getStudentEnrollments(userPrincipal.getId());
        return ResponseEntity.ok(
                new ApiResponse<>("SUCCESS", "Enrolled courses retrieved successfully.", courses)
        );
    }
}
