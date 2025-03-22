package com.fatecipiranga.idata.api.converter;

import java.time.LocalDateTime;
import java.util.UUID;
import org.springframework.stereotype.Component;
import com.fatecipiranga.idata.api.request.EnderecoRequestDTO;
import com.fatecipiranga.idata.api.request.UsuarioRequestDTO;
import com.fatecipiranga.idata.infrastructure.entity.EnderecoEntity;
import com.fatecipiranga.idata.infrastructure.entity.UsuarioEntity;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class UsuarioConverter {

    public UsuarioEntity paraUsuarioEntity(UsuarioRequestDTO usuarioDTO) {
        return UsuarioEntity.builder()
                .userId(UUID.randomUUID().toString())
                .fullName(usuarioDTO.getName())
                .cpf(usuarioDTO.getCpf())
                .email(usuarioDTO.getEmail())
                .password(usuarioDTO.getPassword())
                .telephone(usuarioDTO.getPhone())
                .birthDate(usuarioDTO.getBirthDate())
                .registrationDate(LocalDateTime.now())
                .build();

    }

    public EnderecoEntity paraEnderecoEntity(EnderecoRequestDTO enderecoDTO, String userId) {
        return EnderecoEntity.builder()
                .street(enderecoDTO.getStreet())
                .number(enderecoDTO.getNumber())
                .complement(enderecoDTO.getComplement())
                .cep(enderecoDTO.getCep())
                .city(enderecoDTO.getCity())
                .state(enderecoDTO.getState())
                .country(enderecoDTO.getCountry())
                .userId(userId)
                .build();
    }

}
