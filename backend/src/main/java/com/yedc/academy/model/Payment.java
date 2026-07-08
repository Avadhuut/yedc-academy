package com.yedc.academy.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payment")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "enrollment_id", nullable = false)
    private Enrollment enrollment;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(name = "transaction_id", length = 100, nullable = false, unique = true)
    private String transactionId;

    @Column(name = "payment_method", length = 50)
    @Builder.Default
    private String paymentMethod = "MOCK";

    @Column(length = 20)
    @Builder.Default
    private String status = "SUCCESS";

    @Column(name = "paid_at", updatable = false)
    private LocalDateTime paidAt;

    @PrePersist
    protected void onCreate() {
        paidAt = LocalDateTime.now();
    }
}
