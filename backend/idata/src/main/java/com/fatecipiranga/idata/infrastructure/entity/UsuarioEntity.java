package com.fatecipiranga.idata.infrastructure.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Builder;
import java.time.LocalDateTime;
@Data
@Builder
@Document(collection = "users")
public class UsuarioEntity {
    @Id
    private String userId;
    private String name;
    private String cpf;
    private String email;
    private String password;
    private String phone;
    private LocalDateTime registrationDate;
    private EnderecoEntity address;
}