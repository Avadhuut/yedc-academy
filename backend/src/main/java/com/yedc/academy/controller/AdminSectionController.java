package com.yedc.academy.controller;

import com.yedc.academy.dto.ApiResponse;
import com.yedc.academy.dto.SectionCreateRequest;
import com.yedc.academy.dto.SectionResponse;
import com.yedc.academy.dto.SectionUpdateRequest;
import com.yedc.academy.service.AdminCurriculumService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminSectionController {

    private final AdminCurriculumService adminCurriculumService;

    @PostMapping("/courses/{courseId}/sections")
    public ResponseEntity<ApiResponse<SectionResponse>> createSection(
            @PathVariable("courseId") Long courseId,
            @Valid @RequestBody SectionCreateRequest request) {
        SectionResponse response = adminCurriculumService.createSection(courseId, request);
        return ResponseEntity.ok(
                new ApiResponse<>("SUCCESS", "Section created successfully.", response)
        );
    }

    @PutMapping("/sections/{sectionId}")
    public ResponseEntity<ApiResponse<SectionResponse>> updateSection(
            @PathVariable("sectionId") Long sectionId,
            @Valid @RequestBody SectionUpdateRequest request) {
        SectionResponse response = adminCurriculumService.updateSection(sectionId, request);
        return ResponseEntity.ok(
                new ApiResponse<>("SUCCESS", "Section updated successfully.", response)
        );
    }

    @DeleteMapping("/sections/{sectionId}")
    public ResponseEntity<ApiResponse<Void>> deleteSection(@PathVariable("sectionId") Long sectionId) {
        adminCurriculumService.deleteSection(sectionId);
        return ResponseEntity.ok(
                new ApiResponse<>("SUCCESS", "Section deleted successfully.", null)
        );
    }
}
