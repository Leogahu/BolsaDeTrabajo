package com.bolsaempleo.dto.Request;

public record AvisoRequest(
    String titulo,
    String descripcion,
    String requisitos,
    String ubicacion,
    Double salarioMinimo,
    Double salarioMaximo,
    String tipoModalidad,
    String tipoPuesto
) {}
