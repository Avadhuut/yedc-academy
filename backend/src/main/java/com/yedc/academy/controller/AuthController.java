package com.yedc.academy.controller;

import com.yedc.academy.dto.*;
import com.yedc.academy.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<ProfileResponse>> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        ProfileResponse response = authService.register(registerRequest);
        return new ResponseEntity<>(
                new ApiResponse<>("SUCCESS", "Registration successful.", response),
                HttpStatus.CREATED
        );
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        AuthResponse response = authService.login(loginRequest);
        return ResponseEntity.ok(
                new ApiResponse<>("SUCCESS", "Login successful.", response)
        );
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logoutUser() {
        return ResponseEntity.ok(
                new ApiResponse<>("SUCCESS", "Logout successful.", null)
        );
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        authService.forgotPassword(email);
        return ResponseEntity.ok(
                new ApiResponse<>("SUCCESS", "Reset code sent successfully.", null)
        );
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String resetCode = request.get("resetCode");
        String newPassword = request.get("newPassword");
        authService.resetPassword(email, resetCode, newPassword);
        return ResponseEntity.ok(
                new ApiResponse<>("SUCCESS", "Password reset successful.", null)
        );
    }
}
