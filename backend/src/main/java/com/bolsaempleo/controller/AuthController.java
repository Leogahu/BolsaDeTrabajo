package com.bolsaempleo.controller;

import com.bolsaempleo.dto.Request.LoginRequest;
import com.bolsaempleo.dto.PostanteUpdate;
import com.bolsaempleo.dto.Response.AuthResponse;
import com.bolsaempleo.dto.Response.ApiMessageResponse;
import com.bolsaempleo.dto.Response.PostanteResponse;
import com.bolsaempleo.model.Postante;
import com.bolsaempleo.service.AuthService;
import com.bolsaempleo.service.PostanteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AuthController {
    
    private final AuthService authService;
    private final PostanteService postanteService;

    @PostMapping("/postante/register")
    public ResponseEntity<PostanteResponse> registrarPostante(@RequestBody Postante postante) throws IOException { 
        var response = postanteService.registrar(postante, null); 
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest credentials) {
        AuthResponse response = authService.login(credentials);
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/postante/{id}")
    public ResponseEntity<ApiMessageResponse> actualizarPostante(
            @PathVariable Long id, 
            @Valid @RequestBody PostanteUpdate dto) {
        postanteService.actualizarPerfil(id, dto);
        return ResponseEntity.ok(new ApiMessageResponse("Perfil de postulante actualizado con éxito"));
    }
}