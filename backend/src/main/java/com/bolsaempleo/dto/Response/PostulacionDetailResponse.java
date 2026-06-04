package com.bolsaempleo.dto.Response;
import com.bolsaempleo.dto.EmpresaInfo;

public record PostulacionDetailResponse(
    Long id,
    String titulo,
    String descripcion,
    String requisitos,
    String ubicacion,
    Object fechaPublicacion, 
    Double sueldoMin,
    Double sueldoMax,
    String tipoModalidad,
    String tipoPuesto,
    EmpresaInfo empresa
) {}
