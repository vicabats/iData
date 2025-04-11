package com.fatecipiranga.idata.api.response;

import lombok.Data;

@Data
public class EnderecoResponse {
    private String id;
    private String street;
    private String number;
    private String complement;
    private String neighborhood;
    private String zipCode;
    private String city;
    private String state;
}