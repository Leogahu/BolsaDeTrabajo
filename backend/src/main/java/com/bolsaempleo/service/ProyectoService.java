package com.bolsaempleo.service;

import com.bolsaempleo.model.Proyectos;
import com.bolsaempleo.model.Postante;
import com.bolsaempleo.repository.ProyectoRepository;
import com.bolsaempleo.repository.PostanteRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProyectoService {

    private final ProyectoRepository proyectoRepository;
    private final PostanteRepository postanteRepository;

    public ProyectoService(ProyectoRepository proyectoRepository, PostanteRepository postanteRepository) {
        this.proyectoRepository = proyectoRepository;
        this.postanteRepository = postanteRepository;
    }

    public List<Proyectos> obtenerPorPostante(Long postanteId) {
        return proyectoRepository.findByPostanteId(postanteId);
    }

    public Proyectos guardarProyecto(Long postanteId, Proyectos proyecto) {
        Postante postante = postanteRepository.findById(postanteId)
                .orElseThrow(() -> new RuntimeException("Postante no encontrado con ID: " + postanteId));
        
        proyecto.setPostante(postante);
        return proyectoRepository.save(proyecto);
    }
    public Proyectos actualizarProyecto(Long id, Proyectos datos) {
        Proyectos proj = proyectoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Proyecto no encontrado"));
        proj.setTitulo(datos.getTitulo());
        proj.setDescripcion(datos.getDescripcion());
        proj.setUrlEvidencia(datos.getUrlEvidencia());
        return proyectoRepository.save(proj);
    }

    public void eliminarProyecto(Long id) {
        if(!proyectoRepository.existsById(id)) {
            throw new RuntimeException("El proyecto no existe.");
        }
        proyectoRepository.deleteById(id);
}
}
