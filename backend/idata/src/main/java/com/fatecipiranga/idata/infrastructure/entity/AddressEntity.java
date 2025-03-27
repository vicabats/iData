package com.fatecipiranga.idata.infrastructure.entity;

import lombok.Data;

@Data
public class AddressEntity {
    private String formattedAddress;
    private String city;
    private String state;
    private String complement;
    private String neighborhood;
    private String number;
    private String street;
    private String zipCode;
}