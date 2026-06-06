package com.bolsaempleo.dto.Response;

import java.time.LocalDateTime;

public record ConversacionResponse(
    Long id,
    Long postanteId,
    String postanteNombre,
    String postanteFoto,
    Long reclutadorId,
    String reclutadorNombre,
    String reclutadorEmpresa,
    String reclutadorFoto,
    String ultimoMensaje,
    LocalDateTime fechaUltimoMensaje,
    long mensajesNoLeidos,
    Long postulacionEstadoId
) {}
