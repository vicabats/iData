package com.fatecipiranga.idata.api.request;

import lombok.Data;

@Data
public class LoginDTO {
    private String cpf;
    private String password;
}