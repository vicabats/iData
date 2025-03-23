package com.fatecipiranga.idata.infrastructure.exceptions;

public class UserManagementException extends RuntimeException {
    private final String errorCode;

    public UserManagementException(String message, String errorCode) {
        super(message);
        this.errorCode = errorCode;
    }

    public String getErrorCode() {
        return errorCode;
    }
}