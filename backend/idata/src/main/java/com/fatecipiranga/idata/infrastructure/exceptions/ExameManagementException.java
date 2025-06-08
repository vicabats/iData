package com.fatecipiranga.idata.infrastructure.exceptions;

public class ExameManagementException extends RuntimeException {
    private final String errorCode;

    public ExameManagementException(String message, String errorCode) {
        super(message);
        this.errorCode = errorCode;
    }

    public ExameManagementException(String message, String errorCode, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
    }

    public String getErrorCode() {
        return errorCode;
    }
}