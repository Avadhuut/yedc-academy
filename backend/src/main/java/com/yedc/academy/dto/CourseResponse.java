package com.yedc.academy.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class CourseResponse {
    private Long id;
    private String title;
    private String subtitle;
    private BigDecimal price;
    private String thumbnail;
    private String language;
    private String level;
    private String duration;
    private CategoryResponse category;
    private InstructorResponse instructor;
}
