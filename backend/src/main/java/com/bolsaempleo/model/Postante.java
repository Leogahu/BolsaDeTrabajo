package com.bolsaempleo.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Table(name = "postantes")
@Data
public class Postante {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String username;
    
    @Column(nullable = false)
    private String password;
    
    @Column(nullable = false)
    private String nombreCompleto;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(nullable = false)
    private String telefono;
    
    @Column(nullable = false)
    private String carrera;
    
    @Column(length = 1000)
    private String cvPath;
    
    @OneToMany(mappedBy = "postante", cascade = CascadeType.ALL)
    private List<Habilidad> habilidades;
    
    private String fotoPerfil;
}
