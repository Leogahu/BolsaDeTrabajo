package com.bolsaempleo.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "postulacion_estado")
@Data
public class PostulacionEstado {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "postulacion_id", nullable = false)
    private Postulacion postulacion;
    
    @ManyToOne
    @JoinColumn(name = "postante_id", nullable = false)
    private Postante postante;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoPostulacion estado = EstadoPostulacion.CV_ENVIADO;
    
    private LocalDateTime fechaActualizacion;
    
    private String motivo;
    
    public enum EstadoPostulacion {
        CV_ENVIADO,
        EN_REVISION,
        CONTACTARAN,
        FINALIZADO
    }
}
