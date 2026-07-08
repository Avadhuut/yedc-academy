package com.yedc.academy.controller;

import com.yedc.academy.dto.ApiResponse;
import com.yedc.academy.dto.CertificateResponse;
import com.yedc.academy.security.UserPrincipal;
import com.yedc.academy.service.CertificateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class CertificateController {

    private final CertificateService certificateService;

    /** Authenticated: list all my earned certificates */
    @GetMapping("/api/v1/me/certificates")
    public ResponseEntity<ApiResponse<List<CertificateResponse>>> getMyCertificates(
            @AuthenticationPrincipal UserPrincipal principal) {
        List<CertificateResponse> certs = certificateService.getMyCertificates(principal.getId());
        return ResponseEntity.ok(new ApiResponse<>("SUCCESS", "Certificates retrieved successfully.", certs));
    }

    /** Authenticated enrolled student: claim certificate (checks completion) */
    @PostMapping("/api/v1/courses/{courseId}/certificates/claim")
    public ResponseEntity<ApiResponse<CertificateResponse>> claimCertificate(
            @PathVariable Long courseId,
            @AuthenticationPrincipal UserPrincipal principal) {
        CertificateResponse cert = certificateService.issueCertificate(principal.getId(), courseId);
        return ResponseEntity.ok(new ApiResponse<>("SUCCESS", "Certificate issued successfully.", cert));
    }

    /** Public: verify a certificate by its unique number */
    @GetMapping("/api/v1/certificates/{certificateNumber}")
    public ResponseEntity<ApiResponse<CertificateResponse>> verifyCertificate(
            @PathVariable String certificateNumber) {
        CertificateResponse cert = certificateService.getByNumber(certificateNumber);
        return ResponseEntity.ok(new ApiResponse<>("SUCCESS", "Certificate verified successfully.", cert));
    }

    /** Public: download certificate PDF */
    @GetMapping("/api/v1/certificates/{certificateNumber}/download")
    public ResponseEntity<byte[]> downloadCertificate(
            @PathVariable String certificateNumber) {
        byte[] pdfBytes = certificateService.generatePdf(certificateNumber);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"certificate-" + certificateNumber + ".pdf\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }
}
