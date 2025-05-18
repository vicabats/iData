package com.fatecipiranga.idata.api.response;

import java.time.LocalDateTime;

import lombok.Data;
@Data
public class UsuarioResponse implements ApiResponse {
    private String id;
    private String name;
    private String cpf;
    private String birthdate;
    private String phone;
    private String email;
    private String password;
    private LocalDateTime registrationDate;
    private EnderecoResponse address;
}