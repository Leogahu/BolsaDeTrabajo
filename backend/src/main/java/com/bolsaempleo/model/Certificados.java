package com.bolsaempleo.model;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "certificaciones")
@Data
public class Certificados {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String nombreCurso;
    
    private String institucionEmisora;
    
    private LocalDate fechaEmision;
    
    @ManyToOne
    @JoinColumn(name = "postante_id", nullable = false)
    @JsonBackReference
    private Postante postante;
}

