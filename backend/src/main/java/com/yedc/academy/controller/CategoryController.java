package com.yedc.academy.controller;

import com.yedc.academy.dto.ApiResponse;
import com.yedc.academy.dto.CategoryResponse;
import com.yedc.academy.mapper.CategoryMapper;
import com.yedc.academy.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    @GetMapping
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getAllCategories() {
        List<CategoryResponse> categories = categoryRepository.findAll().stream()
                .map(categoryMapper::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(
                new ApiResponse<>("SUCCESS", "Categories retrieved successfully.", categories)
        );
    }
}
