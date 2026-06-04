package com.bolsaempleo.mapper;

import com.bolsaempleo.dto.PostanteForm;
import com.bolsaempleo.dto.PostanteUpdate;
import com.bolsaempleo.dto.Response.PostanteResponse;
import com.bolsaempleo.model.Postante;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface PostanteMapper {

    PostanteResponse toResponse(Postante postante);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "email", ignore = true)
    @Mapping(target = "username", ignore = true)
    @Mapping(target = "cvPath", ignore = true)
    @Mapping(target = "fotoPerfil", ignore = true)
    void updateEntityFromForm(PostanteForm formDto, @MappingTarget Postante postante);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "username", ignore = true)
    @Mapping(target = "descripcion", ignore = true)
    @Mapping(target = "institucion", ignore = true)
    @Mapping(target = "egresado", ignore = true)
    @Mapping(target = "cvPath", ignore = true)
    @Mapping(target = "fotoPerfil", ignore = true)
    @Mapping(target = "password", ignore = true) 
    void updateEntityFromUpdateDto(PostanteUpdate dto, @MappingTarget Postante postante);
}