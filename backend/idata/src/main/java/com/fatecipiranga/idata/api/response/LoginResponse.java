package com.fatecipiranga.idata.api.response;

public class LoginResponse<T> {
    private final T userData;
    private final String token;

    public LoginResponse(T userData, String token) {
        this.userData = userData;
        this.token = token;
    }

    public T getUserData() {
        return userData;
    }

    public String getToken() {
        return token;
    }
}