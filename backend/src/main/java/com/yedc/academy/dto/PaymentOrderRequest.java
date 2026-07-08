package com.yedc.academy.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PaymentOrderRequest {
    @NotNull(message = "Course ID is required")
    private Long courseId;
}
