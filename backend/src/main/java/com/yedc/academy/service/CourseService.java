package com.yedc.academy.service;

import com.yedc.academy.dto.CourseDetailsResponse;
import com.yedc.academy.dto.CourseResponse;
import com.yedc.academy.dto.LessonResponse;
import com.yedc.academy.dto.SectionResponse;
import com.yedc.academy.exception.ResourceNotFoundException;
import com.yedc.academy.mapper.CourseMapper;
import com.yedc.academy.mapper.SectionMapper;
import com.yedc.academy.model.Course;
import com.yedc.academy.model.Lesson;
import com.yedc.academy.model.Section;
import com.yedc.academy.repository.CourseRepository;
import com.yedc.academy.repository.LessonRepository;
import com.yedc.academy.repository.SectionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;
    private final SectionRepository sectionRepository;
    private final LessonRepository lessonRepository;
    private final CourseMapper courseMapper;
    private final SectionMapper sectionMapper;

    @Transactional(readOnly = true)
    public List<CourseResponse> getAllActiveCourses(Long categoryId) {
        List<Course> courses;
        if (categoryId != null) {
            courses = courseRepository.findAllByCategoryIdAndStatus(categoryId, "ACTIVE");
        } else {
            courses = courseRepository.findAllByStatus("ACTIVE");
        }
        return courses.stream()
                .map(courseMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CourseResponse> searchActiveCourses(String keyword) {
        List<Course> courses = courseRepository.searchActiveCourses(keyword, "ACTIVE");
        return courses.stream()
                .map(courseMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CourseDetailsResponse getCourseDetails(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + courseId));

        List<Section> sections = sectionRepository.findAllByCourseIdOrderByDisplayOrderAsc(courseId);
        List<SectionResponse> sectionResponses = new ArrayList<>();

        for (Section section : sections) {
            List<Lesson> lessons = lessonRepository.findAllBySectionIdOrderByDisplayOrderAsc(section.getId());
            List<LessonResponse> lessonResponses = lessons.stream()
                    .map(lesson -> {
                        LessonResponse res = sectionMapper.toLessonResponse(lesson);
                        if (!lesson.getPreviewEnabled()) {
                            res.setVideoUrl(null);
                        }
                        return res;
                    })
                    .collect(Collectors.toList());

            sectionResponses.add(sectionMapper.toResponse(section, lessonResponses));
        }

        return courseMapper.toDetailsResponse(course, sectionResponses);
    }
}
