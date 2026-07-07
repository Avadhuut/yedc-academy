package com.yedc.academy.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateProfileRequest {
    @NotBlank(message = "Full name is required")
    @Size(max = 100, message = "Full name must be less than 100 characters")
    private String fullName;

    @Size(max = 20, message = "Phone must be less than 20 characters")
    private String phone;

    @Size(max = 255, message = "Profile image URL must be less than 255 characters")
    private String profileImage;
}
