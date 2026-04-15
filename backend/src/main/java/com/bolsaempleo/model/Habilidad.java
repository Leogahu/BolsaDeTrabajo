package com.bolsaempleo.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "habilidades")
@Data
public class Habilidad {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String nombre;
    
    @Column(nullable = false)
    private boolean verificada = false;
    
    @ManyToOne
    @JoinColumn(name = "postante_id", nullable = false)
    private Postante postante;
}
