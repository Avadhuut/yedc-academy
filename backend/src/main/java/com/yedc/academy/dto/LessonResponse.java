package com.yedc.academy.dto;

import lombok.Data;

@Data
public class LessonResponse {
    private Long id;
    private String title;
    private String videoUrl;
    private String pdfUrl;
    private Integer duration;
    private Boolean previewEnabled;
    private Integer displayOrder;
}
