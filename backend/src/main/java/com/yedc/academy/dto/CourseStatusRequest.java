package com.yedc.academy.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CourseStatusRequest {
    @NotBlank(message = "Status is required")
    private String status;
}
