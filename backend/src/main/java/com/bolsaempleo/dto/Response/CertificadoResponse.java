package com.bolsaempleo.dto.Response;

import java.time.LocalDate;

public record CertificadoResponse(
    Long id,
    String nombreCurso,
    String institucionEmisora,
    LocalDate fechaEmision
) {}
