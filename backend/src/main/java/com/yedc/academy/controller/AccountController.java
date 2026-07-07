package com.yedc.academy.controller;

import com.yedc.academy.dto.ApiResponse;
import com.yedc.academy.dto.ChangePasswordRequest;
import com.yedc.academy.dto.ProfileResponse;
import com.yedc.academy.dto.UpdateProfileRequest;
import com.yedc.academy.security.UserPrincipal;
import com.yedc.academy.service.AccountService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/me")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

    @GetMapping
    public ResponseEntity<ApiResponse<ProfileResponse>> getProfile(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        ProfileResponse response = accountService.getProfile(userPrincipal.getId());
        return ResponseEntity.ok(
                new ApiResponse<>("SUCCESS", "Profile retrieved successfully.", response)
        );
    }

    @PutMapping
    public ResponseEntity<ApiResponse<ProfileResponse>> updateProfile(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody UpdateProfileRequest request) {
        ProfileResponse response = accountService.updateProfile(userPrincipal.getId(), request);
        return ResponseEntity.ok(
                new ApiResponse<>("SUCCESS", "Profile updated successfully.", response)
        );
    }

    @PutMapping("/password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody ChangePasswordRequest request) {
        accountService.changePassword(userPrincipal.getId(), request);
        return ResponseEntity.ok(
                new ApiResponse<>("SUCCESS", "Password changed successfully.", null)
        );
    }
}
