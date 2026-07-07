package com.yedc.academy.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "section")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Section {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column(length = 255, nullable = false)
    private String title;

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder;
}
