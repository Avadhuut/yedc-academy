package com.yedc.academy.controller;

import com.yedc.academy.dto.ApiResponse;
import com.yedc.academy.dto.PaymentOrderRequest;
import com.yedc.academy.dto.PaymentOrderResponse;
import com.yedc.academy.dto.PaymentVerificationRequest;
import com.yedc.academy.security.UserPrincipal;
import com.yedc.academy.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/order")
    @PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PaymentOrderResponse>> createPaymentOrder(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody PaymentOrderRequest request) {
        PaymentOrderResponse response = paymentService.createOrder(userPrincipal.getId(), request);
        return ResponseEntity.ok(
                new ApiResponse<>("SUCCESS", "Successfully initiated payment order.", response)
        );
    }

    @PostMapping("/verify")
    @PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> verifyPayment(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody PaymentVerificationRequest request) {
        paymentService.verifyPayment(userPrincipal.getId(), request);
        return ResponseEntity.ok(
                new ApiResponse<>("SUCCESS", "Payment verified and course unlocked successfully.", null)
        );
    }
}
