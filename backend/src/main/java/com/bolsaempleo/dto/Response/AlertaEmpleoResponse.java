package com.bolsaempleo.dto.Response;

import java.time.LocalDateTime;

public record AlertaEmpleoResponse(
    Long id,
    String keyword,
    String modalidad,
    String frecuencia,
    boolean activa,
    LocalDateTime fechaCreacion
) {}
