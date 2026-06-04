package com.bolsaempleo.dto;

import org.springframework.web.multipart.MultipartFile;

public record PostanteForm(
    String nombres,
    String apellidos,
    String descripcion,
    String carrera,
    String institucion,
    Boolean egresado,
    String telefono,
    MultipartFile cvFile,
    MultipartFile fotoFile
) {}
