package com.yedc.academy.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class LessonCreateRequest {
    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Video URL is required")
    private String videoUrl;

    private String pdfUrl;

    @NotNull(message = "Duration is required")
    @Min(value = 0, message = "Duration cannot be negative")
    private Integer duration;

    @NotNull(message = "Preview enabled is required")
    private Boolean previewEnabled;

    @NotNull(message = "Display order is required")
    @Min(value = 1, message = "Display order must be at least 1")
    private Integer displayOrder;
}
