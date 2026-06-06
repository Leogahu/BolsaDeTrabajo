package com.bolsaempleo.service;

import com.bolsaempleo.dto.Request.MensajeRequest;
import com.bolsaempleo.dto.Response.ConversacionResponse;
import com.bolsaempleo.dto.Response.MensajeResponse;
import com.bolsaempleo.exception.BusinessRuleException;
import com.bolsaempleo.exception.ResourceNotFoundException;
import com.bolsaempleo.model.*;
import com.bolsaempleo.repository.ConversacionRepository;
import com.bolsaempleo.repository.MensajeRepository;
import com.bolsaempleo.repository.PostulacionEstadoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ConversacionRepository conversacionRepository;
    private final MensajeRepository mensajeRepository;
    private final PostulacionEstadoRepository postulacionEstadoRepository;
    private final NotificacionService notificacionService;
    private final SimpMessagingTemplate messagingTemplate;

    @Transactional(readOnly = true)
    public List<ConversacionResponse> listarPorPostante(Long postanteId) {
        return conversacionRepository.findByPostanteIdWithUsers(postanteId).stream()
            .map(c -> toConversacionResponse(c, Mensaje.TipoRemitente.RECLUTADOR))
            .toList();
    }

    @Transactional(readOnly = true)
    public List<ConversacionResponse> listarPorReclutador(Long reclutadorId) {
        return conversacionRepository.findByReclutadorIdWithUsers(reclutadorId).stream()
            .map(c -> toConversacionResponse(c, Mensaje.TipoRemitente.POSTANTE))
            .toList();
    }

    @Transactional(readOnly = true)
    public List<MensajeResponse> listarMensajes(Long conversacionId) {
        return mensajeRepository.findByConversacionIdOrderByFechaEnvioAsc(conversacionId)
            .stream().map(this::toMensajeResponse).toList();
    }

    @Transactional(rollbackFor = Exception.class)
    public ConversacionResponse obtenerOCrearDesdePostulacion(Long postulacionEstadoId) {
        PostulacionEstado estado = postulacionEstadoRepository.findById(postulacionEstadoId)
            .orElseThrow(() -> new ResourceNotFoundException("PostulacionEstado", postulacionEstadoId));

        if (estado.getEstado() != PostulacionEstado.EstadoPostulacion.CONTACTARAN
            && estado.getEstado() != PostulacionEstado.EstadoPostulacion.FINALIZADO) {
            throw new BusinessRuleException("El chat solo está disponible cuando el candidato está en revisión avanzada o contacto.");
        }

        Conversacion conversacion = conversacionRepository.findByPostulacionEstadoId(postulacionEstadoId)
            .orElseGet(() -> crearConversacion(estado));

        return toConversacionResponse(conversacion, Mensaje.TipoRemitente.RECLUTADOR);
    }

    @Transactional(rollbackFor = Exception.class)
    public MensajeResponse enviarMensaje(
            Long conversacionId,
            Mensaje.TipoRemitente remitenteTipo,
            Long remitenteId,
            MensajeRequest request) {
        Conversacion conversacion = conversacionRepository.findByIdWithUsers(conversacionId)
            .orElseThrow(() -> new ResourceNotFoundException("Conversacion", conversacionId));

        validarParticipante(conversacion, remitenteTipo, remitenteId);

        Mensaje mensaje = new Mensaje();
        mensaje.setConversacion(conversacion);
        mensaje.setRemitenteTipo(remitenteTipo);
        mensaje.setRemitenteId(remitenteId);
        mensaje.setContenido(request.contenido());
        mensaje.setLeido(false);

        Mensaje saved = mensajeRepository.save(mensaje);

        conversacion.setUltimoMensaje(request.contenido());
        conversacion.setFechaUltimoMensaje(LocalDateTime.now());
        conversacionRepository.save(conversacion);

        MensajeResponse response = toMensajeResponse(saved);
        messagingTemplate.convertAndSend("/topic/chat/" + conversacionId, response);
        broadcastConversacionUpdate(conversacion);

        Notificacion.TipoUsuario destinoTipo = remitenteTipo == Mensaje.TipoRemitente.POSTANTE
            ? Notificacion.TipoUsuario.RECLUTADOR : Notificacion.TipoUsuario.POSTANTE;
        Long destinoId = remitenteTipo == Mensaje.TipoRemitente.POSTANTE
            ? conversacion.getReclutador().getId() : conversacion.getPostante().getId();
        String remitenteNombre = remitenteTipo == Mensaje.TipoRemitente.POSTANTE
            ? conversacion.getPostante().getNombres() : conversacion.getReclutador().getNombres();

        notificacionService.crear(
            destinoId, destinoTipo,
            "Nuevo mensaje de " + remitenteNombre,
            request.contenido(),
            Notificacion.TipoNotificacion.MENSAJE,
            conversacionId
        );

        return response;
    }

    @Transactional(rollbackFor = Exception.class)
    public void marcarMensajesLeidos(Long conversacionId, Mensaje.TipoRemitente lectorTipo, Long lectorId) {
        Conversacion conversacion = conversacionRepository.findById(conversacionId)
            .orElseThrow(() -> new ResourceNotFoundException("Conversacion", conversacionId));
        validarParticipante(conversacion, lectorTipo, lectorId);

        Mensaje.TipoRemitente otroTipo = lectorTipo == Mensaje.TipoRemitente.POSTANTE
            ? Mensaje.TipoRemitente.RECLUTADOR : Mensaje.TipoRemitente.POSTANTE;

        mensajeRepository.findByConversacionIdOrderByFechaEnvioAsc(conversacionId).stream()
            .filter(m -> m.getRemitenteTipo() == otroTipo && !m.isLeido())
            .forEach(m -> {
                m.setLeido(true);
                mensajeRepository.save(m);
            });
    }

    @Transactional(readOnly = true)
    public long contarMensajesNoLeidos(Long usuarioId, Notificacion.TipoUsuario tipo) {
        if (tipo == Notificacion.TipoUsuario.POSTANTE) {
            return mensajeRepository.countByConversacionPostanteIdAndLeidoFalseAndRemitenteTipo(
                usuarioId, Mensaje.TipoRemitente.RECLUTADOR);
        }
        return mensajeRepository.countByConversacionReclutadorIdAndLeidoFalseAndRemitenteTipo(
            usuarioId, Mensaje.TipoRemitente.POSTANTE);
    }

    @Transactional(rollbackFor = Exception.class)
    public Conversacion crearConversacionDesdeEstado(PostulacionEstado estado) {
        return conversacionRepository.findByPostulacionEstadoId(estado.getId())
            .orElseGet(() -> crearConversacion(estado));
    }

    private Conversacion crearConversacion(PostulacionEstado estado) {
        Postulacion postulacion = estado.getPostulacion();
        if (postulacion == null || postulacion.getReclutador() == null || estado.getPostante() == null) {
            throw new BusinessRuleException("No se puede crear la conversación: datos incompletos.");
        }

        Conversacion conversacion = new Conversacion();
        conversacion.setPostante(estado.getPostante());
        conversacion.setReclutador(postulacion.getReclutador());
        conversacion.setPostulacionEstado(estado);
        conversacion.setActiva(true);
        conversacion.setUltimoMensaje("Conversación iniciada");
        conversacion.setFechaUltimoMensaje(LocalDateTime.now());
        Conversacion saved = conversacionRepository.save(conversacion);
        broadcastConversacionUpdate(saved);
        return saved;
    }

    private void broadcastConversacionUpdate(Conversacion c) {
        if (c.getPostante() == null || c.getReclutador() == null) return;
        messagingTemplate.convertAndSend(
            "/topic/conversaciones/POSTANTE/" + c.getPostante().getId(),
            toConversacionResponse(c, Mensaje.TipoRemitente.RECLUTADOR)
        );
        messagingTemplate.convertAndSend(
            "/topic/conversaciones/RECLUTADOR/" + c.getReclutador().getId(),
            toConversacionResponse(c, Mensaje.TipoRemitente.POSTANTE)
        );
    }

    private void validarParticipante(Conversacion c, Mensaje.TipoRemitente tipo, Long id) {
        boolean valido = (tipo == Mensaje.TipoRemitente.POSTANTE && c.getPostante().getId().equals(id))
            || (tipo == Mensaje.TipoRemitente.RECLUTADOR && c.getReclutador().getId().equals(id));
        if (!valido) {
            throw new BusinessRuleException("No tienes acceso a esta conversación.");
        }
    }

    private ConversacionResponse toConversacionResponse(Conversacion c, Mensaje.TipoRemitente remitenteOtro) {
        long noLeidos = mensajeRepository.findByConversacionIdOrderByFechaEnvioAsc(c.getId()).stream()
            .filter(m -> m.getRemitenteTipo() == remitenteOtro && !m.isLeido()).count();

        return new ConversacionResponse(
            c.getId(),
            c.getPostante().getId(),
            c.getPostante().getNombres() + " " + c.getPostante().getApellidos(),
            c.getPostante().getFotoPerfil(),
            c.getReclutador().getId(),
            c.getReclutador().getNombres() + " " + c.getReclutador().getApellidos(),
            c.getReclutador().getEmpresa(),
            c.getReclutador().getFotoPerfil(),
            c.getUltimoMensaje(),
            c.getFechaUltimoMensaje(),
            noLeidos,
            c.getPostulacionEstado() != null ? c.getPostulacionEstado().getId() : null
        );
    }

    private MensajeResponse toMensajeResponse(Mensaje m) {
        return new MensajeResponse(
            m.getId(), m.getConversacion().getId(),
            m.getRemitenteTipo().name(), m.getRemitenteId(),
            m.getContenido(), m.isLeido(), m.getFechaEnvio()
        );
    }
}
