package com.bolsaempleo.repository;

import com.bolsaempleo.model.AlertaEmpleo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AlertaEmpleoRepository extends JpaRepository<AlertaEmpleo, Long> {
    List<AlertaEmpleo> findByPostanteIdAndActivaTrue(Long postanteId);
    List<AlertaEmpleo> findByPostanteId(Long postanteId);
    List<AlertaEmpleo> findByActivaTrue();
}
