package com.bolsaempleo.controller;

import com.bolsaempleo.dto.DescripcionUpdate;
import com.bolsaempleo.dto.PostanteForm;
import com.bolsaempleo.dto.Request.AvalRequest;
import com.bolsaempleo.dto.Request.CertificadoRequest;
import com.bolsaempleo.dto.Response.AvalResponse;
import com.bolsaempleo.dto.Response.CertificadoResponse;
import com.bolsaempleo.dto.Response.ApiMessageResponse;
import com.bolsaempleo.dto.Response.PostanteResponse;
import com.bolsaempleo.dto.Response.PostulacionEstadoResponse;
import com.bolsaempleo.model.Habilidad;
import com.bolsaempleo.model.Postante;
import com.bolsaempleo.service.AvalService;
import com.bolsaempleo.service.CertificadoService;
import com.bolsaempleo.service.PostanteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/postantes")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class PostanteController {
    
    private final PostanteService postanteService;
    private final CertificadoService certificadoService;
    private final AvalService avalService;
    
    @PostMapping(value = "/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PostanteResponse> registrar(
            @ModelAttribute Postante postante,
            @RequestParam(value = "cvFile", required = false) MultipartFile cvFile) throws IOException {
        return ResponseEntity.status(HttpStatus.CREATED).body(postanteService.registrar(postante, cvFile));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<PostanteResponse> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(postanteService.buscarPorId(id));
    }
    
    @PostMapping("/{id}/habilidades")
    public ResponseEntity<PostanteResponse> agregarHabilidades(
            @PathVariable Long id,
            @RequestBody List<String> habilidades) {
        return ResponseEntity.status(HttpStatus.CREATED).body(postanteService.agregarHabilidades(id, habilidades));
    }

    @PutMapping("/{id}/descripcion")
    public ResponseEntity<ApiMessageResponse> actualizarDescripcion(
            @PathVariable Long id, 
            @Valid @RequestBody DescripcionUpdate dto) {
        postanteService.actualizarDescripcion(id, dto);
        return ResponseEntity.ok(new ApiMessageResponse("Descripción actualizada con éxito"));
    }

    @GetMapping("/{id}/habilidades")
    public ResponseEntity<List<Habilidad>> obtenerHabilidades(@PathVariable Long id) {
        return ResponseEntity.ok(postanteService.obtenerHabilidades(id));
    }
    
    @PutMapping("/habilidades/{habilidadId}/verificar")
    public ResponseEntity<ApiMessageResponse> verificarHabilidad(@PathVariable Long habilidadId) {
        postanteService.verificarHabilidad(habilidadId);
        return ResponseEntity.ok(new ApiMessageResponse("Habilidad verificada"));
    }
    
    @GetMapping("/{id}/postulaciones")
    public ResponseEntity<List<PostulacionEstadoResponse>> obtenerPostulaciones(@PathVariable Long id) {
        return ResponseEntity.ok(postanteService.obtenerPostulacionesResponse(id));
    }

    @GetMapping("/{id}/certificados")
    public ResponseEntity<List<CertificadoResponse>> obtenerCertificados(@PathVariable Long id) {
        return ResponseEntity.ok(certificadoService.listarPorPostante(id));
    }

    @PostMapping("/{id}/certificados")
    public ResponseEntity<CertificadoResponse> crearCertificado(
            @PathVariable Long id,
            @Valid @RequestBody CertificadoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(certificadoService.crear(id, request));
    }

    @GetMapping("/{id}/avales")
    public ResponseEntity<List<AvalResponse>> obtenerAvales(@PathVariable Long id) {
        return ResponseEntity.ok(avalService.listarPorPostante(id));
    }

    @PostMapping("/{id}/avales")
    public ResponseEntity<AvalResponse> crearAval(
            @PathVariable Long id,
            @Valid @RequestBody AvalRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(avalService.crear(id, request));
    }

    @DeleteMapping("/avales/{avalId}")
    public ResponseEntity<Void> eliminarAval(@PathVariable Long avalId) {
        avalService.eliminar(avalId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping(value = "/{id}/completo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiMessageResponse> actualizarPerfilCompleto(
            @PathVariable Long id,
            @ModelAttribute PostanteForm formDto) throws IOException { 
        
        postanteService.actualizarPerfilCompleto(id, formDto);
        return ResponseEntity.ok(new ApiMessageResponse("Perfil actualizado con éxito"));
    }
}