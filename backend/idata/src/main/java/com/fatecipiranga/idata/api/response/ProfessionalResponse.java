package com.fatecipiranga.idata.api.response;

import lombok.Data;

@Data
public class ProfessionalResponse implements ApiResponse{
    private String id;
    private String name;
    private String email;
    private String cpf;
    private String phone;
    private String birthdate;
    private String professionalLicense;
    private EnderecoResponse address;
    private String type;
}