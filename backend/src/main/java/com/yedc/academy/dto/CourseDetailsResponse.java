package com.yedc.academy.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class CourseDetailsResponse {
    private Long id;
    private String title;
    private String subtitle;
    private String description;
    private BigDecimal price;
    private String thumbnail;
    private String language;
    private String level;
    private String duration;
    private CategoryResponse category;
    private InstructorResponse instructor;
    private List<SectionResponse> sections;
}
