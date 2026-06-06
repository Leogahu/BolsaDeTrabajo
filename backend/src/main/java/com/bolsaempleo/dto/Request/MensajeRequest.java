package com.bolsaempleo.dto.Request;

import jakarta.validation.constraints.NotBlank;

public record MensajeRequest(
    @NotBlank String contenido
) {}
