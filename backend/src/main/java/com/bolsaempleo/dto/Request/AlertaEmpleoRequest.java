package com.bolsaempleo.dto.Request;

import jakarta.validation.constraints.NotBlank;

public record AlertaEmpleoRequest(
    @NotBlank String keyword,
    String modalidad,
    String frecuencia
) {}
