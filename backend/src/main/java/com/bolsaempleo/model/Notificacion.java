package com.bolsaempleo.model;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "notificaciones")
@EntityListeners(AuditingEntityListener.class)
@Data
public class Notificacion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long usuarioId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoUsuario usuarioTipo;

    @Column(nullable = false)
    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String mensaje;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoNotificacion tipo;

    private Long referenciaId;

    @Column(nullable = false)
    private boolean leida = false;

    @CreatedDate
    private LocalDateTime fechaCreacion;

    public enum TipoUsuario { POSTANTE, RECLUTADOR }

    public enum TipoNotificacion { VACANTE, POSTULACION, FEEDBACK, MENSAJE, SISTEMA }
}
