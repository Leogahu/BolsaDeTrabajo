package com.bolsaempleo.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "postulaciones")
@Data
public class Postulacion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String titulo;
    
    @Column(columnDefinition = "TEXT")
    private String descripcion;
    
    @Column(columnDefinition = "TEXT")
    private String requisitos;
    
    private String ubicacion;
    
    @Column(nullable = true)
    private LocalDateTime fechaPublicacion;
    
    @ManyToOne
    @JoinColumn(name = "reclutador_id", nullable = false)
    @JsonIgnore
    private Reclutador reclutador;
    
    @OneToMany(mappedBy = "postulacion", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<PostulacionEstado> candidatos = new ArrayList<>();
}
