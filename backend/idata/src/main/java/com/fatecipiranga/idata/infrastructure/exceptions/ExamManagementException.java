package com.fatecipiranga.idata.infrastructure.exceptions;

public class ExamManagementException extends RuntimeException {
    private final String errorCode;

    public ExamManagementException(String message, String errorCode) {
        super(message);
        this.errorCode = errorCode;
    }

    public ExamManagementException(String message, String errorCode, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
    }

    public String getErrorCode() {
        return errorCode;
    }
}
