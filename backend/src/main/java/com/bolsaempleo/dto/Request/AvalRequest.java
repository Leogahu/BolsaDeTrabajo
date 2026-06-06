package com.bolsaempleo.dto.Request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record AvalRequest(
    @NotBlank String nombreAvalador,
    String cargoInstitucion,
    String comentarioAval,
    @Email String contactoEmail
) {}
