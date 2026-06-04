package com.bolsaempleo.service;

import com.bolsaempleo.dto.Response.PostulacionDetailResponse;
import com.bolsaempleo.dto.Response.PostulacionEstadoResponse;
import com.bolsaempleo.dto.Response.PostulacionItemResponse;
import com.bolsaempleo.exception.BusinessRuleException;
import com.bolsaempleo.exception.ResourceNotFoundException;
import com.bolsaempleo.mapper.PostulacionEstadoMapper;
import com.bolsaempleo.mapper.PostulacionMapper;
import com.bolsaempleo.model.Postante;
import com.bolsaempleo.model.Postulacion;
import com.bolsaempleo.model.PostulacionEstado;
import com.bolsaempleo.repository.PostanteRepository;
import com.bolsaempleo.repository.PostulacionEstadoRepository;
import com.bolsaempleo.repository.PostulacionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PostulacionService {
    
    private final PostulacionRepository postulacionRepository;
    private final PostulacionEstadoRepository postulacionEstadoRepository;
    private final PostanteRepository postanteRepository;
    private final PostulacionMapper postulacionMapper;
    private final PostulacionEstadoMapper postulacionEstadoMapper;
    
    @Transactional(rollbackFor = Exception.class)
    public PostulacionEstadoResponse postularResponse(Long postulacionId, Long postanteId) {
        return postulacionEstadoMapper.toResponse(postular(postulacionId, postanteId));
    }

    @Transactional(rollbackFor = Exception.class)
    public PostulacionEstado postular(Long postulacionId, Long postanteId) {
        Postulacion postulacion = postulacionRepository.findById(postulacionId)
            .orElseThrow(() -> new ResourceNotFoundException("Postulacion", postulacionId));
        
        Postante postante = postanteRepository.findById(postanteId)
            .orElseThrow(() -> new ResourceNotFoundException("Postante", postanteId));
        
        boolean existe = postulacionEstadoRepository
            .findByPostulacionIdAndPostanteId(postulacionId, postanteId).isPresent();
        
        if (existe) {
            throw new BusinessRuleException("Ya has postulado a esta posición");
        }
        
        PostulacionEstado estado = new PostulacionEstado();
        estado.setPostulacion(postulacion);
        estado.setPostante(postante);
        estado.setEstado(PostulacionEstado.EstadoPostulacion.CV_ENVIADO);
        estado.setFechaPostulacion(LocalDateTime.now());
        estado.setFechaActualizacion(LocalDateTime.now());
        
        return postulacionEstadoRepository.save(estado);
    }
    
    @Transactional(readOnly = true)
    public List<PostulacionEstadoResponse> obtenerCandidatosResponse(Long postulacionId) {
        return obtenerCandidatos(postulacionId).stream()
            .map(postulacionEstadoMapper::toResponse)
            .toList();
    }
    
    @Transactional(readOnly = true)
    public List<PostulacionEstado> obtenerCandidatos(Long postulacionId) {
        if (!postulacionRepository.existsById(postulacionId)) {
            throw new ResourceNotFoundException("Postulacion", postulacionId);
        }
        return postulacionEstadoRepository.findByPostulacionIdWithDetails(postulacionId);
    }
    
    @Transactional(rollbackFor = Exception.class)
    public void eliminar(Long id) {
        if (!postulacionRepository.existsById(id)) {
            throw new ResourceNotFoundException("Postulacion", id);
        }
        postulacionRepository.deleteById(id);
    }
    
    @Transactional(rollbackFor = Exception.class)
    public Postulacion actualizar(Long id, Postulacion datosActualizados) {
        Postulacion postulacion = postulacionRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Postulacion", id));
            
        postulacion.setTitulo(datosActualizados.getTitulo());
        postulacion.setDescripcion(datosActualizados.getDescripcion());
        postulacion.setRequisitos(datosActualizados.getRequisitos());
        postulacion.setUbicacion(datosActualizados.getUbicacion());
        if (datosActualizados.getSalarioMinimo() != null) {
            postulacion.setSalarioMinimo(datosActualizados.getSalarioMinimo());
        }
        if (datosActualizados.getSalarioMaximo() != null) {
            postulacion.setSalarioMaximo(datosActualizados.getSalarioMaximo());
        }
        if (datosActualizados.getTipoModalidad() != null) {
            postulacion.setTipoModalidad(datosActualizados.getTipoModalidad());
        }
        if (datosActualizados.getTipoPuesto() != null) {
            postulacion.setTipoPuesto(datosActualizados.getTipoPuesto());
        }
        
        return postulacionRepository.save(postulacion);
    }
    
    @Transactional(readOnly = true)
    public PostulacionDetailResponse buscarPorId(Long id) {
        return postulacionRepository.findById(id)
                .map(postulacionMapper::toDetailResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Postulacion", id));
    }
    
    @Transactional(rollbackFor = Exception.class)
    public PostulacionEstadoResponse actualizarEstadoResponse(Long id, PostulacionEstado.EstadoPostulacion nuevoEstado, String motivo) {
        return postulacionEstadoMapper.toResponse(actualizarEstado(id, nuevoEstado, motivo));
    }

    @Transactional(rollbackFor = Exception.class)
    public PostulacionEstado actualizarEstado(Long id, PostulacionEstado.EstadoPostulacion nuevoEstado, String motivo) {
        PostulacionEstado estado = postulacionEstadoRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Estado de Postulacion", id));
        
        estado.setEstado(nuevoEstado);
        estado.setFechaActualizacion(LocalDateTime.now());
        estado.setMotivo(motivo);
        
        return postulacionEstadoRepository.save(estado);
    }
    
    @Transactional(readOnly = true)
    public PostulacionEstadoResponse buscarEstadoResponse(Long postulacionId, Long postanteId) {
        return postulacionEstadoMapper.toResponse(buscarEstado(postulacionId, postanteId));
    }

    @Transactional(readOnly = true)
    public PostulacionEstado buscarEstado(Long postulacionId, Long postanteId) {
        return postulacionEstadoRepository.findByPostulacionIdAndPostanteIdWithDetails(postulacionId, postanteId)
            .orElseThrow(() -> new BusinessRuleException("No se encontró un registro de postulación para los IDs provistos."));
    }

    @Transactional(readOnly = true)
    public Page<PostulacionItemResponse> obtenerTodasPaginas(Pageable pageable) {
        Page<Postulacion> paginaPostulaciones = postulacionRepository.findAll(pageable);
        return paginaPostulaciones.map(postulacionMapper::toItemResponse);
    }
}