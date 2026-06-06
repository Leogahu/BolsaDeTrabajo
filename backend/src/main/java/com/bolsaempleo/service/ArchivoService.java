package com.bolsaempleo.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class ArchivoService {

    @Value("${azure.storage.connection-string:}")
    private String connectionString;

    @Value("${azure.storage.container-name:archivos-bolsa}")
    private String containerName;

    @Value("${app.uploads.base-url:/uploads}")
    private String uploadsBaseUrl;

    public String subirArchivo(MultipartFile archivo, String prefijo) throws IOException {
        if (archivo == null || archivo.isEmpty()) {
            return null;
        }

        if (connectionString != null && !connectionString.isBlank()) {
            return subirAzure(archivo, prefijo);
        }
        return subirLocal(archivo, prefijo);
    }

    private String subirAzure(MultipartFile archivo, String prefijo) throws IOException {
        com.azure.storage.blob.BlobContainerClient containerClient =
            new com.azure.storage.blob.BlobContainerClientBuilder()
                .connectionString(connectionString)
                .containerName(containerName)
                .buildClient();

        String nombreLimpio = archivo.getOriginalFilename().replaceAll("\\s+", "_");
        String nombreUnico = prefijo + "_" + UUID.randomUUID() + "_" + nombreLimpio;
        var blobClient = containerClient.getBlobClient(nombreUnico);
        blobClient.upload(archivo.getInputStream(), archivo.getSize(), true);
        return blobClient.getBlobUrl();
    }

    private String subirLocal(MultipartFile archivo, String prefijo) throws IOException {
        boolean esCv = prefijo.startsWith("cv");
        String subcarpeta = esCv ? "cvs" : "fotos";
        Path directorio = Paths.get("uploads", subcarpeta);
        Files.createDirectories(directorio);

        String original = archivo.getOriginalFilename() != null ? archivo.getOriginalFilename() : "archivo";
        String nombreLimpio = original.replaceAll("\\s+", "_");
        String nombreUnico = prefijo + "_" + UUID.randomUUID() + "_" + nombreLimpio;
        Path destino = directorio.resolve(nombreUnico);
        Files.copy(archivo.getInputStream(), destino);

        return uploadsBaseUrl + "/" + subcarpeta + "/" + nombreUnico;
    }
}
