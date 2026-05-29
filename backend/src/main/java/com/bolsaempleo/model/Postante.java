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
    
    private String telefono;
    
    private String carrera;

    private Boolean egresado;

    @Column(length = 100)
    private String institucion;

    @Column(length = 1000)
    private String cvPath;
    
    @OneToMany(mappedBy = "postante", cascade = CascadeType.ALL)
    private List<Habilidad> habilidades;

    @OneToMany(mappedBy = "postante", cascade = CascadeType.ALL)
    private List<Proyectos> proyectosAcademicos;

    @OneToMany(mappedBy = "postante", cascade = CascadeType.ALL)
    private List<Certificados> certificaciones;

    @OneToMany(mappedBy = "postante", cascade = CascadeType.ALL)
    private List<Avales> avalesAcademicos;
    
    private String fotoPerfil;
}
