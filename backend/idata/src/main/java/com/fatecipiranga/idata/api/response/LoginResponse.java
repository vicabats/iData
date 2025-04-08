package com.fatecipiranga.idata.api.response;

import lombok.Data;

@Data
public class LoginResponse<T> {
    private final T userData;
    private final String token;
    private final String errorMessage;

    public LoginResponse(T userData, String token) {
        this(userData, token, null);
    }

    public LoginResponse(T userData, String token, String errorMessage) {
        this.userData = userData;
        this.token = token;
        this.errorMessage = errorMessage;
    }

    public T getUserData() {
        return userData;
    }

    public String getToken() {
        return token;
    }

    public String getErrorMessage() {
        return errorMessage;
    }
}