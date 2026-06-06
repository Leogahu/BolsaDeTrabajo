package com.bolsaempleo.dto.Response;

public record AuthResponse(
    Long id,
    String username,
    String nombres,
    String apellidos,
    String nombreCompleto,
    String email,
    String empresa,
    String fotoPerfil,
    String tipo,
    String token
) {}
