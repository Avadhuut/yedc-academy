package com.yedc.academy.repository;

import com.yedc.academy.model.Progress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProgressRepository extends JpaRepository<Progress, Long> {
    Optional<Progress> findByEnrollmentIdAndLessonId(Long enrollmentId, Long lessonId);
    List<Progress> findAllByEnrollmentId(Long enrollmentId);
    long countByEnrollmentIdAndCompleted(Long enrollmentId, boolean completed);
    long countByEnrollmentId(Long enrollmentId);
}
