package com.yedc.academy.controller;

import com.yedc.academy.dto.ApiResponse;
import com.yedc.academy.dto.CourseDetailsResponse;
import com.yedc.academy.dto.CourseResponse;
import com.yedc.academy.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<CourseResponse>>> getAllCourses(
            @RequestParam(value = "categoryId", required = false) Long categoryId) {
        List<CourseResponse> courses = courseService.getAllActiveCourses(categoryId);
        return ResponseEntity.ok(
                new ApiResponse<>("SUCCESS", "Courses retrieved successfully.", courses)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CourseDetailsResponse>> getCourseDetails(@PathVariable("id") Long id) {
        CourseDetailsResponse course = courseService.getCourseDetails(id);
        return ResponseEntity.ok(
                new ApiResponse<>("SUCCESS", "Course details retrieved successfully.", course)
        );
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<CourseResponse>>> searchCourses(@RequestParam("keyword") String keyword) {
        List<CourseResponse> courses = courseService.searchActiveCourses(keyword);
        return ResponseEntity.ok(
                new ApiResponse<>("SUCCESS", "Search results retrieved successfully.", courses)
        );
    }
}
