package com.bolsaempleo.dto.Response;

import java.time.LocalDateTime;

public record NotificacionResponse(
    Long id,
    String titulo,
    String mensaje,
    String tipo,
    Long referenciaId,
    boolean leida,
    LocalDateTime fechaCreacion
) {}
