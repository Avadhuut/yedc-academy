package com.yedc.academy.repository;

import com.yedc.academy.model.Section;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SectionRepository extends JpaRepository<Section, Long> {
    List<Section> findAllByCourseIdOrderByDisplayOrderAsc(Long courseId);
}
