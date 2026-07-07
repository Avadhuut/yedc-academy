package com.yedc.academy.mapper;

import com.yedc.academy.dto.InstructorResponse;
import com.yedc.academy.model.Instructor;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface InstructorMapper {
    InstructorResponse toResponse(Instructor instructor);
}
