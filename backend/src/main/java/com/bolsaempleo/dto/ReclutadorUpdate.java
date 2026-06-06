package com.bolsaempleo.dto;

import jakarta.validation.constraints.Email;

public record ReclutadorUpdate(
    String nombres,
    String apellidos,
    @Email String email,
    String empresa,
    String telefono,
    String cargo,
    String descripcion,
    String sector,
    String password
) {}
