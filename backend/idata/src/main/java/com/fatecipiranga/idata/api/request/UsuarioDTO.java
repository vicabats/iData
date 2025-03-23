package com.fatecipiranga.idata.api.request;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UsuarioDTO {
    private String userId;
    private String name;
    private String cpf;
    private String email;
    private String password;
    private String phone;
    private LocalDateTime registrationDate;
    private EnderecoDTO address;
}