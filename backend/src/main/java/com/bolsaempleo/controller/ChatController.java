package com.bolsaempleo.controller;

import com.bolsaempleo.dto.Request.MensajeRequest;
import com.bolsaempleo.dto.Response.ConversacionResponse;
import com.bolsaempleo.dto.Response.MensajeResponse;
import com.bolsaempleo.model.Mensaje;
import com.bolsaempleo.model.Notificacion;
import com.bolsaempleo.service.ChatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/chat")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @GetMapping("/conversaciones/postante/{postanteId}")
    public ResponseEntity<List<ConversacionResponse>> listarPostante(@PathVariable Long postanteId) {
        return ResponseEntity.ok(chatService.listarPorPostante(postanteId));
    }

    @GetMapping("/conversaciones/reclutador/{reclutadorId}")
    public ResponseEntity<List<ConversacionResponse>> listarReclutador(@PathVariable Long reclutadorId) {
        return ResponseEntity.ok(chatService.listarPorReclutador(reclutadorId));
    }

    @GetMapping("/conversaciones/postulacion-estado/{estadoId}")
    public ResponseEntity<ConversacionResponse> obtenerDesdePostulacion(@PathVariable Long estadoId) {
        return ResponseEntity.ok(chatService.obtenerOCrearDesdePostulacion(estadoId));
    }

    @GetMapping("/conversaciones/{conversacionId}/mensajes")
    public ResponseEntity<List<MensajeResponse>> listarMensajes(@PathVariable Long conversacionId) {
        return ResponseEntity.ok(chatService.listarMensajes(conversacionId));
    }

    @PostMapping("/conversaciones/{conversacionId}/mensajes")
    public ResponseEntity<MensajeResponse> enviar(
            @PathVariable Long conversacionId,
            @RequestParam String remitenteTipo,
            @RequestParam Long remitenteId,
            @Valid @RequestBody MensajeRequest request) {
        Mensaje.TipoRemitente tipo = Mensaje.TipoRemitente.valueOf(remitenteTipo.toUpperCase());
        return ResponseEntity.ok(chatService.enviarMensaje(conversacionId, tipo, remitenteId, request));
    }

    @PutMapping("/conversaciones/{conversacionId}/leidos")
    public ResponseEntity<Void> marcarLeidos(
            @PathVariable Long conversacionId,
            @RequestParam String lectorTipo,
            @RequestParam Long lectorId) {
        chatService.marcarMensajesLeidos(conversacionId, Mensaje.TipoRemitente.valueOf(lectorTipo.toUpperCase()), lectorId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/no-leidos")
    public ResponseEntity<Map<String, Long>> contarNoLeidos(
            @RequestParam Long usuarioId,
            @RequestParam String tipo) {
        Notificacion.TipoUsuario tipoUsuario = Notificacion.TipoUsuario.valueOf(tipo.toUpperCase());
        return ResponseEntity.ok(Map.of("count", chatService.contarMensajesNoLeidos(usuarioId, tipoUsuario)));
    }
}
