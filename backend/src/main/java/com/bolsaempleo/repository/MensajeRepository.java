package com.bolsaempleo.repository;

import com.bolsaempleo.model.Mensaje;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MensajeRepository extends JpaRepository<Mensaje, Long> {
    List<Mensaje> findByConversacionIdOrderByFechaEnvioAsc(Long conversacionId);

    long countByConversacionIdAndLeidoFalseAndRemitenteTipoNot(
        Long conversacionId, Mensaje.TipoRemitente remitenteTipo);

    long countByConversacionPostanteIdAndLeidoFalseAndRemitenteTipo(
        Long postanteId, Mensaje.TipoRemitente remitenteTipo);

    long countByConversacionReclutadorIdAndLeidoFalseAndRemitenteTipo(
        Long reclutadorId, Mensaje.TipoRemitente remitenteTipo);
}
