package com.bolsaempleo.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.bolsaempleo.model.Postulacion;

public interface PostulacionRepository extends JpaRepository<Postulacion, Long> {
    @Query("SELECT p FROM Postulacion p WHERE p.titulo LIKE %:keyword% OR p.descripcion LIKE %:keyword% OR p.requisitos LIKE %:keyword%")
    Page<Postulacion> findByKeyword(@Param("keyword") String keyword, Pageable pageable);
    
    List<Postulacion> findByReclutadorId(Long reclutadorId);
}
