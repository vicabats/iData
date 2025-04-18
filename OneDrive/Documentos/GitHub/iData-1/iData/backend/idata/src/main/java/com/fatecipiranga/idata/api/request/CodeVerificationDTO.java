package com.fatecipiranga.idata.api.request;

import lombok.Data;

@Data
public class CodeVerificationDTO {
    private String cpf;
    private String code;
}