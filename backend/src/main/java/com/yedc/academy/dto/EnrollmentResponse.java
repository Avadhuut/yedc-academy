package com.yedc.academy.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class EnrollmentResponse {
    private Long id;
    private Long courseId;
    private String courseTitle;
    private String courseSubtitle;
    private String courseThumbnail;
    private LocalDateTime purchasedAt;
    private String status;
    private String transactionId;
    private BigDecimal amount;
    private int progressPercentage;
}
