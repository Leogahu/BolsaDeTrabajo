package com.bolsaempleo.repository;

import com.bolsaempleo.model.Habilidad;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HabilidadRepository extends JpaRepository<Habilidad, Long> {
    List<Habilidad> findByPostanteId(Long postanteId);
}
