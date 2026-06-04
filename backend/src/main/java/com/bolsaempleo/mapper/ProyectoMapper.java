package com.bolsaempleo.mapper;

import com.bolsaempleo.dto.Request.ProyectoRequest;
import com.bolsaempleo.dto.Response.ProyectoResponse;
import com.bolsaempleo.model.Proyectos;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ProyectoMapper {

    ProyectoResponse toResponse(Proyectos proyecto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "postante", ignore = true)
    Proyectos toEntity(ProyectoRequest dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "postante", ignore = true)
    void updateEntityFromDto(ProyectoRequest dto, @MappingTarget Proyectos proyecto);
}
