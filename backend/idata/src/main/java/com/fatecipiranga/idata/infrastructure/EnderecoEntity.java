package com.fatecipiranga.idata.infrastructure;

import org.springframework.data.mongodb.core.mapping.Document;

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
    private String id;
    private String userId;
    private String street;
    private String number;
    private String complement;
    private String neighborhood;
    private String cep;
    private String city;
    private String state;
    private String country;
}