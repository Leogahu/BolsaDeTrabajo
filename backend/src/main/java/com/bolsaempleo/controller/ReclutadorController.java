package com.bolsaempleo.controller;

import com.bolsaempleo.dto.ReclutadorForm;
import com.bolsaempleo.dto.ReclutadorUpdate;
import com.bolsaempleo.dto.Request.AvisoRequest;
import com.bolsaempleo.dto.Request.RegisterReclutadorRequest;
import com.bolsaempleo.dto.Response.AvisoResponse;
import com.bolsaempleo.dto.Response.ReclutadorResponse;
import com.bolsaempleo.model.Reclutador;
import com.bolsaempleo.service.ReclutadorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/reclutadores")
@RequiredArgsConstructor
public class ReclutadorController {
    
    private final ReclutadorService reclutadorService;
    
    @PostMapping("/register")
    public ResponseEntity<ReclutadorResponse> registrar(
            @Valid @RequestBody RegisterReclutadorRequest dto) {
 
        Reclutador reclutador = new Reclutador();
        reclutador.setUsername(dto.username());
        reclutador.setNombres(dto.nombres());
        reclutador.setApellidos(dto.apellidos());
        reclutador.setEmail(dto.email());
        reclutador.setPassword(dto.password()); // 
        reclutador.setEmpresa(dto.empresa());
 
        return ResponseEntity.status(HttpStatus.CREATED).body(reclutadorService.registrar(reclutador));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ReclutadorResponse> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(reclutadorService.buscarPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReclutadorResponse> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody ReclutadorUpdate dto) {
        return ResponseEntity.ok(reclutadorService.actualizar(id, dto));
    }

    @PutMapping(value = "/{id}/completo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ReclutadorResponse> actualizarPerfilCompleto(
            @PathVariable Long id,
            @ModelAttribute ReclutadorForm form) throws IOException {
        return ResponseEntity.ok(reclutadorService.actualizarPerfilCompleto(id, form));
    }
    
    @PostMapping("/{id}/postulaciones")
    public ResponseEntity<AvisoResponse> crearPostulacion(
            @PathVariable Long id, 
            @Valid @RequestBody AvisoRequest dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(reclutadorService.crearPostulacion(id, dto));
    }
    
    @GetMapping("/{id}/postulaciones")
    public ResponseEntity<List<AvisoResponse>> obtenerMisPostulaciones(@PathVariable Long id) {
        return ResponseEntity.ok(reclutadorService.obtenerMisPostulaciones(id));
    }
    
    @GetMapping("/postulaciones")
    public ResponseEntity<Page<AvisoResponse>> obtenerPostulaciones(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(reclutadorService.obtenerPostulaciones(page, keyword));
    }
    
    @GetMapping("/postulaciones/{id}")
    public ResponseEntity<AvisoResponse> obtenerPostulacionPorId(@PathVariable Long id) {
        return ResponseEntity.ok(reclutadorService.buscarPostulacionPorId(id));
    }
}