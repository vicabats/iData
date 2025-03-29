package com.fatecipiranga.idata.api.request;

import lombok.Data;

@Data
public class VerificationRequestDTO {
    private String email;
    private ProfessionalDTO professionalDTO;
}