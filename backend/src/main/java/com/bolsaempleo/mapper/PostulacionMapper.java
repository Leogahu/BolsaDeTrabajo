package com.bolsaempleo.mapper;

import com.bolsaempleo.dto.EmpresaInfo;
import com.bolsaempleo.dto.Response.PostulacionDetailResponse;
import com.bolsaempleo.dto.Response.PostulacionItemResponse;
import com.bolsaempleo.model.Postulacion;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface PostulacionMapper {

    @Mapping(target = "empresa", source = "postulacion", qualifiedByName = "mapEmpresaInfo")
    @Mapping(target = "sueldoMin", source = "salarioMinimo")
    @Mapping(target = "sueldoMax", source = "salarioMaximo")
    PostulacionDetailResponse toDetailResponse(Postulacion postulacion);

    @Mapping(target = "empresa", source = "postulacion", qualifiedByName = "mapEmpresaInfo")
    @Mapping(target = "sueldoMin", source = "salarioMinimo")
    @Mapping(target = "sueldoMax", source = "salarioMaximo")
    PostulacionItemResponse toItemResponse(Postulacion postulacion);

    @Named("mapEmpresaInfo")
    default EmpresaInfo mapEmpresaInfo(Postulacion postulacion) {
        String nombreEmpresa = "Empresa Aliada";
        String fotoEmpresa = null;
        if (postulacion.getReclutador() != null) {
            if (postulacion.getReclutador().getEmpresa() != null) {
                nombreEmpresa = postulacion.getReclutador().getEmpresa();
            }
            fotoEmpresa = postulacion.getReclutador().getFotoPerfil();
        }
        return new EmpresaInfo(nombreEmpresa, 3, fotoEmpresa);
    }
}
