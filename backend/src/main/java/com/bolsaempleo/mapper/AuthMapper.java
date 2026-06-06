package com.bolsaempleo.mapper;

import com.bolsaempleo.dto.Response.AuthResponse;
import com.bolsaempleo.model.Postante;
import com.bolsaempleo.model.Reclutador;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface AuthMapper {

    @Mapping(target = "nombreCompleto", source = ".", qualifiedByName = "mapNombrePostante")
    @Mapping(target = "empresa", ignore = true)
    @Mapping(target = "fotoPerfil", source = "fotoPerfil")
    @Mapping(target = "tipo", constant = "postante")
    @Mapping(target = "token", ignore = true)
    AuthResponse toAuthResponse(Postante postante);

    @Mapping(target = "nombreCompleto", source = ".", qualifiedByName = "mapNombreReclutador")
    @Mapping(target = "fotoPerfil", source = "fotoPerfil")
    @Mapping(target = "tipo", constant = "reclutador")
    @Mapping(target = "token", ignore = true)
    AuthResponse toAuthResponse(Reclutador reclutador);

    @Named("mapNombrePostante")
    default String mapNombrePostante(Postante p) {
        if (p == null) return "";
        return (p.getNombres() + " " + p.getApellidos()).trim();
    }

    @Named("mapNombreReclutador")
    default String mapNombreReclutador(Reclutador r) {
        if (r == null) return "";
        return (r.getNombres() + " " + r.getApellidos()).trim();
    }
}
