package com.fatecipiranga.idata.api.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.springframework.stereotype.Component;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@EqualsAndHashCode
@Component
public class UsuarioRequestDTO {

    private String name;

    @JsonProperty(required = true)
    private String email;

    private String cpf;

    private EnderecoRequestDTO endereco;

    public String getPassword() {
        throw new UnsupportedOperationException("Unimplemented method 'getPassword'");
    }

    public String getPhone() {
        throw new UnsupportedOperationException("Unimplemented method 'getPhone'");
    }
}
