package com.yedc.academy.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class CourseUpdateRequest {
    @NotBlank(message = "Title is required")
    private String title;

    private String subtitle;

    private String description;

    @NotNull(message = "Price is required")
    @Min(value = 0, message = "Price cannot be negative")
    private BigDecimal price;

    private String thumbnail;

    private String language;

    private String level;

    @NotNull(message = "Category ID is required")
    private Long categoryId;

    @NotNull(message = "Instructor ID is required")
    private Long instructorId;
}
