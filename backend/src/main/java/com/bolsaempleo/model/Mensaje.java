package com.bolsaempleo.model;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "mensajes")
@EntityListeners(AuditingEntityListener.class)
@Data
public class Mensaje {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "conversacion_id", nullable = false)
    private Conversacion conversacion;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoRemitente remitenteTipo;

    @Column(nullable = false)
    private Long remitenteId;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String contenido;

    @Column(nullable = false)
    private boolean leido = false;

    @CreatedDate
    private LocalDateTime fechaEnvio;

    public enum TipoRemitente { POSTANTE, RECLUTADOR }
}
