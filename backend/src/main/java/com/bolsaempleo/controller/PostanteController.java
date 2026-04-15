package com.bolsaempleo.controller;

import com.bolsaempleo.model.Postante;
import com.bolsaempleo.service.PostanteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/postantes")
@CrossOrigin(origins = "*")
public class PostanteController {
    
    private final PostanteService postanteService;
    
    public PostanteController(PostanteService postanteService) {
        this.postanteService = postanteService;
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> registrar(@ModelAttribute Postante postante,
                                       @RequestParam(value = "cvFile", required = false) MultipartFile cvFile) {
        try {
            Postante nuevo = postanteService.registrar(postante, cvFile);
            return ResponseEntity.ok(nuevo);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable Long id) {
        return postanteService.buscarPorId(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping("/{id}/habilidades")
    public ResponseEntity<?> agregarHabilidades(@PathVariable Long id,
                                                 @RequestBody List<String> habilidades) {
        try {
            Postante postante = postanteService.agregarHabilidades(id, habilidades);
            return ResponseEntity.ok(postante);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/{id}/habilidades")
    public ResponseEntity<?> obtenerHabilidades(@PathVariable Long id) {
        return ResponseEntity.ok(postanteService.obtenerHabilidades(id));
    }
    
    @PutMapping("/habilidades/{habilidadId}/verificar")
    public ResponseEntity<?> verificarHabilidad(@PathVariable Long habilidadId) {
        try {
            postanteService.verificarHabilidad(habilidadId);
            return ResponseEntity.ok(Map.of("mensaje", "Habilidad verificada"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/{id}/postulaciones")
    public ResponseEntity<?> obtenerPostulaciones(@PathVariable Long id) {
        return ResponseEntity.ok(postanteService.obtenerPostulaciones(id));
    }
}
