package com.bolsaempleo.dto.Response;

public record ProyectoResponse(
    Long id,
    String titulo,
    String descripcion,
    String urlEvidencia
) {
    public static ProyectoResponse fromEntity(com.bolsaempleo.model.Proyectos p) {
        return new ProyectoResponse(
            p.getId(),
            p.getTitulo(),
            p.getDescripcion(),
            p.getUrlEvidencia()
        );
    }
}
