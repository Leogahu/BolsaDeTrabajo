package com.bolsaempleo.dto.Request;

import jakarta.validation.constraints.NotBlank;

public record CertificadoRequest(
    @NotBlank String nombreCurso,
    String institucionEmisora
) {}
