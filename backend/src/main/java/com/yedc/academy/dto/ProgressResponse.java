package com.yedc.academy.dto;

import lombok.Data;

@Data
public class ProgressResponse {
    private Long lessonId;
    private Boolean completed;
    private Integer watchPercentage;
}
