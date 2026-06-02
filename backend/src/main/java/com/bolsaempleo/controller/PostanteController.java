package com.bolsaempleo.controller;

import com.bolsaempleo.model.Postante;
import com.bolsaempleo.repository.PostanteRepository;
import com.bolsaempleo.service.PostanteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.Map;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

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
                            Path directorioCvs = Paths.get("uploads/cvs");
                            if (!Files.exists(directorioCvs)) Files.createDirectories(directorioCvs);
                            String nombreArchivo = "cv_" + id + "_" + cvFile.getOriginalFilename().replaceAll("\\s+", "_");
                            Path rutaDestinoCv = directorioCvs.resolve(nombreArchivo);
                            Files.copy(cvFile.getInputStream(), rutaDestinoCv, StandardCopyOption.REPLACE_EXISTING);
                            postante.setCvPath("/uploads/cvs/" + nombreArchivo);
                        }

                        if (fotoFile != null && !fotoFile.isEmpty()) {
                            Path directorioFotos = Paths.get("uploads/fotos");
                            if (!Files.exists(directorioFotos)) Files.createDirectories(directorioFotos);
                            String nombreFoto = "foto_" + id + "_" + fotoFile.getOriginalFilename().replaceAll("\\s+", "_");
                            Path rutaDestinoFoto = directorioFotos.resolve(nombreFoto);
                            Files.copy(fotoFile.getInputStream(), rutaDestinoFoto, StandardCopyOption.REPLACE_EXISTING);
                            postante.setFotoPerfil("/uploads/fotos/" + nombreFoto);
                        }
                        
                        postanteRepository.save(postante);
                        return ResponseEntity.ok(Map.of("message", "Perfil actualizado con éxito"));

                    } catch (Exception e) {
                        System.err.println("Error procesando archivos físicos: " + e.getMessage());
                        return ResponseEntity.internalServerError().body(Map.of("error", "Error al escribir los archivos en el servidor."));
                    }
                })
                .orElse(ResponseEntity.notFound().build());
    }
}