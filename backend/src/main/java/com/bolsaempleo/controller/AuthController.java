package com.bolsaempleo.controller;

import com.bolsaempleo.model.Postante;
import com.bolsaempleo.model.Reclutador;
import com.bolsaempleo.repository.PostanteRepository;
import com.bolsaempleo.repository.ReclutadorRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.HashMap;

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
        
        if (username == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Faltan credenciales"));
        }

        var postante = postanteRepository.findByUsername(username);
        if (postante.isPresent() && postante.get().getPassword().equals(password)) {
            Postante p = postante.get();
            Map<String, Object> response = new HashMap<>();
            response.put("id", p.getId());
            response.put("username", p.getUsername());
            response.put("nombreCompleto", p.getNombreCompleto());
            response.put("email", p.getEmail());
            response.put("tipo", "postante"); 
            return ResponseEntity.ok(response);
        }
        
        // Intento de login como Reclutador
        var reclutador = reclutadorRepository.findByUsername(username);
        if (reclutador.isPresent() && reclutador.get().getPassword().equals(password)) {
            Reclutador r = reclutador.get();
            Map<String, Object> response = new HashMap<>();
            response.put("id", r.getId());
            response.put("username", r.getUsername());
            response.put("nombreCompleto", r.getNombreCompleto());
            response.put("email", r.getEmail());
            response.put("empresa", r.getEmpresa());
            response.put("tipo", "reclutador");
            return ResponseEntity.ok(response);
        }
        
        return ResponseEntity.status(401).body(Map.of("error", "Usuario o contraseña incorrectos"));
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
                return ResponseEntity.ok(Map.of("mensaje", "Perfil de postulante actualizado"));
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
                return ResponseEntity.ok(Map.of("mensaje", "Perfil de reclutador actualizado"));
            })
            .orElse(ResponseEntity.notFound().build());
    }
}
