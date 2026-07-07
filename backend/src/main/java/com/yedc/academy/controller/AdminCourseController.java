package com.yedc.academy.controller;

import com.yedc.academy.dto.*;
import com.yedc.academy.service.AdminCourseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/courses")
@RequiredArgsConstructor
public class AdminCourseController {

    private final AdminCourseService adminCourseService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<CourseResponse>>> getAllCourses() {
        List<CourseResponse> courses = adminCourseService.getAllCourses();
        return ResponseEntity.ok(
                new ApiResponse<>("SUCCESS", "All courses retrieved successfully.", courses)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CourseDetailsResponse>> getCourseById(@PathVariable("id") Long id) {
        CourseDetailsResponse course = adminCourseService.getCourseById(id);
        return ResponseEntity.ok(
                new ApiResponse<>("SUCCESS", "Course details retrieved successfully.", course)
        );
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CourseResponse>> createCourse(@Valid @RequestBody CourseCreateRequest request) {
        CourseResponse course = adminCourseService.createCourse(request);
        return ResponseEntity.ok(
                new ApiResponse<>("SUCCESS", "Course created successfully.", course)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CourseResponse>> updateCourse(
            @PathVariable("id") Long id,
            @Valid @RequestBody CourseUpdateRequest request) {
        CourseResponse course = adminCourseService.updateCourse(id, request);
        return ResponseEntity.ok(
                new ApiResponse<>("SUCCESS", "Course updated successfully.", course)
        );
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<CourseResponse>> changeCourseStatus(
            @PathVariable("id") Long id,
            @Valid @RequestBody CourseStatusRequest request) {
        CourseResponse course = adminCourseService.changeCourseStatus(id, request.getStatus());
        return ResponseEntity.ok(
                new ApiResponse<>("SUCCESS", "Course status updated successfully.", course)
        );
    }
}
