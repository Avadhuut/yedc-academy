package com.yedc.academy.repository;

import com.yedc.academy.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findAllByCourseIdOrderByCreatedAtDesc(Long courseId);

    Optional<Review> findByAccountIdAndCourseId(Long accountId, Long courseId);

    boolean existsByAccountIdAndCourseId(Long accountId, Long courseId);

    @Query("SELECT COALESCE(AVG(CAST(r.rating AS double)), 0.0) FROM Review r WHERE r.course.id = :courseId")
    Double findAverageRatingByCourseId(@Param("courseId") Long courseId);

    long countByCourseId(Long courseId);
}
