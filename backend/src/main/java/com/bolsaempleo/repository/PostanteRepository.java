package com.bolsaempleo.repository;

import com.bolsaempleo.model.Postante;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PostanteRepository extends JpaRepository<Postante, Long> {
    Optional<Postante> findByEmail(String email);
    Optional<Postante> findByUsername(String username);
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
}
