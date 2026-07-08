package com.yedc.academy.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "enrollment")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Enrollment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column(name = "purchased_at", updatable = false)
    private LocalDateTime purchasedAt;

    @Column(length = 20)
    @Builder.Default
    private String status = "ACTIVE";

    @PrePersist
    protected void onCreate() {
        purchasedAt = LocalDateTime.now();
    }
}
