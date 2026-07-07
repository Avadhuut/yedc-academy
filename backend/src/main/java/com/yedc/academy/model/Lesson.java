package com.yedc.academy.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "lesson")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Lesson {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "section_id", nullable = false)
    private Section section;

    @Column(length = 255, nullable = false)
    private String title;

    @Column(name = "video_url", length = 255, nullable = false)
    private String videoUrl;

    @Column(name = "pdf_url", length = 255)
    private String pdfUrl;

    @Builder.Default
    private Integer duration = 0;

    @Column(name = "preview_enabled")
    @Builder.Default
    private Boolean previewEnabled = false;

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder;
}
