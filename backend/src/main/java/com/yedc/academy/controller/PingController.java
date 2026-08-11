package com.yedc.academy.controller;

import com.yedc.academy.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/ping")
public class PingController {

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> ping() {
        return ResponseEntity.ok(
                new ApiResponse<>(
                        "SUCCESS",
                        "Pong",
                        Map.of(
                                "status", "UP",
                                "timestamp", Instant.now().toString()
                        )
                )
        );
    }
}
