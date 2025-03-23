package com.fatecipiranga.idata.api.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UsuarioResponse {
    private String userId;
    private String name;
    private String cpf;
    private String email;
    private String phone;
    private LocalDateTime registrationDate;
    private EnderecoResponse address;
}