package com.yedc.academy.controller;

import com.yedc.academy.dto.ApiResponse;
import com.yedc.academy.dto.LessonResponse;
import com.yedc.academy.dto.ProgressRequest;
import com.yedc.academy.dto.ProgressResponse;
import com.yedc.academy.mapper.SectionMapper;
import com.yedc.academy.model.Lesson;
import com.yedc.academy.security.UserPrincipal;
import com.yedc.academy.service.ProgressService;
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
public class ProgressController {

    private final ProgressService progressService;
    private final SectionMapper sectionMapper;

    @GetMapping("/lessons/{lessonId}")
    @PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<LessonResponse>> getLessonDetails(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable("lessonId") Long lessonId) {
        Lesson lesson = progressService.getLessonWithAccessCheck(userPrincipal.getId(), lessonId);
        LessonResponse response = sectionMapper.toLessonResponse(lesson);
        return ResponseEntity.ok(
                new ApiResponse<>("SUCCESS", "Lesson details retrieved successfully.", response)
        );
    }

    @PostMapping("/lessons/{lessonId}/progress")
    @PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ProgressResponse>> updateProgress(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable("lessonId") Long lessonId,
            @Valid @RequestBody ProgressRequest request) {
        ProgressResponse response = progressService.updateProgress(userPrincipal.getId(), lessonId, request);
        return ResponseEntity.ok(
                new ApiResponse<>("SUCCESS", "Progress updated successfully.", response)
        );
    }

    @GetMapping("/me/progress")
    @PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<ProgressResponse>>> getCourseProgress(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam("courseId") Long courseId) {
        List<ProgressResponse> responses = progressService.getCourseProgress(userPrincipal.getId(), courseId);
        return ResponseEntity.ok(
                new ApiResponse<>("SUCCESS", "Course progress retrieved successfully.", responses)
        );
    }
}
