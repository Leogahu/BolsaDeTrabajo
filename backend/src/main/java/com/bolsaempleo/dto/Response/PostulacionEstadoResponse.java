package com.bolsaempleo.dto.Response;

import java.time.LocalDateTime;

public record PostulacionEstadoResponse(
    Long id,
    String estado,
    LocalDateTime fechaPostulacion,
    LocalDateTime fechaActualizacion,
    String motivo,
    PostanteResumen postante,
    PostulacionResumen postulacion
) {
    public record PostanteResumen(
        Long id,
        String nombres,
        String apellidos,
        String email,
        String carrera,
        String cvPath,
        String fotoPerfil
    ) {}

    public record PostulacionResumen(
        Long id,
        String titulo,
        String ubicacion,
        String empresa
    ) {}
}
