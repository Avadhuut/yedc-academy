package com.yedc.academy.repository;

import com.yedc.academy.model.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Long> {
    List<Lesson> findAllBySectionIdOrderByDisplayOrderAsc(Long sectionId);
    long countBySectionCourseId(Long courseId);
    List<Lesson> findAllBySectionCourseId(Long courseId);
}
