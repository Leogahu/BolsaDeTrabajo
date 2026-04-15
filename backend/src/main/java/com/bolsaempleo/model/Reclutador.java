package com.bolsaempleo.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "reclutadores")
@Data
public class Reclutador {
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
    private String empresa;
    
    @OneToMany(mappedBy = "reclutador", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Postulacion> postulaciones = new ArrayList<>();
}
