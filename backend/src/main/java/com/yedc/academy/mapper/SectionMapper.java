package com.yedc.academy.mapper;

import com.yedc.academy.dto.LessonResponse;
import com.yedc.academy.dto.SectionResponse;
import com.yedc.academy.model.Lesson;
import com.yedc.academy.model.Section;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface SectionMapper {
    @Mapping(target = "lessons", source = "lessons")
    SectionResponse toResponse(Section section, List<LessonResponse> lessons);

    LessonResponse toLessonResponse(Lesson lesson);
}
