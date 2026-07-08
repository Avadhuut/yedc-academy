package com.yedc.academy.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PaymentOrderResponse {
    private String orderId;
    private Long amount;
    private String currency;
    private String keyId;
    private boolean mockMode;
}
