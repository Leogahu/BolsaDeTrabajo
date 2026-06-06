package com.bolsaempleo.service;

import com.bolsaempleo.dto.Response.NotificacionResponse;
import com.bolsaempleo.exception.ResourceNotFoundException;
import com.bolsaempleo.model.Notificacion;
import com.bolsaempleo.repository.NotificacionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificacionService {

    private final NotificacionRepository notificacionRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Transactional(readOnly = true)
    public List<NotificacionResponse> listar(Long usuarioId, Notificacion.TipoUsuario tipo) {
        return notificacionRepository.findByUsuarioIdAndUsuarioTipoOrderByFechaCreacionDesc(usuarioId, tipo)
            .stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public long contarNoLeidas(Long usuarioId, Notificacion.TipoUsuario tipo) {
        return notificacionRepository.countByUsuarioIdAndUsuarioTipoAndLeidaFalse(usuarioId, tipo);
    }

    @Transactional(rollbackFor = Exception.class)
    public NotificacionResponse crear(
            Long usuarioId,
            Notificacion.TipoUsuario tipoUsuario,
            String titulo,
            String mensaje,
            Notificacion.TipoNotificacion tipo,
            Long referenciaId) {
        Notificacion n = new Notificacion();
        n.setUsuarioId(usuarioId);
        n.setUsuarioTipo(tipoUsuario);
        n.setTitulo(titulo);
        n.setMensaje(mensaje);
        n.setTipo(tipo);
        n.setReferenciaId(referenciaId);
        n.setLeida(false);

        Notificacion saved = notificacionRepository.save(n);
        NotificacionResponse response = toResponse(saved);
        messagingTemplate.convertAndSend("/topic/notificaciones/" + tipoUsuario.name() + "/" + usuarioId, response);
        return response;
    }

    @Transactional(rollbackFor = Exception.class)
    public void marcarLeida(Long id) {
        Notificacion n = notificacionRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Notificacion", id));
        n.setLeida(true);
        notificacionRepository.save(n);
    }

    @Transactional(rollbackFor = Exception.class)
    public void marcarTodasLeidas(Long usuarioId, Notificacion.TipoUsuario tipo) {
        notificacionRepository.findByUsuarioIdAndUsuarioTipoOrderByFechaCreacionDesc(usuarioId, tipo)
            .forEach(n -> {
                n.setLeida(true);
                notificacionRepository.save(n);
            });
    }

    private NotificacionResponse toResponse(Notificacion n) {
        return new NotificacionResponse(
            n.getId(), n.getTitulo(), n.getMensaje(),
            n.getTipo().name(), n.getReferenciaId(), n.isLeida(), n.getFechaCreacion()
        );
    }
}
