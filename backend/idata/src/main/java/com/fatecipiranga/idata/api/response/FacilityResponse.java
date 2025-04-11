package com.fatecipiranga.idata.api.response;

import lombok.Data;

@Data
public class FacilityResponse {
    private String id;
    private String street;
    private String number;
    private String complement;
    private String zipCode;
    private String neighborhood;
    private String city;
    private String state;
}