package com.yedc.academy.dto;

import lombok.Data;
import java.util.List;

@Data
public class SectionResponse {
    private Long id;
    private String title;
    private Integer displayOrder;
    private List<LessonResponse> lessons;
}
