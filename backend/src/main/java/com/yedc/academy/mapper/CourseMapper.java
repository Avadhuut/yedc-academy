package com.yedc.academy.mapper;

import com.yedc.academy.dto.*;
import com.yedc.academy.model.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring", uses = {CategoryMapper.class, InstructorMapper.class})
public interface CourseMapper {
    CourseResponse toResponse(Course course);
    
    @Mapping(target = "id", source = "course.id")
    @Mapping(target = "title", source = "course.title")
    @Mapping(target = "subtitle", source = "course.subtitle")
    @Mapping(target = "description", source = "course.description")
    @Mapping(target = "price", source = "course.price")
    @Mapping(target = "thumbnail", source = "course.thumbnail")
    @Mapping(target = "language", source = "course.language")
    @Mapping(target = "level", source = "course.level")
    @Mapping(target = "duration", source = "course.duration")
    @Mapping(target = "category", source = "course.category")
    @Mapping(target = "instructor", source = "course.instructor")
    @Mapping(target = "sections", source = "sections")
    CourseDetailsResponse toDetailsResponse(Course course, List<SectionResponse> sections);
}
