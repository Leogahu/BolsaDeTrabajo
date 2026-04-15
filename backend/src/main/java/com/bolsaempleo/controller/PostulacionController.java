package com.bolsaempleo.controller;

import com.bolsaempleo.model.PostulacionEstado;
import com.bolsaempleo.service.PostulacionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/postulaciones")
@CrossOrigin(origins = "*")
public class PostulacionController {
    
    private final PostulacionService postulacionService;
    
    public PostulacionController(PostulacionService postulacionService) {
        this.postulacionService = postulacionService;
    }
    
    @PostMapping("/{id}/postular")
    public ResponseEntity<?> postular(@PathVariable Long id, @RequestBody Map<String, Long> body) {
        try {
            Long postanteId = body.get("postanteId");
            PostulacionEstado estado = postulacionService.postular(id, postanteId);
            return ResponseEntity.ok(estado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/{id}/candidatos")
    public ResponseEntity<?> obtenerCandidatos(@PathVariable Long id) {
        return ResponseEntity.ok(postulacionService.obtenerCandidatos(id));
    }
    
    @PutMapping("/{id}/estado")
    public ResponseEntity<?> actualizarEstado(@PathVariable Long id, @RequestBody Map<String, String> body) {
        try {
            String estadoStr = body.get("estado");
            String motivo = body.get("motivo");
            PostulacionEstado.EstadoPostulacion estado = PostulacionEstado.EstadoPostulacion.valueOf(estadoStr);
            PostulacionEstado actualizado = postulacionService.actualizarEstado(id, estado, motivo);
            return ResponseEntity.ok(actualizado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/{postulacionId}/estado/{postanteId}")
    public ResponseEntity<?> obtenerEstado(@PathVariable Long postulacionId, @PathVariable Long postanteId) {
        return postulacionService.buscarEstado(postulacionId, postanteId)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
}
