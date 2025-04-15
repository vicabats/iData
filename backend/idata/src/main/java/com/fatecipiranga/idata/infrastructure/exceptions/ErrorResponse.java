package com.fatecipiranga.idata.infrastructure.exceptions;

import com.fatecipiranga.idata.api.response.ApiResponse;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ErrorResponse implements ApiResponse {
    private String message;
    private String errorCode;
    private LocalDateTime timestamp;

    public ErrorResponse(String message, String errorCode) {
        this.message = message;
        this.errorCode = errorCode;
        this.timestamp = LocalDateTime.now();
    }
}