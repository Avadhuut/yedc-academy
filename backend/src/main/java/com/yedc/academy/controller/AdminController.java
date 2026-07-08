package com.yedc.academy.controller;

import com.yedc.academy.dto.AdminAnalyticsResponse;
import com.yedc.academy.dto.AdminPaymentResponse;
import com.yedc.academy.dto.AdminUserResponse;
import com.yedc.academy.dto.ApiResponse;
import com.yedc.academy.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/analytics/dashboard")
    public ResponseEntity<ApiResponse<AdminAnalyticsResponse>> getDashboardAnalytics() {
        AdminAnalyticsResponse response = adminService.getDashboardAnalytics();
        return ResponseEntity.ok(
                new ApiResponse<>("SUCCESS", "Dashboard analytics retrieved successfully.", response)
        );
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<AdminUserResponse>>> getAllUsers() {
        List<AdminUserResponse> users = adminService.getAllUsers();
        return ResponseEntity.ok(
                new ApiResponse<>("SUCCESS", "User accounts retrieved successfully.", users)
        );
    }

    @PutMapping("/users/{userId}/status")
    public ResponseEntity<ApiResponse<AdminUserResponse>> updateUserStatus(
            @PathVariable("userId") Long userId,
            @RequestBody Map<String, String> body) {
        String status = body.get("status");
        AdminUserResponse response = adminService.updateUserStatus(userId, status);
        return ResponseEntity.ok(
                new ApiResponse<>("SUCCESS", "User status updated successfully.", response)
        );
    }

    @GetMapping("/payments")
    public ResponseEntity<ApiResponse<List<AdminPaymentResponse>>> getAllPayments() {
        List<AdminPaymentResponse> payments = adminService.getAllPayments();
        return ResponseEntity.ok(
                new ApiResponse<>("SUCCESS", "Payment history retrieved successfully.", payments)
        );
    }
}
