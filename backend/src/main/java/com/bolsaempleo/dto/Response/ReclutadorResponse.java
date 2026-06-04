package com.bolsaempleo.dto.Response;

public record ReclutadorResponse(
    Long id,
    String username,
    String nombres,
    String apellidos,
    String email,
    String empresa
) {
    public static ReclutadorResponse fromEntity(com.bolsaempleo.model.Reclutador r) {
        return new ReclutadorResponse(
            r.getId(),
            r.getUsername(),
            r.getNombres(),
            r.getApellidos(),
            r.getEmail(),
            r.getEmpresa()
        );
    }
}
