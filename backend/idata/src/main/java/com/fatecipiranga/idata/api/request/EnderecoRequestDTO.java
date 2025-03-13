package com.fatecipiranga.idata.api.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode
public class EnderecoRequestDTO {

    private String street;
    private String number;
    private String complement;
    private String neighborhood;
    private String cep;
    private String city;
    private String state;
    private String country;
}
