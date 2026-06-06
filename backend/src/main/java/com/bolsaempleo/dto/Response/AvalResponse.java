package com.bolsaempleo.dto.Response;

public record AvalResponse(
    Long id,
    String nombreAvalador,
    String cargoInstitucion,
    String comentarioAval,
    String contactoEmail
) {}
