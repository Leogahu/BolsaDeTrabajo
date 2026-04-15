package com.bolsaempleo.service;

import com.bolsaempleo.model.Postulacion;
import com.bolsaempleo.model.PostulacionEstado;
import com.bolsaempleo.model.Postante;
import com.bolsaempleo.repository.PostulacionEstadoRepository;
import com.bolsaempleo.repository.PostulacionRepository;
import com.bolsaempleo.repository.PostanteRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PostulacionService {
    
    private final PostulacionRepository postulacionRepository;
    private final PostulacionEstadoRepository postulacionEstadoRepository;
    private final PostanteRepository postanteRepository;
    
    public PostulacionService(PostulacionRepository postulacionRepository,
                             PostulacionEstadoRepository postulacionEstadoRepository,
                             PostanteRepository postanteRepository) {
        this.postulacionRepository = postulacionRepository;
        this.postulacionEstadoRepository = postulacionEstadoRepository;
        this.postanteRepository = postanteRepository;
    }
    
    public PostulacionEstado postular(Long postulacionId, Long postanteId) {
        Postulacion postulacion = postulacionRepository.findById(postulacionId)
            .orElseThrow(() -> new RuntimeException("Postulacion no encontrada"));
        
        Postante postante = postanteRepository.findById(postanteId)
            .orElseThrow(() -> new RuntimeException("Postante no encontrado"));
        
        Optional<PostulacionEstado> existente = postulacionEstadoRepository
            .findByPostulacionIdAndPostanteId(postulacionId, postanteId);
        
        if (existente.isPresent()) {
            throw new RuntimeException("Ya has postulado a esta posicion");
        }
        
        PostulacionEstado estado = new PostulacionEstado();
        estado.setPostulacion(postulacion);
        estado.setPostante(postante);
        estado.setEstado(PostulacionEstado.EstadoPostulacion.CV_ENVIADO);
        estado.setFechaActualizacion(LocalDateTime.now());
        
        return postulacionEstadoRepository.save(estado);
    }
    
    public List<PostulacionEstado> obtenerCandidatos(Long postulacionId) {
        return postulacionEstadoRepository.findByPostulacionId(postulacionId);
    }
    
    public PostulacionEstado actualizarEstado(Long id, PostulacionEstado.EstadoPostulacion nuevoEstado, String motivo) {
        PostulacionEstado estado = postulacionEstadoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Postulacion no encontrada"));
        
        estado.setEstado(nuevoEstado);
        estado.setFechaActualizacion(LocalDateTime.now());
        estado.setMotivo(motivo);
        
        return postulacionEstadoRepository.save(estado);
    }
    
    public Optional<PostulacionEstado> buscarEstado(Long postulacionId, Long postanteId) {
        return postulacionEstadoRepository.findByPostulacionIdAndPostanteId(postulacionId, postanteId);
    }
}
