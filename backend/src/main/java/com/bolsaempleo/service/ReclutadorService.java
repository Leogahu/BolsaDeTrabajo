package com.bolsaempleo.service;

import com.bolsaempleo.model.Postulacion;
import com.bolsaempleo.model.Reclutador;
import com.bolsaempleo.repository.PostulacionRepository;
import com.bolsaempleo.repository.ReclutadorRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ReclutadorService {
    
    private final ReclutadorRepository reclutadorRepository;
    private final PostulacionRepository postulacionRepository;
    
    public ReclutadorService(ReclutadorRepository reclutadorRepository,
                            PostulacionRepository postulacionRepository) {
        this.reclutadorRepository = reclutadorRepository;
        this.postulacionRepository = postulacionRepository;
    }
    
    public Reclutador registrar(Reclutador reclutador) {
        if (reclutadorRepository.existsByUsername(reclutador.getUsername())) {
            throw new RuntimeException("El nombre de usuario ya existe");
        }
        if (reclutadorRepository.existsByEmail(reclutador.getEmail())) {
            throw new RuntimeException("El email ya está registrado");
        }
        return reclutadorRepository.save(reclutador);
    }
    
    public Optional<Reclutador> buscarPorEmail(String email) {
        return reclutadorRepository.findByEmail(email);
    }
    
    public Optional<Reclutador> buscarPorId(Long id) {
        return reclutadorRepository.findById(id);
    }
    
    public Postulacion crearPostulacion(Long reclutadorId, Postulacion postulacion) {
        Reclutador reclutador = reclutadorRepository.findById(reclutadorId)
            .orElseThrow(() -> new RuntimeException("Reclutador no encontrado"));
        
        postulacion.setReclutador(reclutador);
        postulacion.setFechaPublicacion(LocalDateTime.now());
        return postulacionRepository.save(postulacion);
    }
    
    public Page<Postulacion> obtenerPostulaciones(int pagina, String keyword) {
        Pageable pageable = PageRequest.of(pagina, 10);
        
        if (keyword == null || keyword.trim().isEmpty()) {
            return postulacionRepository.findAll(pageable);
        }
        
        return postulacionRepository.findByKeyword(keyword, pageable);
    }
    
    public List<Postulacion> obtenerMisPostulaciones(Long reclutadorId) {
        return postulacionRepository.findByReclutadorId(reclutadorId);
    }
    
    public Optional<Postulacion> buscarPostulacionPorId(Long id) {
        return postulacionRepository.findById(id);
    }
}
