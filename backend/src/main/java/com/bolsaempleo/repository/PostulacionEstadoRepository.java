package com.bolsaempleo.repository;

import com.bolsaempleo.model.PostulacionEstado;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface PostulacionEstadoRepository extends JpaRepository<PostulacionEstado, Long> {
    List<PostulacionEstado> findByPostulacionId(Long postulacionId);
    List<PostulacionEstado> findByPostanteId(Long postanteId);
    Optional<PostulacionEstado> findByPostulacionIdAndPostanteId(Long postulacionId, Long postanteId);
}
