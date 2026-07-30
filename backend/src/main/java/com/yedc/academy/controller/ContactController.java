package com.yedc.academy.controller;

import com.yedc.academy.dto.ApiResponse;
import com.yedc.academy.dto.ContactMessageRequest;
import com.yedc.academy.model.ContactMessage;
import com.yedc.academy.repository.ContactMessageRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/v1/contact")
@RequiredArgsConstructor
public class ContactController {

    private final ContactMessageRepository contactMessageRepository;
    private final JavaMailSender javaMailSender;
    private static final String TARGET_EMAIL = "avadhut.build@gmail.com";

    @PostMapping
    public ResponseEntity<ApiResponse<ContactMessage>> submitContactForm(
            @Valid @RequestBody ContactMessageRequest request) {

        // 1. Persist submission in database
        ContactMessage message = ContactMessage.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .businessCategory(request.getBusinessCategory())
                .message(request.getMessage())
                .status("NEW")
                .build();

        ContactMessage saved = contactMessageRepository.save(message);

        // 2. Dispatch real email via Gmail SMTP
        try {
            SimpleMailMessage mail = new SimpleMailMessage();
            mail.setFrom(TARGET_EMAIL);
            mail.setTo(TARGET_EMAIL);
            mail.setReplyTo(request.getEmail());
            mail.setSubject("[YEDC Academy] New Inquiry from " + request.getName());

            StringBuilder body = new StringBuilder();
            body.append("New Business Inquiry Received:\n\n");
            body.append("Full Name: ").append(request.getName()).append("\n");
            body.append("Sender Email: ").append(request.getEmail()).append("\n");
            body.append("Phone Number: ").append(request.getPhone() != null ? request.getPhone() : "N/A").append("\n");
            body.append("Business Category: ").append(request.getBusinessCategory() != null ? request.getBusinessCategory() : "N/A").append("\n\n");
            body.append("Message Content:\n").append(request.getMessage()).append("\n\n");
            body.append("--- Database Record ID: #").append(saved.getId()).append(" ---");

            mail.setText(body.toString());
            javaMailSender.send(mail);

            log.info("Successfully dispatched live SMTP email to {}", TARGET_EMAIL);

        } catch (Exception e) {
            log.error("Failed to send SMTP email to {}: {}", TARGET_EMAIL, e.getMessage(), e);
        }

        return ResponseEntity.ok(new ApiResponse<>(
                "SUCCESS",
                "Your message has been sent successfully. Our team will contact you at " + request.getEmail() + ".",
                saved
        ));
    }
}
