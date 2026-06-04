package com.bolsaempleo.exception;

import io.jsonwebtoken.JwtException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.*;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(
            ResourceNotFoundException ex, HttpServletRequest req) {
        return ResponseEntity.status(NOT_FOUND)
                .body(new ErrorResponse(NOT_FOUND, ex.getMessage(), req.getRequestURI()));
    }

    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ErrorResponse> handleDuplicateResource(
            DuplicateResourceException ex, HttpServletRequest req) {
        return ResponseEntity.status(CONFLICT)
                .body(new ErrorResponse(CONFLICT, ex.getMessage(), req.getRequestURI()));
    }
    @ExceptionHandler(BusinessRuleException.class)
    public ResponseEntity<ErrorResponse> handleBusinessRule(
            BusinessRuleException ex, HttpServletRequest req) {
        return ResponseEntity.status(UNPROCESSABLE_ENTITY)
                .body(new ErrorResponse(UNPROCESSABLE_ENTITY, ex.getMessage(), req.getRequestURI()));
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentials(
            BadCredentialsException ex, HttpServletRequest req) {
        return ResponseEntity.status(UNAUTHORIZED)
                .body(new ErrorResponse(UNAUTHORIZED, ex.getMessage(), req.getRequestURI()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(
            MethodArgumentNotValidException ex, HttpServletRequest req) {

        String detalles = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> "[%s]: %s".formatted(error.getField(), error.getDefaultMessage()))
                .collect(Collectors.joining(" | "));

        String message = "Error de validación en los datos enviados: " + detalles;
        
        return ResponseEntity.status(BAD_REQUEST)
                .body(new ErrorResponse(BAD_REQUEST, message, req.getRequestURI()));
    }

    @ExceptionHandler(JwtException.class)
    public ResponseEntity<ErrorResponse> handleJwt(
            JwtException ex, HttpServletRequest req) {
        return ResponseEntity.status(UNAUTHORIZED)
                .body(new ErrorResponse(UNAUTHORIZED, "Token inválido o expirado.", req.getRequestURI()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneral(
            Exception ex, HttpServletRequest req) {
        return ResponseEntity.status(INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse(INTERNAL_SERVER_ERROR, "Error interno del servidor.", req.getRequestURI()));
    }
}