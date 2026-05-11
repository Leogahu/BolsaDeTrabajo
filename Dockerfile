# Etapa 1: Construcción
FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /build
COPY backend/pom.xml .
COPY backend/src ./src
RUN mvn clean package -DskipTests

# Etapa 2: Ejecución
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Crear usuario no root por seguridad
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copiar el JAR generado
COPY --from=builder --chown=appuser:appgroup /build/target/*.jar app.jar

# Puerto por defecto de Spring Boot
EXPOSE 8080

# Usuario no root
USER appuser

# Comando para ejecutar la aplicación
ENTRYPOINT ["java", "-jar", "app.jar"]