package com.bolsaempleo.controller;

import com.bolsaempleo.dto.Request.ProyectoRequest;
import com.bolsaempleo.dto.Response.ApiMessageResponse;
import com.bolsaempleo.dto.Response.ProyectoResponse;
import com.bolsaempleo.service.ProyectoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/proyectos")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ProyectoController {

    private final ProyectoService proyectoService;

    @GetMapping("/postante/{postanteId}")
    public ResponseEntity<List<ProyectoResponse>> obtenerProyectos(@PathVariable Long postanteId) {
        return ResponseEntity.ok(proyectoService.obtenerPorPostante(postanteId));
    }

    @PostMapping("/postante/{postanteId}")
    public ResponseEntity<ProyectoResponse> agregarProyecto(
            @PathVariable Long postanteId, 
            @Valid @RequestBody ProyectoRequest dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(proyectoService.guardarProyecto(postanteId, dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProyectoResponse> actualizarProyecto(
            @PathVariable Long id, 
            @Valid @RequestBody ProyectoRequest dto) {
        return ResponseEntity.ok(proyectoService.actualizarProyecto(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiMessageResponse> eliminarProyecto(@PathVariable Long id) {
        proyectoService.eliminarProyecto(id);
        return ResponseEntity.ok(new ApiMessageResponse("Proyecto eliminado con éxito"));
    }
}