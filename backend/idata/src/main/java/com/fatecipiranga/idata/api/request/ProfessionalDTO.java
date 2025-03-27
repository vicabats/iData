package com.fatecipiranga.idata.api.request;

import lombok.Data;

import java.time.LocalDate;

@Data
public class ProfessionalDTO {
    private String name;
    private String cpf;
    private String email;
    private String password;
    private String phone;
    private LocalDate birthdate;
    private String professionalLicense;
    private FacilityDTO facility;
}