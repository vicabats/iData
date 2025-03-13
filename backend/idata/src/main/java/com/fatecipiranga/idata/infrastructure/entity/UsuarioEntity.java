package com.fatecipiranga.idata.infrastructure.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import lombok.*;

@Document(collection = "users_entity")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsuarioEntity {
    @Id
    private String userId;
    private String name;
    private String cpf;
    private String email;
    private String password;
    private String phone;
    private LocalDateTime registrationDate;
}

