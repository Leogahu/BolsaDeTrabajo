package com.bolsaempleo.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

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
    @JsonIgnore
    private String password;
    
    @Column(nullable = false, length = 100)
    private String nombres;

    @Column(nullable = false, length = 100)
    private String apellidos;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    private String telefono;
    
    private String carrera;

    private Boolean egresado;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(length = 100)
    private String institucion;

    @Column(length = 1000)
    private String cvPath;

    private String fotoPerfil;
    
    @OneToMany(mappedBy = "postante", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference 
    private List<Proyectos> proyectosAcademicos;

    @OneToMany(mappedBy = "postante", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference 
    private List<Habilidad> habilidades;
    
    @OneToMany(mappedBy = "postante", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference 
    private List<Certificados> certificaciones;

    @OneToMany(mappedBy = "postante", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference 
    private List<Avales> avalesAcademicos;
}
