package com.fatecipiranga.infrastructure.exceptions;

public class BusinessException extends RuntimeException{
    @SuppressWarnings("unused")
    private static final long servialVersionUID = 1L;
    public BusinessException(String message){
        super(message);
    }
    public BusinessException(Throwable cause) {
        super(cause);
    }
    public BusinessException(String message, Throwable cause) {
        super(message, cause);
    }
}
