package com.fatecipiranga.idata.infrastructure.entity;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Document(collection = "addresses_entity")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class EnderecoEntity {
    @Id
    private String id;
    private String userId;
    private String street;
    private String number;
    private String complement;
    private String neighborhood;
    private String zipCode;
    private String city;
    private String state;
}