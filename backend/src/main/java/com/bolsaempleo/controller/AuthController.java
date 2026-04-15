package com.bolsaempleo.controller;

import com.bolsaempleo.model.Postante;
import com.bolsaempleo.model.Reclutador;
import com.bolsaempleo.repository.PostanteRepository;
import com.bolsaempleo.repository.ReclutadorRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    
    private final PostanteRepository postanteRepository;
    private final ReclutadorRepository reclutadorRepository;
    
    public AuthController(PostanteRepository postanteRepository, ReclutadorRepository reclutadorRepository) {
        this.postanteRepository = postanteRepository;
        this.reclutadorRepository = reclutadorRepository;
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");
        
        var postante = postanteRepository.findByUsername(username);
        if (postante.isPresent() && postante.get().getPassword().equals(password)) {
            Postante p = postante.get();
            return ResponseEntity.ok(Map.of(
                "id", p.getId(),
                "username", p.getUsername(),
                "nombreCompleto", p.getNombreCompleto(),
                "email", p.getEmail(),
                "telefono", p.getTelefono(),
                "carrera", p.getCarrera(),
                "cvPath", p.getCvPath() != null ? p.getCvPath() : "",
                "tipo", "postante"
            ));
        }
        
        var reclutador = reclutadorRepository.findByUsername(username);
        if (reclutador.isPresent() && reclutador.get().getPassword().equals(password)) {
            Reclutador r = reclutador.get();
            return ResponseEntity.ok(Map.of(
                "id", r.getId(),
                "username", r.getUsername(),
                "nombreCompleto", r.getNombreCompleto(),
                "email", r.getEmail(),
                "empresa", r.getEmpresa(),
                "tipo", "reclutador"
            ));
        }
        
        return ResponseEntity.badRequest().body(Map.of("error", "Usuario o contraseña incorrectos"));
    }
    
    @PostMapping("/postante/register")
    public ResponseEntity<?> registrarPostante(@ModelAttribute Postante postante,
                                               @RequestParam(value = "cvFile", required = false) MultipartFile cvFile) {
        try {
            if (postanteRepository.existsByUsername(postante.getUsername())) {
                return ResponseEntity.badRequest().body(Map.of("error", "El nombre de usuario ya existe"));
            }
            if (postanteRepository.existsByEmail(postante.getEmail())) {
                return ResponseEntity.badRequest().body(Map.of("error", "El email ya está registrado"));
            }
            
            if (cvFile != null && !cvFile.isEmpty()) {
                postante.setCvPath(cvFile.getOriginalFilename());
            }
            
            Postante nuevo = postanteRepository.save(postante);
            return ResponseEntity.ok(Map.of(
                "id", nuevo.getId(),
                "username", nuevo.getUsername(),
                "nombreCompleto", nuevo.getNombreCompleto(),
                "email", nuevo.getEmail(),
                "telefono", nuevo.getTelefono(),
                "carrera", nuevo.getCarrera(),
                "tipo", "postante"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping("/reclutador/register")
    public ResponseEntity<?> registrarReclutador(@RequestBody Reclutador reclutador) {
        try {
            if (reclutadorRepository.existsByUsername(reclutador.getUsername())) {
                return ResponseEntity.badRequest().body(Map.of("error", "El nombre de usuario ya existe"));
            }
            if (reclutadorRepository.existsByEmail(reclutador.getEmail())) {
                return ResponseEntity.badRequest().body(Map.of("error", "El email ya está registrado"));
            }
            
            Reclutador nuevo = reclutadorRepository.save(reclutador);
            return ResponseEntity.ok(Map.of(
                "id", nuevo.getId(),
                "username", nuevo.getUsername(),
                "nombreCompleto", nuevo.getNombreCompleto(),
                "email", nuevo.getEmail(),
                "empresa", nuevo.getEmpresa(),
                "tipo", "reclutador"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PutMapping("/postante/{id}")
    public ResponseEntity<?> actualizarPostante(@PathVariable Long id, @RequestBody Map<String, String> datos) {
        return postanteRepository.findById(id)
            .map(postante -> {
                if (datos.containsKey("nombreCompleto")) postante.setNombreCompleto(datos.get("nombreCompleto"));
                if (datos.containsKey("email")) postante.setEmail(datos.get("email"));
                if (datos.containsKey("telefono")) postante.setTelefono(datos.get("telefono"));
                if (datos.containsKey("carrera")) postante.setCarrera(datos.get("carrera"));
                if (datos.containsKey("password") && !datos.get("password").isEmpty()) {
                    postante.setPassword(datos.get("password"));
                }
                postanteRepository.save(postante);
                return ResponseEntity.ok(Map.of("mensaje", "Perfil actualizado"));
            })
            .orElse(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/reclutador/{id}")
    public ResponseEntity<?> actualizarReclutador(@PathVariable Long id, @RequestBody Map<String, String> datos) {
        return reclutadorRepository.findById(id)
            .map(reclutador -> {
                if (datos.containsKey("nombreCompleto")) reclutador.setNombreCompleto(datos.get("nombreCompleto"));
                if (datos.containsKey("email")) reclutador.setEmail(datos.get("email"));
                if (datos.containsKey("empresa")) reclutador.setEmpresa(datos.get("empresa"));
                if (datos.containsKey("password") && !datos.get("password").isEmpty()) {
                    reclutador.setPassword(datos.get("password"));
                }
                reclutadorRepository.save(reclutador);
                return ResponseEntity.ok(Map.of("mensaje", "Perfil actualizado"));
            })
            .orElse(ResponseEntity.notFound().build());
    }
}
