package com.bolsaempleo.repository;

import com.bolsaempleo.model.Proyectos;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProyectoRepository extends JpaRepository<Proyectos, Long> {
    List<Proyectos> findByPostanteId(Long postanteId);
}
