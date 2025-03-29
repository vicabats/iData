package com.fatecipiranga.idata.api.request;

import lombok.Data;

@Data
public class CodeVerificationDTO {
    private String email;
    private String code;
}