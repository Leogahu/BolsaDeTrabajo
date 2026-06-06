package com.bolsaempleo.dto.Response;

public record ReclutadorResponse(
    Long id,
    String username,
    String nombres,
    String apellidos,
    String email,
    String empresa,
    String telefono,
    String cargo,
    String descripcion,
    String fotoPerfil,
    String sector
) {}
