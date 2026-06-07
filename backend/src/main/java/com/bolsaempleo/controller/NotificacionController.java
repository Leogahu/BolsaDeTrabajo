package com.bolsaempleo.controller;

import com.bolsaempleo.dto.Response.NotificacionResponse;
import com.bolsaempleo.model.Notificacion;
import com.bolsaempleo.service.NotificacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/notificaciones")
@RequiredArgsConstructor
public class NotificacionController {

    private final NotificacionService notificacionService;

    @GetMapping
    public ResponseEntity<List<NotificacionResponse>> listar(
            @RequestParam Long usuarioId,
            @RequestParam String tipo) {
        Notificacion.TipoUsuario tipoUsuario = Notificacion.TipoUsuario.valueOf(tipo.toUpperCase());
        return ResponseEntity.ok(notificacionService.listar(usuarioId, tipoUsuario));
    }

    @GetMapping("/no-leidas")
    public ResponseEntity<Map<String, Long>> contarNoLeidas(
            @RequestParam Long usuarioId,
            @RequestParam String tipo) {
        Notificacion.TipoUsuario tipoUsuario = Notificacion.TipoUsuario.valueOf(tipo.toUpperCase());
        return ResponseEntity.ok(Map.of("count", notificacionService.contarNoLeidas(usuarioId, tipoUsuario)));
    }

    @PutMapping("/{id}/leida")
    public ResponseEntity<Void> marcarLeida(@PathVariable Long id) {
        notificacionService.marcarLeida(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/marcar-todas")
    public ResponseEntity<Void> marcarTodas(
            @RequestParam Long usuarioId,
            @RequestParam String tipo) {
        notificacionService.marcarTodasLeidas(usuarioId, Notificacion.TipoUsuario.valueOf(tipo.toUpperCase()));
        return ResponseEntity.noContent().build();
    }
}
