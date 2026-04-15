package com.bolsaempleo.repository;

import com.bolsaempleo.model.Reclutador;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ReclutadorRepository extends JpaRepository<Reclutador, Long> {
    Optional<Reclutador> findByEmail(String email);
    Optional<Reclutador> findByUsername(String username);
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
}
