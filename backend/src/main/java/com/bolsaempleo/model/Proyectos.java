package com.bolsaempleo.model;
import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "proyectos_academicos")
@Data
public class Proyectos {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String titulo;
    
    @Column(columnDefinition = "TEXT")
    private String descripcion;
    
    private String urlEvidencia; 
    
    @ManyToOne
    @JoinColumn(name = "postante_id", nullable = false)
    @JsonBackReference 
    private Postante postante;
}
