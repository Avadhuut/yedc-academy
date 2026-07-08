package com.yedc.academy.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CertificateResponse {
    private Long id;
    private String certificateNumber;
    private String courseTitle;
    private String courseThumbnail;
    private String instructorName;
    private String studentName;
    private LocalDateTime issuedAt;
}
