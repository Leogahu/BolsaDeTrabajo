package com.bolsaempleo.controller;

import com.bolsaempleo.dto.EstadoUpdate;
import com.bolsaempleo.dto.Request.PostularRequest;
import com.bolsaempleo.dto.Response.PostulacionDetailResponse;
import com.bolsaempleo.dto.Response.PostulacionEstadoResponse;
import com.bolsaempleo.dto.Response.PostulacionItemResponse;
import com.bolsaempleo.model.Postulacion;
import com.bolsaempleo.model.PostulacionEstado;
import com.bolsaempleo.service.PostulacionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/postulaciones")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class PostulacionController {
    
    private final PostulacionService postulacionService;
    
    @PostMapping("/{id}/postular")
    public ResponseEntity<PostulacionEstadoResponse> postular(
            @PathVariable Long id, 
            @Valid @RequestBody PostularRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(postulacionService.postularResponse(id, request.postanteId()));
    }
    
    @GetMapping("/{id}/candidatos")
    public ResponseEntity<List<PostulacionEstadoResponse>> obtenerCandidatos(@PathVariable Long id) {
        return ResponseEntity.ok(postulacionService.obtenerCandidatosResponse(id));
    }
    
    @PutMapping("/{id}/estado")
    public ResponseEntity<PostulacionEstadoResponse> actualizarEstado(
            @PathVariable Long id, 
            @Valid @RequestBody EstadoUpdate dto) {
        PostulacionEstado.EstadoPostulacion estadoEnum = PostulacionEstado.EstadoPostulacion.valueOf(dto.estado());
        return ResponseEntity.ok(
            postulacionService.actualizarEstadoResponse(id, estadoEnum, dto.motivo())
        );
    }
    
    @GetMapping("/{postulacionId}/estado/{postanteId}")
    public ResponseEntity<PostulacionEstadoResponse> obtenerEstado(
            @PathVariable Long postulacionId, 
            @PathVariable Long postanteId) {
        return ResponseEntity.ok(
            postulacionService.buscarEstadoResponse(postulacionId, postanteId)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarPostulacion(@PathVariable Long id) {
        postulacionService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Postulacion> actualizar(
            @PathVariable Long id, 
            @Valid @RequestBody Postulacion datos) {
        return ResponseEntity.ok(postulacionService.actualizar(id, datos));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostulacionDetailResponse> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(postulacionService.buscarPorId(id));
    }

    @GetMapping
    public ResponseEntity<Page<PostulacionItemResponse>> obtenerTodasPaginas(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "16") int size) {
        
        Pageable paginacion = PageRequest.of(page, size);
        return ResponseEntity.ok(postulacionService.obtenerTodasPaginas(paginacion));
    }
}