package com.yedc.academy.repository;

import com.yedc.academy.model.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    boolean existsByAccountIdAndCourseId(Long accountId, Long courseId);
    List<Enrollment> findAllByAccountIdOrderByPurchasedAtDesc(Long accountId);
    Optional<Enrollment> findByAccountIdAndCourseId(Long accountId, Long courseId);
    List<Enrollment> findAllByCourseId(Long courseId);
}
