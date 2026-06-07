package com.bolsaempleo.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.servers.Server;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;

import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class SwaggerConfig {

    // Valor inyectado desde application.properties:
    //   local:      http://localhost:8080
    //   producción: https://bolsadetrabajo-1t58.onrender.com  (var APP_BACKEND_URL en Render)
    @Value("${app.backend-url:http://localhost:8080}")
    private String backendUrl;

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Bolsa de Trabajo API")
                        .version("1.0.0")
                        .description("API REST — ChapaTuChamba")
                        .contact(new Contact().name("Equipo Bolsa de Trabajo")))

                .servers(List.of(
                        new Server()
                                .url(backendUrl)
                                .description("Servidor activo"),
                        new Server()
                                .url("https://bolsadetrabajo-1t58.onrender.com")
                                .description("Render (Producción)"),
                        new Server()
                                .url("http://localhost:8080")
                                .description("Local (Desarrollo)")
                ))

                .components(new Components()
                        .addSecuritySchemes("bearerAuth", new SecurityScheme()
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .description("Token JWT del endpoint POST /api/v1/auth/login")))
                .addSecurityItem(new SecurityRequirement().addList("bearerAuth"));
    }
    @Bean
    public GroupedOpenApi apiGroup() {
        return GroupedOpenApi.builder()
                .group("api")
                .pathsToMatch("/api/v1/**")
                .build();
    }
}