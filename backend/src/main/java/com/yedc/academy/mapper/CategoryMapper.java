package com.yedc.academy.mapper;

import com.yedc.academy.dto.CategoryResponse;
import com.yedc.academy.model.Category;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    CategoryResponse toResponse(Category category);
}
