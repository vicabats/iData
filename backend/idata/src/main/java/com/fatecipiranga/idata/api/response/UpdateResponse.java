package com.fatecipiranga.idata.api.response;

import lombok.Data;

@Data
public class UpdateResponse<T> implements ApiResponse {
    private String message;
    private T data;

    public UpdateResponse(String message, T data) {
        this.message = message;
        this.data = data;
    }
}