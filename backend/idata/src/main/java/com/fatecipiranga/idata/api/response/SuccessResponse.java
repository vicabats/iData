package com.fatecipiranga.idata.api.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class SuccessResponse<T> implements ApiResponse {
    private String message;
    private T data;
    private LocalDateTime timestamp;

    public SuccessResponse(String message, T data) {
        this.message = message;
        this.data = data;
        this.timestamp = LocalDateTime.now();
    }

    public SuccessResponse(String message) {
        this.message = message;
        this.timestamp = LocalDateTime.now();
    }
}