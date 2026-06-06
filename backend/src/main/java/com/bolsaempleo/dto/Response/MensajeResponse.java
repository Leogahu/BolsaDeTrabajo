package com.bolsaempleo.dto.Response;

import java.time.LocalDateTime;

public record MensajeResponse(
    Long id,
    Long conversacionId,
    String remitenteTipo,
    Long remitenteId,
    String contenido,
    boolean leido,
    LocalDateTime fechaEnvio
) {}
