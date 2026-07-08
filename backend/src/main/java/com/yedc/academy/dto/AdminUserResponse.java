package com.yedc.academy.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AdminUserResponse {
    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private String role;
    private String status;
    private LocalDateTime createdAt;
}
