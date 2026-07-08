package com.yedc.academy.repository;

import com.yedc.academy.model.Certificate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, Long> {

    Optional<Certificate> findByAccountIdAndCourseId(Long accountId, Long courseId);

    Optional<Certificate> findByCertificateNumber(String certificateNumber);

    List<Certificate> findAllByAccountIdOrderByIssuedAtDesc(Long accountId);

    boolean existsByAccountIdAndCourseId(Long accountId, Long courseId);
}
