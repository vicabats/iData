package com.fatecipiranga.idata.api.response;

import lombok.Data;

@Data
public class LoginResponse<T> {
    private T user;
    private String token;
    private String error;

    public LoginResponse(T user, String token) {
        this.user = user;
        this.token = token;
    }

    public LoginResponse(T user, String token, String error) {
        this.user = user;
        this.token = token;
        this.error = error;
    }
}