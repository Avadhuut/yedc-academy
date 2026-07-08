package com.yedc.academy.repository;

import com.yedc.academy.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findAllByEnrollmentId(Long enrollmentId);
    List<Payment> findAllByOrderByPaidAtDesc();
    java.util.Optional<Payment> findByTransactionId(String transactionId);
}
