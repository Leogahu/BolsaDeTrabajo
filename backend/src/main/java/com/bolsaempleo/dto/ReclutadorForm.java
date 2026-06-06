package com.bolsaempleo.dto;

import org.springframework.web.multipart.MultipartFile;

public record ReclutadorForm(
    String nombres,
    String apellidos,
    String email,
    String empresa,
    String telefono,
    String cargo,
    String descripcion,
    String sector,
    MultipartFile fotoFile
) {}
