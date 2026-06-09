package com.bolsaempleo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String rutaFotos = Paths.get("uploads/fotos").toAbsolutePath().toUri().toString();
        registry.addResourceHandler("/uploads/fotos/**")
                .addResourceLocations(rutaFotos);
        String rutaCvs = Paths.get("uploads/cvs").toAbsolutePath().toUri().toString();
        registry.addResourceHandler("/uploads/cvs/**")
                .addResourceLocations(rutaCvs);
    }
}
