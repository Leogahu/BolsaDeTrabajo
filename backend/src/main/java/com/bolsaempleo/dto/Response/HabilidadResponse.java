package com.bolsaempleo.dto.Response;

public record HabilidadResponse(
    Long id,
    String nombre,
    String tipoHabilidad,
    boolean verificada
) {}
