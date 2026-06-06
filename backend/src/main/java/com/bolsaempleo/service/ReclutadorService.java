package com.bolsaempleo.service;

import com.bolsaempleo.dto.ReclutadorForm;
import com.bolsaempleo.dto.ReclutadorUpdate;
import com.bolsaempleo.dto.Request.AvisoRequest;
import com.bolsaempleo.dto.Response.AvisoResponse;
import com.bolsaempleo.dto.Response.ReclutadorResponse;
import com.bolsaempleo.exception.DuplicateResourceException;
import com.bolsaempleo.exception.ResourceNotFoundException;
import com.bolsaempleo.mapper.ReclutadorMapper;
import com.bolsaempleo.model.Notificacion;
import com.bolsaempleo.model.Postulacion;
import com.bolsaempleo.model.Reclutador;
import com.bolsaempleo.repository.AlertaEmpleoRepository;
import com.bolsaempleo.repository.PostulacionRepository;
import com.bolsaempleo.repository.ReclutadorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReclutadorService {
    
    private final ReclutadorRepository reclutadorRepository;
    private final PostulacionRepository postulacionRepository;
    private final com.bolsaempleo.repository.PostulacionEstadoRepository postulacionEstadoRepository;
    private final ReclutadorMapper reclutadorMapper;
    private final PasswordEncoder passwordEncoder;
    private final ArchivoService archivoService;
    private final AlertaEmpleoRepository alertaEmpleoRepository;
    private final NotificacionService notificacionService;
    
    @Transactional(rollbackFor = Exception.class)
    public ReclutadorResponse registrar(Reclutador reclutador) {
        if (reclutadorRepository.existsByUsername(reclutador.getUsername())) {
            throw new DuplicateResourceException("El nombre de usuario ya existe.");
        }
        if (reclutadorRepository.existsByEmail(reclutador.getEmail())) {
            throw new DuplicateResourceException("El email ya está registrado.");
        }
        if (reclutador.getPassword() != null && !reclutador.getPassword().isBlank()) {
            reclutador.setPassword(passwordEncoder.encode(reclutador.getPassword()));
        }
        return reclutadorMapper.toResponse(reclutadorRepository.save(reclutador));
    }

    @Transactional(rollbackFor = Exception.class)
    public ReclutadorResponse actualizar(Long id, ReclutadorUpdate dto) {
        Reclutador reclutador = reclutadorRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Reclutador", id));

        if (dto.nombres() != null) reclutador.setNombres(dto.nombres());
        if (dto.apellidos() != null) reclutador.setApellidos(dto.apellidos());
        if (dto.email() != null) reclutador.setEmail(dto.email());
        if (dto.empresa() != null) reclutador.setEmpresa(dto.empresa());
        if (dto.telefono() != null) reclutador.setTelefono(dto.telefono());
        if (dto.cargo() != null) reclutador.setCargo(dto.cargo());
        if (dto.descripcion() != null) reclutador.setDescripcion(dto.descripcion());
        if (dto.sector() != null) reclutador.setSector(dto.sector());
        if (dto.password() != null && !dto.password().isBlank()) {
            reclutador.setPassword(passwordEncoder.encode(dto.password()));
        }

        return reclutadorMapper.toResponse(reclutadorRepository.save(reclutador));
    }

    @Transactional(rollbackFor = Exception.class)
    public ReclutadorResponse actualizarPerfilCompleto(Long id, ReclutadorForm form) throws java.io.IOException {
        Reclutador reclutador = reclutadorRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Reclutador", id));

        if (form.nombres() != null) reclutador.setNombres(form.nombres());
        if (form.apellidos() != null) reclutador.setApellidos(form.apellidos());
        if (form.email() != null) reclutador.setEmail(form.email());
        if (form.empresa() != null) reclutador.setEmpresa(form.empresa());
        if (form.telefono() != null) reclutador.setTelefono(form.telefono());
        if (form.cargo() != null) reclutador.setCargo(form.cargo());
        if (form.descripcion() != null) reclutador.setDescripcion(form.descripcion());
        if (form.sector() != null) reclutador.setSector(form.sector());

        if (form.fotoFile() != null && !form.fotoFile().isEmpty()) {
            String urlFoto = archivoService.subirArchivo(form.fotoFile(), "foto_rec_" + id);
            reclutador.setFotoPerfil(urlFoto);
        }

        return reclutadorMapper.toResponse(reclutadorRepository.save(reclutador));
    }
    
    @Transactional(readOnly = true)
    public ReclutadorResponse buscarPorId(Long id) {
        return  reclutadorRepository.findById(id)
                .map(reclutadorMapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Reclutador", id));
    }
    
    @Transactional(rollbackFor = Exception.class)
    public AvisoResponse crearPostulacion(Long reclutadorId, AvisoRequest dto) {
        Reclutador reclutador = reclutadorRepository.findById(reclutadorId)
            .orElseThrow(() -> new ResourceNotFoundException("Reclutador", reclutadorId));
        
        Postulacion postulacion = reclutadorMapper.toEntity(dto);
        postulacion.setReclutador(reclutador);
        postulacion.setFechaPublicacion(LocalDateTime.now());
        
        Postulacion saved = postulacionRepository.save(postulacion);
        notificarAlertasCoincidentes(saved);
        return reclutadorMapper.toAvisoResponse(saved);
    }

    private void notificarAlertasCoincidentes(Postulacion postulacion) {
        String tituloLower = postulacion.getTitulo().toLowerCase();
        alertaEmpleoRepository.findByActivaTrue().forEach(alerta -> {
            boolean keywordMatch = alerta.getKeyword() == null
                || tituloLower.contains(alerta.getKeyword().toLowerCase());
            boolean modalityMatch = alerta.getModalidad() == null
                || alerta.getModalidad().isBlank()
                || alerta.getModalidad().equalsIgnoreCase(postulacion.getTipoModalidad());
            if (keywordMatch && modalityMatch && alerta.getPostante() != null) {
                notificacionService.crear(
                    alerta.getPostante().getId(),
                    Notificacion.TipoUsuario.POSTANTE,
                    "Nueva vacante para tu alerta",
                    "Se publicó \"" + postulacion.getTitulo() + "\" en " + postulacion.getReclutador().getEmpresa(),
                    Notificacion.TipoNotificacion.VACANTE,
                    postulacion.getId()
                );
            }
        });
    }
    
    @Transactional(readOnly = true)
    public List<AvisoResponse> obtenerMisPostulaciones(Long reclutadorId) {
        if (!reclutadorRepository.existsById(reclutadorId)) {
            throw new ResourceNotFoundException("Reclutador", reclutadorId);
        }
        return postulacionRepository.findByReclutadorId(reclutadorId)
            .stream()
            .map(p -> {
                AvisoResponse base = reclutadorMapper.toAvisoResponse(p);
                int count = (int) postulacionEstadoRepository.countByPostulacionId(p.getId());
                return new AvisoResponse(
                    base.id(), base.titulo(), base.descripcion(), base.requisitos(),
                    base.ubicacion(), base.fechaPublicacion(), base.sueldoMin(), base.sueldoMax(),
                    base.tipoModalidad(), base.tipoPuesto(), base.empresa(), count
                );
            })
            .toList();
    }
    
    @Transactional(readOnly = true)
    public Page<AvisoResponse> obtenerPostulaciones(int pagina, String keyword) {
        Pageable pageable = PageRequest.of(pagina, 10);
        Page<Postulacion> resultado;
        
        if (keyword == null || keyword.trim().isEmpty()) {
            resultado = postulacionRepository.findAll(pageable);
        } else {
            resultado = postulacionRepository.findByKeyword(keyword, pageable);
        }
        
        return resultado.map(reclutadorMapper::toAvisoResponse);
    }
    
    @Transactional(readOnly = true)
    public AvisoResponse buscarPostulacionPorId(Long id) {
        return postulacionRepository.findById(id)
            .map(reclutadorMapper::toAvisoResponse)
            .orElseThrow(() -> new ResourceNotFoundException("Postulacion (Aviso)", id));
    }
}