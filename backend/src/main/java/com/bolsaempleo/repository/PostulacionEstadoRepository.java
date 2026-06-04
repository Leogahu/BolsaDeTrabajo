package com.bolsaempleo.repository;

import com.bolsaempleo.model.PostulacionEstado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PostulacionEstadoRepository extends JpaRepository<PostulacionEstado, Long> {
    List<PostulacionEstado> findByPostulacionId(Long postulacionId);
    List<PostulacionEstado> findByPostanteId(Long postanteId);
    Optional<PostulacionEstado> findByPostulacionIdAndPostanteId(Long postulacionId, Long postanteId);
    long countByPostulacionId(Long postulacionId);

    @Query("SELECT pe FROM PostulacionEstado pe JOIN FETCH pe.postante JOIN FETCH pe.postulacion p JOIN FETCH p.reclutador WHERE p.id = :postulacionId")
    List<PostulacionEstado> findByPostulacionIdWithDetails(@Param("postulacionId") Long postulacionId);

    @Query("SELECT pe FROM PostulacionEstado pe " +
           "JOIN FETCH pe.postante pos " +
           "JOIN FETCH pe.postulacion p " +
           "WHERE pos.id = :postanteId")
    List<PostulacionEstado> findByPostanteIdWithDetails(@Param("postanteId") Long postanteId);

    @Query("SELECT pe FROM PostulacionEstado pe JOIN FETCH pe.postante JOIN FETCH pe.postulacion p JOIN FETCH p.reclutador WHERE p.id = :postulacionId AND pe.postante.id = :postanteId")
    Optional<PostulacionEstado> findByPostulacionIdAndPostanteIdWithDetails(
        @Param("postulacionId") Long postulacionId,
        @Param("postanteId") Long postanteId);
}