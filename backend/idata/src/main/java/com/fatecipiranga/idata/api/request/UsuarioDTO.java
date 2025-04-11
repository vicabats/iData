package com.fatecipiranga.idata.api.request;

import lombok.Data;

@Data
public class UsuarioDTO {
    private String name;
    private String cpf;
    private String email;
    private String password;
    private String phone;
    private String birthdate;
    private AddressDTO address;
}