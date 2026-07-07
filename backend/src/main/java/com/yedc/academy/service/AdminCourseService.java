package com.yedc.academy.service;

import com.yedc.academy.dto.*;
import com.yedc.academy.exception.ResourceNotFoundException;
import com.yedc.academy.mapper.CourseMapper;
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
public class AdminCourseService {

    private final CourseRepository courseRepository;
    private final CategoryRepository categoryRepository;
    private final InstructorRepository instructorRepository;
    private final SectionRepository sectionRepository;
    private final LessonRepository lessonRepository;
    private final CourseMapper courseMapper;
    private final SectionMapper sectionMapper;

    @Transactional(readOnly = true)
    public List<CourseResponse> getAllCourses() {
        return courseRepository.findAll().stream()
                .map(courseMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CourseDetailsResponse getCourseById(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));

        List<Section> sections = sectionRepository.findAllByCourseIdOrderByDisplayOrderAsc(id);
        List<SectionResponse> sectionResponses = new ArrayList<>();

        for (Section section : sections) {
            List<Lesson> lessons = lessonRepository.findAllBySectionIdOrderByDisplayOrderAsc(section.getId());
            List<LessonResponse> lessonResponses = lessons.stream()
                    .map(sectionMapper::toLessonResponse)
                    .collect(Collectors.toList());

            sectionResponses.add(sectionMapper.toResponse(section, lessonResponses));
        }

        return courseMapper.toDetailsResponse(course, sectionResponses);
    }

    @Transactional
    public CourseResponse createCourse(CourseCreateRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        Instructor instructor = instructorRepository.findById(request.getInstructorId())
                .orElseThrow(() -> new ResourceNotFoundException("Instructor not found with id: " + request.getInstructorId()));

        Course course = Course.builder()
                .title(request.getTitle())
                .subtitle(request.getSubtitle())
                .description(request.getDescription())
                .price(request.getPrice())
                .thumbnail(request.getThumbnail())
                .language(request.getLanguage() != null ? request.getLanguage() : "English")
                .level(request.getLevel() != null ? request.getLevel() : "BEGINNER")
                .category(category)
                .instructor(instructor)
                .status("INACTIVE")
                .build();

        Course savedCourse = courseRepository.save(course);
        return courseMapper.toResponse(savedCourse);
    }

    @Transactional
    public CourseResponse updateCourse(Long id, CourseUpdateRequest request) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        Instructor instructor = instructorRepository.findById(request.getInstructorId())
                .orElseThrow(() -> new ResourceNotFoundException("Instructor not found with id: " + request.getInstructorId()));

        course.setTitle(request.getTitle());
        course.setSubtitle(request.getSubtitle());
        course.setDescription(request.getDescription());
        course.setPrice(request.getPrice());
        course.setThumbnail(request.getThumbnail());
        if (request.getLanguage() != null) {
            course.setLanguage(request.getLanguage());
        }
        if (request.getLevel() != null) {
            course.setLevel(request.getLevel());
        }
        course.setCategory(category);
        course.setInstructor(instructor);

        Course updatedCourse = courseRepository.save(course);
        return courseMapper.toResponse(updatedCourse);
    }

    @Transactional
    public CourseResponse changeCourseStatus(Long id, String status) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));

        String normalizedStatus = status.toUpperCase();
        if (!normalizedStatus.equals("ACTIVE") && !normalizedStatus.equals("INACTIVE")) {
            throw new IllegalArgumentException("Invalid status value. Must be ACTIVE or INACTIVE.");
        }

        course.setStatus(normalizedStatus);
        Course updatedCourse = courseRepository.save(course);
        return courseMapper.toResponse(updatedCourse);
    }
}
