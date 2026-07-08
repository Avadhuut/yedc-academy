package com.yedc.academy.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class AdminPaymentResponse {
    private Long id;
    private String transactionId;
    private String studentName;
    private String studentEmail;
    private String courseTitle;
    private BigDecimal amount;
    private String paymentMethod;
    private String status;
    private LocalDateTime paidAt;
}
