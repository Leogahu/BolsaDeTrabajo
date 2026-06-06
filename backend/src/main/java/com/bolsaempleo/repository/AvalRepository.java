package com.bolsaempleo.repository;

import com.bolsaempleo.model.Avales;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AvalRepository extends JpaRepository<Avales, Long> {
    List<Avales> findByPostanteId(Long postanteId);
}
