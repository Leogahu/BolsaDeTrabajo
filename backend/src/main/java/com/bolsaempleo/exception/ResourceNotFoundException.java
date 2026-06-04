package com.bolsaempleo.exception;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String resource, Long id) {
        super("%s no encontrado con id: %d".formatted(resource, id));
    }
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
