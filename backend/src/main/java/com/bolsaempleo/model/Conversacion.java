package com.bolsaempleo.model;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "conversaciones")
@EntityListeners(AuditingEntityListener.class)
@Data
public class Conversacion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "postante_id", nullable = false)
    private Postante postante;

    @ManyToOne
    @JoinColumn(name = "reclutador_id", nullable = false)
    private Reclutador reclutador;

    @ManyToOne
    @JoinColumn(name = "postulacion_estado_id")
    private PostulacionEstado postulacionEstado;

    private String ultimoMensaje;

    private LocalDateTime fechaUltimoMensaje;

    @Column(nullable = false)
    private boolean activa = true;

    @CreatedDate
    private LocalDateTime fechaCreacion;
}
