package com.fatecipiranga.api.converter;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.stereotype.Component;

import com.fatecipiranga.api.request.EnderecoRequestDTO;
import com.fatecipiranga.api.request.UsuarioRequestDTO;
import com.fatecipiranga.infrastructure.EnderecoEntity;
import com.fatecipiranga.infrastructure.UsuarioEntity;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class UsuarioConverter {

    public UsuarioEntity paraUsuarioEntity(UsuarioRequestDTO usuarioDTO) {
        return UsuarioEntity.builder()
                .userId(UUID.randomUUID().toString())
                .fullName(usuarioDTO.getFullName())
                .cpf(usuarioDTO.getCpf())
                .email(usuarioDTO.getEmail())
                .registrationDate(LocalDateTime.now())
                .build();

    }

    public EnderecoEntity paraEnderecoEntity(EnderecoRequestDTO enderecoDTO, String userId) {
        return EnderecoEntity.builder()
                .street(enderecoDTO.getStreet())
                .number(enderecoDTO.getNumber())
                .complement(enderecoDTO.getComplement())
                .zipCode(enderecoDTO.getZipCode())
                .city(enderecoDTO.getCity())
                .state(enderecoDTO.getState())
                .userId(userId)
                .build();
    }

}
