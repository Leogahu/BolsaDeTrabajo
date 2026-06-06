package com.bolsaempleo.model;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "alertas_empleo")
@EntityListeners(AuditingEntityListener.class)
@Data
public class AlertaEmpleo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "postante_id", nullable = false)
    private Postante postante;

    @Column(nullable = false)
    private String keyword;

    private String modalidad;

    private String frecuencia;

    @Column(nullable = false)
    private boolean activa = true;

    @CreatedDate
    private LocalDateTime fechaCreacion;
}
