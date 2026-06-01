package com.bolsaempleo.controller;

import com.bolsaempleo.model.Postante;
import com.bolsaempleo.repository.PostanteRepository;
import com.bolsaempleo.service.PostanteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/postantes")
@CrossOrigin(origins = "*")
public class PostanteController {
    
    private final PostanteService postanteService;
    private final PostanteRepository postanteRepository;
    
    public PostanteController(PostanteService postanteService, PostanteRepository postanteRepository) {
        this.postanteService = postanteService;
        this.postanteRepository = postanteRepository;
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> registrar(@ModelAttribute Postante postante,
                                       @RequestParam(value = "cvFile", required = false) MultipartFile cvFile) {
        try {
            Postante nuevo = postanteService.registrar(postante, cvFile);
            return ResponseEntity.ok(nuevo);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable Long id) {
        return postanteService.buscarPorId(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping("/{id}/habilidades")
    public ResponseEntity<?> agregarHabilidades(@PathVariable Long id,
                                                 @RequestBody List<String> habilidades) {
        try {
            Postante postante = postanteService.agregarHabilidades(id, habilidades);
            return ResponseEntity.ok(postante);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    @PutMapping("/{id}/descripcion")
    public ResponseEntity<?> actualizarDescripcion(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return postanteRepository.findById(id)
                .map(postante -> {
                    String nuevaDescripcion = body.get("descripcion");
                    postante.setDescripcion(nuevaDescripcion);
                    postanteRepository.save(postante); 
                    
                    return ResponseEntity.ok(Map.of("message", "Descripción actualizada con éxito"));
                })
                .orElse(ResponseEntity.notFound().build());
    }
    @GetMapping("/{id}/habilidades")
    public ResponseEntity<?> obtenerHabilidades(@PathVariable Long id) {
        return ResponseEntity.ok(postanteService.obtenerHabilidades(id));
    }
    
    @PutMapping("/habilidades/{habilidadId}/verificar")
    public ResponseEntity<?> verificarHabilidad(@PathVariable Long habilidadId) {
        try {
            postanteService.verificarHabilidad(habilidadId);
            return ResponseEntity.ok(Map.of("mensaje", "Habilidad verificada"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/{id}/postulaciones")
    public ResponseEntity<?> obtenerPostulaciones(@PathVariable Long id) {
        return ResponseEntity.ok(postanteService.obtenerPostulaciones(id));
    }
    @PutMapping(value = "/{id}/completo", consumes = {"multipart/form-data"})
    public ResponseEntity<?> actualizarPerfilCompleto(
            @PathVariable Long id,
            @RequestParam("nombres") String nombres,      
            @RequestParam("apellidos") String apellidos,  
            @RequestParam("descripcion") String descripcion,
            @RequestParam("carrera") String carrera,
            @RequestParam(value = "cvFile", required = false) MultipartFile cvFile) {
        
        return postanteRepository.findById(id)
                .map(postante -> {
                    postante.setNombres(nombres);
                    postante.setApellidos(apellidos);
                    postante.setDescripcion(descripcion);
                    postante.setCarrera(carrera);
                    
                    if (cvFile != null && !cvFile.isEmpty()) {
                        try {
                            String nombreArchivo = "cv_" + id + "_" + cvFile.getOriginalFilename();
                            postante.setCvPath("/uploads/cvs/" + nombreArchivo);
                        } catch (Exception e) {
                            return ResponseEntity.internalServerError().body("Error al procesar el PDF");
                        }
                    }
                    
                    postanteRepository.save(postante);
                    return ResponseEntity.ok(Map.of("message", "Perfil actualizado integralmente de forma exitosa"));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}