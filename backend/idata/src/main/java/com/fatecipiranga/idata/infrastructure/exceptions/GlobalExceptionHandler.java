package com.fatecipiranga.idata.infrastructure.exceptions;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger LOGGER = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(ExameManagementException.class)
    public ResponseEntity<ErrorResponse> handleExameManagementException(ExameManagementException ex) {
        LOGGER.warn("ExameManagementException: {} [Code: {}]", ex.getMessage(), ex.getErrorCode());
        ErrorResponse errorResponse = new ErrorResponse(ex.getMessage(), ex.getErrorCode());
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgumentException(IllegalArgumentException ex) {
        LOGGER.error("Erro de argumento inválido: {}", ex.getMessage(), ex);
        ErrorResponse errorResponse = new ErrorResponse("Dados inválidos: " + ex.getMessage(), "INVALID_DATA");
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex) {
        LOGGER.error("Erro interno no servidor: {}", ex.getMessage(), ex);
        ErrorResponse errorResponse = new ErrorResponse("Erro interno no servidor", "INTERNAL_SERVER_ERROR");
        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}