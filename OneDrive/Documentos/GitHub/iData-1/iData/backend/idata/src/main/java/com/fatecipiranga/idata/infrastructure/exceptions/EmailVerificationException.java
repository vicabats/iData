package com.fatecipiranga.idata.infrastructure.exceptions;

public class EmailVerificationException extends RuntimeException {
    private final String errorCode;

    public EmailVerificationException(String message, String errorCode, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
    }

    public String getErrorCode() {
        return errorCode;
    }
}