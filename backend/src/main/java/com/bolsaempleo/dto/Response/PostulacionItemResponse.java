package com.bolsaempleo.dto.Response;
import com.bolsaempleo.dto.EmpresaInfo;

public record PostulacionItemResponse(
    Long id,
    String titulo,
    String ubicacion,
    Object fechaPublicacion,
    Double sueldoMin,
    Double sueldoMax,
    String tipoModalidad,
    String tipoPuesto,
    EmpresaInfo empresa
) {}
