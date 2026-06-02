package com.bolsaempleo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Exponer la carpeta de fotos de perfil
        String rutaFotos = Paths.get("uploads/fotos").toAbsolutePath().toUri().toString();
        registry.addResourceHandler("/uploads/fotos/**")
                .addResourceLocations(rutaFotos);

        // Exponer la carpeta de CVs (por si te da el mismo error con los PDFs más adelante)
        String rutaCvs = Paths.get("uploads/cvs").toAbsolutePath().toUri().toString();
        registry.addResourceHandler("/uploads/cvs/**")
                .addResourceLocations(rutaCvs);
    }
}
