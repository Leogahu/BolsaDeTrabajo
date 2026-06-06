package com.bolsaempleo.repository;

import com.bolsaempleo.model.Conversacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ConversacionRepository extends JpaRepository<Conversacion, Long> {
    @Query("SELECT c FROM Conversacion c JOIN FETCH c.postante JOIN FETCH c.reclutador WHERE c.postante.id = :postanteId ORDER BY c.fechaUltimoMensaje DESC")
    List<Conversacion> findByPostanteIdWithUsers(@Param("postanteId") Long postanteId);

    @Query("SELECT c FROM Conversacion c JOIN FETCH c.postante JOIN FETCH c.reclutador WHERE c.reclutador.id = :reclutadorId ORDER BY c.fechaUltimoMensaje DESC")
    List<Conversacion> findByReclutadorIdWithUsers(@Param("reclutadorId") Long reclutadorId);

    Optional<Conversacion> findByPostulacionEstadoId(Long postulacionEstadoId);

    @Query("SELECT c FROM Conversacion c JOIN FETCH c.postante JOIN FETCH c.reclutador WHERE c.id = :id")
    Optional<Conversacion> findByIdWithUsers(@Param("id") Long id);
}
