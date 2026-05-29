package com.bolsaempleo.model;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "avales_academicos")
@Data
public class Avales {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String nombreAvalador; // Nombre del profesor o mentor
    
    private String cargoInstitucion; // Docente de Ingenieria de Software en UPC
    
    @Column(columnDefinition = "TEXT")
    private String comentarioAval;
    
    private String contactoEmail;
    
    @ManyToOne
    @JoinColumn(name = "postante_id", nullable = false)
    private Postante postante;
}