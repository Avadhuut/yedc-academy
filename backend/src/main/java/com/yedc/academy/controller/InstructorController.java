package com.yedc.academy.controller;

import com.yedc.academy.dto.ApiResponse;
import com.yedc.academy.dto.InstructorResponse;
import com.yedc.academy.exception.ResourceNotFoundException;
import com.yedc.academy.mapper.InstructorMapper;
import com.yedc.academy.model.Instructor;
import com.yedc.academy.repository.InstructorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/instructors")
@RequiredArgsConstructor
public class InstructorController {

    private final InstructorRepository instructorRepository;
    private final InstructorMapper instructorMapper;

    @GetMapping
    public ResponseEntity<ApiResponse<List<InstructorResponse>>> getAllInstructors() {
        List<InstructorResponse> instructors = instructorRepository.findAll().stream()
                .map(instructorMapper::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(
                new ApiResponse<>("SUCCESS", "Instructors retrieved successfully.", instructors)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<InstructorResponse>> getInstructorDetails(@PathVariable("id") Long id) {
        Instructor instructor = instructorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Instructor not found with id: " + id));
        return ResponseEntity.ok(
                new ApiResponse<>("SUCCESS", "Instructor details retrieved successfully.", instructorMapper.toResponse(instructor))
        );
    }
}
