package com.bolsaempleo.dto;

public record PostanteUpdate(
    String nombres,
    String apellidos,
    String email,
    String telefono,
    String carrera,
    String password
) {}
