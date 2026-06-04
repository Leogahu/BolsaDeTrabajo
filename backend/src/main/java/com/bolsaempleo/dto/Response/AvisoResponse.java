package com.bolsaempleo.dto.Response;

public record AvisoResponse(
    Long id,
    String titulo,
    String descripcion,
    String requisitos,
    String ubicacion,
    Object fechaPublicacion,
    Double sueldoMin,
    Double sueldoMax,
    String tipoModalidad,
    String tipoPuesto,
    String empresa,
    Integer cantidadCandidatos
) {
    public static AvisoResponse fromEntity(com.bolsaempleo.model.Postulacion p) {
        String nombreEmpresa = "Empresa Aliada";
        if (p.getReclutador() != null && p.getReclutador().getEmpresa() != null) {
            nombreEmpresa = p.getReclutador().getEmpresa();
        }
        
        return new AvisoResponse(
            p.getId(), p.getTitulo(), p.getDescripcion(), p.getRequisitos(),
            p.getUbicacion(), p.getFechaPublicacion(), p.getSalarioMinimo(),
            p.getSalarioMaximo(), p.getTipoModalidad(), p.getTipoPuesto(),
            nombreEmpresa, 0
        );
    }
}
