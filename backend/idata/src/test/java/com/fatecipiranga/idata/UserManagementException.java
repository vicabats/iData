package com.fatecipiranga.idata;


public class UserManagementException extends RuntimeException {
    private final String errorCode;

    public UserManagementException(String message, String errorCode) {
        super(message);
        this.errorCode = errorCode;
    }

    public UserManagementException(String message, String errorCode, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
    }

    public String getErrorCode() {
        return errorCode;
    }
}
