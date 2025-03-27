package com.fatecipiranga.idata.api.request;

import lombok.Data;

@Data
public class AddressDTO {
    private String formattedAddress;
    private String city;
    private String state;
}