package com.bolsaempleo.exception;

import java.time.LocalDateTime;
import org.springframework.http.HttpStatus;

public record ErrorResponse(
        int status,
        String error,
        String message,
        String path,
        LocalDateTime timestamp
) {
    public ErrorResponse(HttpStatus status, String message, String path) {
        this(status.value(), status.getReasonPhrase(), message, path, LocalDateTime.now());
    }
}
