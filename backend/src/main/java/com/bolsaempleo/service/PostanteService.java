package com.bolsaempleo.service;

import com.bolsaempleo.dto.DescripcionUpdate;
import com.bolsaempleo.dto.PostanteForm;
import com.bolsaempleo.dto.Response.PostanteResponse;
import com.bolsaempleo.dto.Response.PostulacionEstadoResponse;
import com.bolsaempleo.exception.BusinessRuleException;
import com.bolsaempleo.exception.ResourceNotFoundException;
import com.bolsaempleo.mapper.PostanteMapper;
import com.bolsaempleo.mapper.PostulacionEstadoMapper;
import com.bolsaempleo.model.Habilidad;
import com.bolsaempleo.model.Postante;
import com.bolsaempleo.model.PostulacionEstado;
import com.bolsaempleo.repository.HabilidadRepository;
import com.bolsaempleo.repository.PostanteRepository;
import com.bolsaempleo.repository.PostulacionEstadoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PostanteService {
    
    private final PostanteRepository postanteRepository;
    private final HabilidadRepository habilidadRepository;
    private final PostulacionEstadoRepository postulacionEstadoRepository;
    private final ArchivoService archivoService; 
    private final PostanteMapper postanteMapper;
    private final PasswordEncoder passwordEncoder;
    private final PostulacionEstadoMapper postulacionEstadoMapper;
    
    @Transactional(rollbackFor = Exception.class)
    public PostanteResponse registrar(Postante postante, MultipartFile cvFile) throws IOException {
        if (postanteRepository.existsByUsername(postante.getUsername())) {
            throw new BusinessRuleException("El nombre de usuario ya existe");
        }

        if (cvFile != null && !cvFile.isEmpty()) {
            String urlCvAzure = archivoService.subirArchivo(cvFile, "cv");
            postante.setCvPath(urlCvAzure); 
        }

        if (postante.getPassword() != null && !postante.getPassword().isBlank()) {
            postante.setPassword(passwordEncoder.encode(postante.getPassword()));
        }
        
        Postante nuevo = postanteRepository.save(postante);
        return postanteMapper.toResponse(nuevo);
    }
    
    @Transactional(readOnly = true)
    public PostanteResponse buscarPorId(Long id) {
        Postante postante = postanteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Postante", id));
        return postanteMapper.toResponse(postante);
    }
    
    @Transactional(rollbackFor = Exception.class)
    public PostanteResponse agregarHabilidades(Long postanteId, List<String> nombres) {
        Postante postante = postanteRepository.findById(postanteId)
            .orElseThrow(() -> new ResourceNotFoundException("Postante", postanteId));
        
        for (String nombre : nombres) {
            Habilidad habilidad = new Habilidad();
            habilidad.setNombre(nombre);
            habilidad.setPostante(postante);
            habilidadRepository.save(habilidad);
        }
        
        return postanteMapper.toResponse(postante);
    }
    
    @Transactional(rollbackFor = Exception.class)
    public void actualizarDescripcion(Long id, DescripcionUpdate dto) {
        Postante postante = postanteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Postante", id));
        postante.setDescripcion(dto.descripcion());
        postanteRepository.save(postante);
    }

    @Transactional(readOnly = true)
    public List<Habilidad> obtenerHabilidades(Long postanteId) {
        if (!postanteRepository.existsById(postanteId)) {
            throw new ResourceNotFoundException("Postante", postanteId);
        }
        return habilidadRepository.findByPostanteId(postanteId);
    }
    
    @Transactional(rollbackFor = Exception.class)
    public void verificarHabilidad(Long habilidadId) {
        Habilidad habilidad = habilidadRepository.findById(habilidadId)
            .orElseThrow(() -> new ResourceNotFoundException("Habilidad no encontrada con ID: " + habilidadId));
        habilidad.setVerificada(true);
        habilidadRepository.save(habilidad);
    }
    
    @Transactional(readOnly = true)
    public List<PostulacionEstadoResponse> obtenerPostulacionesResponse(Long postanteId) {
        return obtenerPostulaciones(postanteId).stream()
            .map(postulacionEstadoMapper::toResponse)
            .toList();
    }

    @Transactional(readOnly = true)
    public List<PostulacionEstado> obtenerPostulaciones(Long postanteId) {
        if (!postanteRepository.existsById(postanteId)) {
            throw new ResourceNotFoundException("Postante", postanteId);
        }
        return postulacionEstadoRepository.findByPostanteIdWithDetails(postanteId);
    }

    @Transactional(rollbackFor = Exception.class)
    public void actualizarPerfilCompleto(Long id, PostanteForm formDto) throws IOException {
        Postante postante = postanteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Postante", id));

        postanteMapper.updateEntityFromForm(formDto, postante);

        if (formDto.cvFile() != null && !formDto.cvFile().isEmpty()) {
            String urlCv = archivoService.subirArchivo(formDto.cvFile(), "cv_" + id);
            postante.setCvPath(urlCv);
        }

        if (formDto.fotoFile() != null && !formDto.fotoFile().isEmpty()) {
            String urlFoto = archivoService.subirArchivo(formDto.fotoFile(), "foto_" + id);
            postante.setFotoPerfil(urlFoto);
        }

        postanteRepository.save(postante);
    }
    @Transactional(rollbackFor = Exception.class)
    public void actualizarPerfil(Long id, com.bolsaempleo.dto.PostanteUpdate dto) {
        Postante postante = postanteRepository.findById(id)
                .orElseThrow(() -> new com.bolsaempleo.exception.ResourceNotFoundException("Postante", id));
        postanteMapper.updateEntityFromUpdateDto(dto, postante);

        if (dto.password() != null && !dto.password().isBlank()) {
            postante.setPassword(passwordEncoder.encode(dto.password())); 
        }
        postanteRepository.save(postante);
    }
}
