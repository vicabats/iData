package com.fatecipiranga.idata.api.request;

import lombok.Data;

@Data
public class EnderecoDTO {
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