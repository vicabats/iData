package com.fatecipiranga.idata.infrastructure.entity;

import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "addresses")
public class AddressEntity {
    private String id;
    private String userId;
    private String formattedAddress;
    private String street;
    private String number;
    private String complement;
    private String neighborhood;
    private String zipCode;
    private String city;
    private String state;
}