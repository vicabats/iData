package com.fatecipiranga.idata.api.response;

import lombok.Data;
import com.fatecipiranga.idata.api.request.FacilityDTO;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class ProfessionalResponse {
    private String professionalId;
    private String name;
    private String cpf;
    private String email;
    private String phone;
    private LocalDate birthdate;
    private LocalDateTime registrationDate;
    private String professionalLicense;
    private FacilityDTO facility;
}