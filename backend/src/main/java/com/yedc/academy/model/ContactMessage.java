package com.yedc.academy.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "contact_messages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContactMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 100, nullable = false)
    private String name;

    @Column(length = 150, nullable = false)
    private String email;

    @Column(length = 30)
    private String phone;

    @Column(name = "business_category", length = 100)
    private String businessCategory;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String message;

    @Column(length = 20, nullable = false)
    @Builder.Default
    private String status = "NEW";

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (status == null) {
            status = "NEW";
        }
    }
}
