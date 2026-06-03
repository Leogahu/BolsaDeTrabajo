package com.bolsaempleo.controller;

import com.bolsaempleo.model.Postante;
import com.bolsaempleo.repository.PostanteRepository;
import com.bolsaempleo.service.PostanteService;
import com.bolsaempleo.service.ArchivoService; 
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
    private final ArchivoService archivoService; 
    
    public PostanteController(PostanteService postanteService, 
                              PostanteRepository postanteRepository, 
                              ArchivoService archivoService) { 
        this.postanteService = postanteService;
        this.postanteRepository = postanteRepository;
        this.archivoService = archivoService;
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

    @PutMapping("/{id}/completo")
    public ResponseEntity<?> actualizarPerfilCompleto(
            @PathVariable Long id,
            @RequestParam("nombres") String nombres,      
            @RequestParam("apellidos") String apellidos,  
            @RequestParam("descripcion") String descripcion,
            @RequestParam("carrera") String carrera,
            @RequestParam("institucion") String institucion,
            @RequestParam("egresado") Boolean egresado,     
            @RequestParam("telefono") String telefono,     
            @RequestParam(value = "cvFile", required = false) MultipartFile cvFile,
            @RequestParam(value = "fotoFile", required = false) MultipartFile fotoFile) { 
        
        return postanteRepository.findById(id)
                .map(postante -> {
                    try {
                        postante.setNombres(nombres);
                        postante.setApellidos(apellidos);
                        postante.setDescripcion(descripcion);
                        postante.setCarrera(carrera);
                        postante.setInstitucion(institucion);
                        postante.setEgresado(egresado);
                        postante.setTelefono(telefono);   

                        if (cvFile != null && !cvFile.isEmpty()) {
                            String urlCv = archivoService.subirArchivo(cvFile, "cv_" + id);
                            postante.setCvPath(urlCv);
                        }

                        if (fotoFile != null && !fotoFile.isEmpty()) {
                            String urlFoto = archivoService.subirArchivo(fotoFile, "foto_" + id);
                            postante.setFotoPerfil(urlFoto);
                        }
                        
                        postanteRepository.save(postante);
                        return ResponseEntity.ok(Map.of("message", "Perfil actualizado con éxito"));

                    } catch (Exception e) {
                        System.err.println("Error procesando archivos en Azure Storage: " + e.getMessage());
                        return ResponseEntity.internalServerError().body(Map.of("error", "Error al procesar el guardado en la nube de Azure."));
                    }
                })
                .orElse(ResponseEntity.notFound().build());
    }
}