package com.bolsaempleo.service;

import com.azure.storage.blob.BlobClient;
import com.azure.storage.blob.BlobContainerClient;
import com.azure.storage.blob.BlobContainerClientBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.UUID;

@Service
public class ArchivoService {

    @Value("${azure.storage.connection-string}")
    private String connectionString;

    @Value("${azure.storage.container-name}")
    private String containerName;

    public String subirArchivo(MultipartFile archivo, String prefijo) throws IOException {
        if (archivo == null || archivo.isEmpty()) {
            return null;
        }

        BlobContainerClient containerClient = new BlobContainerClientBuilder()
                .connectionString(connectionString)
                .containerName(containerName)
                .buildClient();

        String nombreLimpio = archivo.getOriginalFilename().replaceAll("\\s+", "_");
        String nombreUnico = prefijo + "_" + UUID.randomUUID().toString() + "_" + nombreLimpio;
        BlobClient blobClient = containerClient.getBlobClient(nombreUnico);
        blobClient.upload(archivo.getInputStream(), archivo.getSize(), true);
        return blobClient.getBlobUrl();
    }
}