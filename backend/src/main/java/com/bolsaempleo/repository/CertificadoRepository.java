package com.bolsaempleo.repository;

import com.bolsaempleo.model.Certificados;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CertificadoRepository extends JpaRepository<Certificados, Long> {
    List<Certificados> findByPostanteId(Long postanteId);
}
