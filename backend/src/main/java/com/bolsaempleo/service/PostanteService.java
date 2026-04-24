package com.bolsaempleo.service;

import com.bolsaempleo.model.Habilidad;
import com.bolsaempleo.model.Postante;
import com.bolsaempleo.model.PostulacionEstado;
import com.bolsaempleo.repository.HabilidadRepository;
import com.bolsaempleo.repository.PostanteRepository;
import com.bolsaempleo.repository.PostulacionEstadoRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class PostanteService {
    
    private final PostanteRepository postanteRepository;
    private final HabilidadRepository habilidadRepository;
    private final PostulacionEstadoRepository postulacionEstadoRepository;
    
    @Value("${upload.directory}")
    private String uploadDirectory;
    
    public PostanteService(PostanteRepository postanteRepository,
                            HabilidadRepository habilidadRepository,
                            PostulacionEstadoRepository postulacionEstadoRepository) {
        this.postanteRepository = postanteRepository;
        this.habilidadRepository = habilidadRepository;
        this.postulacionEstadoRepository = postulacionEstadoRepository;
    }
    
    public Postante registrar(Postante postante, MultipartFile cvFile) throws IOException {
    if (postanteRepository.existsByUsername(postante.getUsername())) {
        throw new RuntimeException("El nombre de usuario ya existe");
    }

    if (cvFile != null && !cvFile.isEmpty()) {
        File directory = new File(uploadDirectory);
        if (!directory.exists()) directory.mkdirs();
        
        String fileName = System.currentTimeMillis() + "_" + cvFile.getOriginalFilename();
        String filePath = uploadDirectory + File.separator + fileName;
        cvFile.transferTo(new File(filePath));
        postante.setCvPath(filePath);
    }
    return postanteRepository.save(postante);
    }
    
    public Optional<Postante> buscarPorEmail(String email) {
        return postanteRepository.findByEmail(email);
    }
    
    public Optional<Postante> buscarPorId(Long id) {
        return postanteRepository.findById(id);
    }
    
    public Postante agregarHabilidades(Long postanteId, List<String> nombres) {
        Postante postante = postanteRepository.findById(postanteId)
            .orElseThrow(() -> new RuntimeException("Postante no encontrado"));
        
        for (String nombre : nombres) {
            Habilidad habilidad = new Habilidad();
            habilidad.setNombre(nombre);
            habilidad.setPostante(postante);
            habilidadRepository.save(habilidad);
        }
        
        return postanteRepository.findById(postanteId).orElse(postante);
    }
    
    public List<Habilidad> obtenerHabilidades(Long postanteId) {
        return habilidadRepository.findByPostanteId(postanteId);
    }
    
    public void verificarHabilidad(Long habilidadId) {
        Habilidad habilidad = habilidadRepository.findById(habilidadId)
            .orElseThrow(() -> new RuntimeException("Habilidad no encontrada"));
        habilidad.setVerificada(true);
        habilidadRepository.save(habilidad);
    }
    
    public List<PostulacionEstado> obtenerPostulaciones(Long postanteId) {
        return postulacionEstadoRepository.findByPostanteId(postanteId);
    }
}
