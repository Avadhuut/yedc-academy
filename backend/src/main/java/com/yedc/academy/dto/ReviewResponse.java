package com.yedc.academy.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ReviewResponse {
    private Long id;
    private Long accountId;
    private String studentName;
    private Short rating;
    private String comment;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
