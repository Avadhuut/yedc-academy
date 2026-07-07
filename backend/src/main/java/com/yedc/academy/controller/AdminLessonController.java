package com.yedc.academy.controller;

import com.yedc.academy.dto.ApiResponse;
import com.yedc.academy.dto.LessonCreateRequest;
import com.yedc.academy.dto.LessonResponse;
import com.yedc.academy.dto.LessonUpdateRequest;
import com.yedc.academy.service.AdminCurriculumService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminLessonController {

    private final AdminCurriculumService adminCurriculumService;

    @PostMapping("/sections/{sectionId}/lessons")
    public ResponseEntity<ApiResponse<LessonResponse>> createLesson(
            @PathVariable("sectionId") Long sectionId,
            @Valid @RequestBody LessonCreateRequest request) {
        LessonResponse response = adminCurriculumService.createLesson(sectionId, request);
        return ResponseEntity.ok(
                new ApiResponse<>("SUCCESS", "Lesson created successfully.", response)
        );
    }

    @PutMapping("/lessons/{lessonId}")
    public ResponseEntity<ApiResponse<LessonResponse>> updateLesson(
            @PathVariable("lessonId") Long lessonId,
            @Valid @RequestBody LessonUpdateRequest request) {
        LessonResponse response = adminCurriculumService.updateLesson(lessonId, request);
        return ResponseEntity.ok(
                new ApiResponse<>("SUCCESS", "Lesson updated successfully.", response)
        );
    }

    @DeleteMapping("/lessons/{lessonId}")
    public ResponseEntity<ApiResponse<Void>> deleteLesson(@PathVariable("lessonId") Long lessonId) {
        adminCurriculumService.deleteLesson(lessonId);
        return ResponseEntity.ok(
                new ApiResponse<>("SUCCESS", "Lesson deleted successfully.", null)
        );
    }
}
