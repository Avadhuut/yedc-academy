package com.yedc.academy.service;

import com.yedc.academy.dto.*;
import com.yedc.academy.exception.ResourceNotFoundException;
import com.yedc.academy.mapper.SectionMapper;
import com.yedc.academy.model.*;
import com.yedc.academy.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminCurriculumService {

    private final CourseRepository courseRepository;
    private final SectionRepository sectionRepository;
    private final LessonRepository lessonRepository;
    private final SectionMapper sectionMapper;

    @Transactional
    public SectionResponse createSection(Long courseId, SectionCreateRequest request) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + courseId));

        Section section = Section.builder()
                .course(course)
                .title(request.getTitle())
                .displayOrder(request.getDisplayOrder())
                .build();

        Section savedSection = sectionRepository.save(section);
        
        // Reorder list to maintain sequential display orders and resolve potential unique conflicts
        reorderSections(courseId, savedSection.getId(), request.getDisplayOrder());

        // Refresh and return
        Section updatedSection = sectionRepository.findById(savedSection.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Section not found"));

        return sectionMapper.toResponse(updatedSection, new ArrayList<>());
    }

    @Transactional
    public SectionResponse updateSection(Long sectionId, SectionUpdateRequest request) {
        Section section = sectionRepository.findById(sectionId)
                .orElseThrow(() -> new ResourceNotFoundException("Section not found with id: " + sectionId));

        section.setTitle(request.getTitle());
        section.setDisplayOrder(request.getDisplayOrder());
        Section savedSection = sectionRepository.save(section);

        reorderSections(section.getCourse().getId(), savedSection.getId(), request.getDisplayOrder());

        // Fetch lessons to return correct response
        List<Lesson> lessons = lessonRepository.findAllBySectionIdOrderByDisplayOrderAsc(sectionId);
        List<LessonResponse> lessonResponses = lessons.stream()
                .map(sectionMapper::toLessonResponse)
                .collect(Collectors.toList());

        Section updatedSection = sectionRepository.findById(sectionId)
                .orElseThrow(() -> new ResourceNotFoundException("Section not found"));

        return sectionMapper.toResponse(updatedSection, lessonResponses);
    }

    @Transactional
    public void deleteSection(Long sectionId) {
        Section section = sectionRepository.findById(sectionId)
                .orElseThrow(() -> new ResourceNotFoundException("Section not found with id: " + sectionId));

        Long courseId = section.getCourse().getId();

        // Delete all lessons under this section first to avoid foreign key violations
        List<Lesson> lessons = lessonRepository.findAllBySectionIdOrderByDisplayOrderAsc(sectionId);
        lessonRepository.deleteAll(lessons);

        sectionRepository.delete(section);

        // Reindex remaining sections
        reorderSections(courseId, null, 0);
    }

    @Transactional
    public LessonResponse createLesson(Long sectionId, LessonCreateRequest request) {
        Section section = sectionRepository.findById(sectionId)
                .orElseThrow(() -> new ResourceNotFoundException("Section not found with id: " + sectionId));

        Lesson lesson = Lesson.builder()
                .section(section)
                .title(request.getTitle())
                .videoUrl(request.getVideoUrl())
                .pdfUrl(request.getPdfUrl())
                .duration(request.getDuration())
                .previewEnabled(request.getPreviewEnabled())
                .displayOrder(request.getDisplayOrder())
                .build();

        Lesson savedLesson = lessonRepository.save(lesson);

        reorderLessons(sectionId, savedLesson.getId(), request.getDisplayOrder());

        Lesson updatedLesson = lessonRepository.findById(savedLesson.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found"));

        return sectionMapper.toLessonResponse(updatedLesson);
    }

    @Transactional
    public LessonResponse updateLesson(Long lessonId, LessonUpdateRequest request) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found with id: " + lessonId));

        lesson.setTitle(request.getTitle());
        lesson.setVideoUrl(request.getVideoUrl());
        lesson.setPdfUrl(request.getPdfUrl());
        lesson.setDuration(request.getDuration());
        lesson.setPreviewEnabled(request.getPreviewEnabled());
        lesson.setDisplayOrder(request.getDisplayOrder());

        Lesson savedLesson = lessonRepository.save(lesson);

        reorderLessons(lesson.getSection().getId(), savedLesson.getId(), request.getDisplayOrder());

        Lesson updatedLesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found"));

        return sectionMapper.toLessonResponse(updatedLesson);
    }

    @Transactional
    public void deleteLesson(Long lessonId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found with id: " + lessonId));

        Long sectionId = lesson.getSection().getId();
        lessonRepository.delete(lesson);

        // Reindex remaining lessons
        reorderLessons(sectionId, null, 0);
    }

    private void reorderSections(Long courseId, Long sectionIdToMove, int targetOrder) {
        List<Section> sections = sectionRepository.findAllByCourseIdOrderByDisplayOrderAsc(courseId);
        Section sectionToMove = null;
        List<Section> others = new ArrayList<>();
        for (Section s : sections) {
            if (s.getId().equals(sectionIdToMove)) {
                sectionToMove = s;
            } else {
                others.add(s);
            }
        }

        int index = Math.min(Math.max(0, targetOrder - 1), others.size());
        if (sectionToMove != null) {
            others.add(index, sectionToMove);
        }

        // Apply temporary negative orders to bypass unique database constraint uq_section_order
        for (int i = 0; i < others.size(); i++) {
            Section s = others.get(i);
            s.setDisplayOrder(-(i + 1));
            sectionRepository.saveAndFlush(s);
        }

        // Write sequential positive orders
        for (int i = 0; i < others.size(); i++) {
            Section s = others.get(i);
            s.setDisplayOrder(i + 1);
            sectionRepository.saveAndFlush(s);
        }
    }

    private void reorderLessons(Long sectionId, Long lessonIdToMove, int targetOrder) {
        List<Lesson> lessons = lessonRepository.findAllBySectionIdOrderByDisplayOrderAsc(sectionId);
        Lesson lessonToMove = null;
        List<Lesson> others = new ArrayList<>();
        for (Lesson l : lessons) {
            if (l.getId().equals(lessonIdToMove)) {
                lessonToMove = l;
            } else {
                others.add(l);
            }
        }

        int index = Math.min(Math.max(0, targetOrder - 1), others.size());
        if (lessonToMove != null) {
            others.add(index, lessonToMove);
        }

        // Apply temporary negative orders to bypass unique database constraint uq_lesson_order
        for (int i = 0; i < others.size(); i++) {
            Lesson l = others.get(i);
            l.setDisplayOrder(-(i + 1));
            lessonRepository.saveAndFlush(l);
        }

        // Write sequential positive orders
        for (int i = 0; i < others.size(); i++) {
            Lesson l = others.get(i);
            l.setDisplayOrder(i + 1);
            lessonRepository.saveAndFlush(l);
        }
    }
}
