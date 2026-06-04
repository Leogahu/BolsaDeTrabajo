package com.bolsaempleo.service;

import com.bolsaempleo.dto.Request.ProyectoRequest;
import com.bolsaempleo.dto.Response.ProyectoResponse;
import com.bolsaempleo.exception.ResourceNotFoundException;
import com.bolsaempleo.mapper.ProyectoMapper;
import com.bolsaempleo.model.Postante;
import com.bolsaempleo.model.Proyectos;
import com.bolsaempleo.repository.PostanteRepository;
import com.bolsaempleo.repository.ProyectoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProyectoService {

    private final ProyectoRepository proyectoRepository;
    private final PostanteRepository postanteRepository;
    private final ProyectoMapper proyectoMapper;

    @Transactional(readOnly = true)
    public List<ProyectoResponse> obtenerPorPostante(Long postanteId) {
        if (!postanteRepository.existsById(postanteId)) {
            throw new ResourceNotFoundException("Postante", postanteId);
        }
        return proyectoRepository.findByPostanteId(postanteId)
                .stream()
                .map(proyectoMapper::toResponse)
                .toList();
    }

    @Transactional(rollbackFor = Exception.class)
    public ProyectoResponse guardarProyecto(Long postanteId, ProyectoRequest dto) {
        Postante postante = postanteRepository.findById(postanteId)
                .orElseThrow(() -> new ResourceNotFoundException("Postante", postanteId));

        Proyectos proyecto = proyectoMapper.toEntity(dto);
        proyecto.setPostante(postante);

        return proyectoMapper.toResponse(proyectoRepository.save(proyecto));
    }

    @Transactional(rollbackFor = Exception.class)
    public ProyectoResponse actualizarProyecto(Long id, ProyectoRequest dto) {
        Proyectos proyecto = proyectoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Proyecto", id));

        proyectoMapper.updateEntityFromDto(dto, proyecto);

        return proyectoMapper.toResponse(proyectoRepository.save(proyecto));
    }

    @Transactional(rollbackFor = Exception.class)
    public void eliminarProyecto(Long id) {
        if (!proyectoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Proyecto", id);
        }
        proyectoRepository.deleteById(id);
    }
}