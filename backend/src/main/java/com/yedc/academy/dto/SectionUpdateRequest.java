package com.yedc.academy.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class SectionUpdateRequest {
    @NotBlank(message = "Title is required")
    private String title;

    @NotNull(message = "Display order is required")
    @Min(value = 1, message = "Display order must be at least 1")
    private Integer displayOrder;
}
