package com.bolsaempleo.dto.Response;

public record AuthResponse(
    Long id,
    String username,
    String nombreCompleto,
    String email,
    String empresa,
    String tipo,
    String token
) {}
