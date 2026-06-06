package com.bolsaempleo.controller;

import com.bolsaempleo.dto.Request.AlertaEmpleoRequest;
import com.bolsaempleo.dto.Response.AlertaEmpleoResponse;
import com.bolsaempleo.service.AlertaEmpleoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/alertas-empleo")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AlertaEmpleoController {

    private final AlertaEmpleoService alertaEmpleoService;

    @GetMapping("/postante/{postanteId}")
    public ResponseEntity<List<AlertaEmpleoResponse>> listar(@PathVariable Long postanteId) {
        return ResponseEntity.ok(alertaEmpleoService.listar(postanteId));
    }

    @PostMapping("/postante/{postanteId}")
    public ResponseEntity<AlertaEmpleoResponse> crear(
            @PathVariable Long postanteId,
            @Valid @RequestBody AlertaEmpleoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(alertaEmpleoService.crear(postanteId, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        alertaEmpleoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
