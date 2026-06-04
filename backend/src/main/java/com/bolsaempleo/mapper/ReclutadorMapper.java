package com.bolsaempleo.mapper;

import com.bolsaempleo.dto.Request.AvisoRequest;
import com.bolsaempleo.dto.Response.AvisoResponse;
import com.bolsaempleo.dto.Response.ReclutadorResponse;
import com.bolsaempleo.model.Postulacion;
import com.bolsaempleo.model.Reclutador;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ReclutadorMapper {

    ReclutadorResponse toResponse(Reclutador reclutador);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "reclutador", ignore = true)
    @Mapping(target = "fechaPublicacion", ignore = true)
    Postulacion toEntity(AvisoRequest dto);

    @Mapping(target = "empresa", source = "reclutador.empresa")
    @Mapping(target = "sueldoMin", source = "salarioMinimo")
    @Mapping(target = "sueldoMax", source = "salarioMaximo")
    @Mapping(target = "cantidadCandidatos", ignore = true)
    AvisoResponse toAvisoResponse(Postulacion postulacion);
}
