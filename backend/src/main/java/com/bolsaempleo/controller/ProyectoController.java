package com.bolsaempleo.controller;

import com.bolsaempleo.model.Proyectos;
import com.bolsaempleo.service.ProyectoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/proyectos")
@CrossOrigin(origins = "*")
public class ProyectoController {

    private final ProyectoService proyectoService;

    public ProyectoController(ProyectoService proyectoService) {
        this.proyectoService = proyectoService;
    }

    @GetMapping("/postante/{postanteId}")
    public ResponseEntity<?> obtenerProyectos(@PathVariable Long postanteId) {
        return ResponseEntity.ok(proyectoService.obtenerPorPostante(postanteId));
    }

    @PostMapping("/postante/{postanteId}")
    public ResponseEntity<?> agregarProyecto(@PathVariable Long postanteId, @RequestBody Proyectos proyecto) {
        try {
            return ResponseEntity.ok(proyectoService.guardarProyecto(postanteId, proyecto));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarProyecto(@PathVariable Long id, @RequestBody Proyectos proyectoDatos) {
        try {
            Proyectos actualizado = proyectoService.actualizarProyecto(id, proyectoDatos);
            return ResponseEntity.ok(actualizado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarProyecto(@PathVariable Long id) {
        try {
            proyectoService.eliminarProyecto(id);
            return ResponseEntity.ok(Map.of("message", "Proyecto eliminado con éxito"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}