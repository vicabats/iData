package com.fatecipiranga.idata.infrastructure.entity;

import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "facilities")
public class FacilityEntity {
    private String id;
    private String name;
    private AddressEntity address;
}