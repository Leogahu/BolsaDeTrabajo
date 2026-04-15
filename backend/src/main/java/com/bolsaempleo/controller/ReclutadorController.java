package com.bolsaempleo.controller;

import com.bolsaempleo.model.Reclutador;
import com.bolsaempleo.model.Postulacion;
import com.bolsaempleo.service.ReclutadorService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reclutadores")
@CrossOrigin(origins = "*")
public class ReclutadorController {
    
    private final ReclutadorService reclutadorService;
    
    public ReclutadorController(ReclutadorService reclutadorService) {
        this.reclutadorService = reclutadorService;
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> registrar(@RequestBody Reclutador reclutador) {
        try {
            Reclutador nuevo = reclutadorService.registrar(reclutador);
            return ResponseEntity.ok(nuevo);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable Long id) {
        return reclutadorService.buscarPorId(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping("/{id}/postulaciones")
    public ResponseEntity<?> crearPostulacion(@PathVariable Long id, @RequestBody Postulacion postulacion) {
        try {
            Postulacion nueva = reclutadorService.crearPostulacion(id, postulacion);
            return ResponseEntity.ok(nueva);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/{id}/postulaciones")
    public ResponseEntity<?> obtenerMisPostulaciones(@PathVariable Long id) {
        return ResponseEntity.ok(reclutadorService.obtenerMisPostulaciones(id));
    }
    
    @GetMapping("/postulaciones")
    public ResponseEntity<?> obtenerPostulaciones(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String keyword) {
        Page<Postulacion> postulaciones = reclutadorService.obtenerPostulaciones(page, keyword);
        return ResponseEntity.ok(postulaciones);
    }
    
    @GetMapping("/postulaciones/{id}")
    public ResponseEntity<?> obtenerPostulacionPorId(@PathVariable Long id) {
        return reclutadorService.buscarPostulacionPorId(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
}
