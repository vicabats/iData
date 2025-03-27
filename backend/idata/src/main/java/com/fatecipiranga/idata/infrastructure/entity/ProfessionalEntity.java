package com.fatecipiranga.idata.infrastructure.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Document(collection = "professionals")
public class ProfessionalEntity {
    @Id
    private String professionalId;
    private String name;
    private String cpf;
    private String email;
    private String password;
    private String phone;
    private LocalDate birthdate;
    private LocalDateTime registrationDate;
    private String professionalLicense; // Ex.: "CRM123"
    private FacilityEntity facility;
}