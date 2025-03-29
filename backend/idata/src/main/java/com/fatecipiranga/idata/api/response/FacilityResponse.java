package com.fatecipiranga.idata.api.response;

import lombok.Data;

@Data
public class FacilityResponse {
    private String id;
    private String name;
    private EnderecoResponse address;
}