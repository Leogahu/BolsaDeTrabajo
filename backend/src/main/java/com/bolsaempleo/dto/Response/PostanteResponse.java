package com.bolsaempleo.dto.Response;

public record PostanteResponse(
    Long id,
    String username,
    String nombres,
    String apellidos,
    String email,
    String descripcion,
    String carrera,
    String institucion,
    Boolean egresado,
    String telefono,
    String cvPath,
    String fotoPerfil
) {
    public static PostanteResponse fromEntity(com.bolsaempleo.model.Postante p) {
    return new PostanteResponse(
        p.getId(), p.getUsername(), p.getNombres(), p.getApellidos(), p.getEmail(),
        p.getDescripcion(), p.getCarrera(), p.getInstitucion(), p.getEgresado(),
        p.getTelefono(), p.getCvPath(), p.getFotoPerfil()
    );
}
}
