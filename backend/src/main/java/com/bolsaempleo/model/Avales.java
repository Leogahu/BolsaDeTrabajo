package com.bolsaempleo.model;
import com.fasterxml.jackson.annotation.JsonBackReference;
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
    private String nombreAvalador;
    
    private String cargoInstitucion; 
    
    @Column(columnDefinition = "TEXT")
    private String comentarioAval;
    
    private String contactoEmail;
    
    @ManyToOne
    @JoinColumn(name = "postante_id", nullable = false)
    @JsonBackReference
    private Postante postante;
}