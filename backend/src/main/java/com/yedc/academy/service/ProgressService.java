package com.yedc.academy.service;

import com.yedc.academy.dto.ProgressRequest;
import com.yedc.academy.dto.ProgressResponse;
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

@Service
@RequiredArgsConstructor
public class ProgressService {

    private final EnrollmentRepository enrollmentRepository;
    private final LessonRepository lessonRepository;
    private final ProgressRepository progressRepository;
    private final CertificateService certificateService;

    @Transactional(readOnly = true)
    public Lesson getLessonWithAccessCheck(Long accountId, Long lessonId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found with id: " + lessonId));

        // If the lesson is public/preview, allow access anyway
        if (Boolean.TRUE.equals(lesson.getPreviewEnabled())) {
            return lesson;
        }

        Long courseId = lesson.getSection().getCourse().getId();
        boolean hasAccess = enrollmentRepository.existsByAccountIdAndCourseId(accountId, courseId);
        
        if (!hasAccess) {
            throw new BadRequestException("You must be enrolled in this course to access this lesson.");
        }

        return lesson;
    }

    @Transactional
    public ProgressResponse updateProgress(Long accountId, Long lessonId, ProgressRequest request) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found with id: " + lessonId));

        Long courseId = lesson.getSection().getCourse().getId();
        Enrollment enrollment = enrollmentRepository.findByAccountIdAndCourseId(accountId, courseId)
                .orElseThrow(() -> new BadRequestException("You are not enrolled in this course."));

        Progress progress = progressRepository.findByEnrollmentIdAndLessonId(enrollment.getId(), lessonId)
                .orElseGet(() -> Progress.builder()
                        .enrollment(enrollment)
                        .lesson(lesson)
                        .completed(false)
                        .watchPercentage(0)
                        .build());

        if (request.getWatchPercentage() != null) {
            progress.setWatchPercentage(Math.max(progress.getWatchPercentage(), request.getWatchPercentage()));
            // Auto complete if watched more than 90%
            if (progress.getWatchPercentage() >= 90 && !Boolean.TRUE.equals(progress.getCompleted())) {
                progress.setCompleted(true);
                progress.setCompletedAt(LocalDateTime.now());
            }
        }

        if (request.getCompleted() != null) {
            if (request.getCompleted() && !Boolean.TRUE.equals(progress.getCompleted())) {
                progress.setCompleted(true);
                progress.setCompletedAt(LocalDateTime.now());
            } else if (!request.getCompleted()) {
                progress.setCompleted(false);
                progress.setCompletedAt(null);
            }
        }

        progress = progressRepository.save(progress);

        // Auto-issue certificate if all lessons are now complete
        certificateService.autoIssueCertificateIfComplete(accountId, courseId);

        return mapToResponse(progress);
    }

    @Transactional(readOnly = true)
    public List<ProgressResponse> getCourseProgress(Long accountId, Long courseId) {
        Enrollment enrollment = enrollmentRepository.findByAccountIdAndCourseId(accountId, courseId)
                .orElseThrow(() -> new BadRequestException("You are not enrolled in this course."));

        List<Progress> progressList = progressRepository.findAllByEnrollmentId(enrollment.getId());
        List<ProgressResponse> responses = new ArrayList<>();
        for (Progress p : progressList) {
            responses.add(mapToResponse(p));
        }
        return responses;
    }

    private ProgressResponse mapToResponse(Progress progress) {
        ProgressResponse response = new ProgressResponse();
        response.setLessonId(progress.getLesson().getId());
        response.setCompleted(progress.getCompleted());
        response.setWatchPercentage(progress.getWatchPercentage());
        return response;
    }
}
