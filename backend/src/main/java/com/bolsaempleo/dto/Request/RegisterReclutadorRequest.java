package com.bolsaempleo.dto.Request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterReclutadorRequest(
    @NotBlank String username,
    @NotBlank String nombres,
    @NotBlank String apellidos,
    @NotBlank @Email String email,
    @NotBlank @Size(min = 4) String password,
    @NotBlank String empresa
) {}
