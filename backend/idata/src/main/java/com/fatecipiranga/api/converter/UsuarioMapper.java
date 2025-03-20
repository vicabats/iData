package com.fatecipiranga.api.converter;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.stereotype.Component;

import com.fatecipiranga.api.response.UsuarioResponseDTO;
import com.fatecipiranga.infrastructure.EnderecoEntity;
import com.fatecipiranga.infrastructure.UsuarioEntity;

@Component
@Mapper(componentModel = "spring")
public interface UsuarioMapper {

    @Mapping(target = "id", source = "usuario.userId")
    @Mapping(target = "fullName", source = "usuario.fullName")
    @Mapping(target = "cpf", source = "usuario.cpf")
    @Mapping(target = "endereco", source = "enderecoEntity")
    @Mapping(target = "birthdate", source = "usuario.birthdate")
    UsuarioResponseDTO paraUsuarioResponseDTO(UsuarioEntity usuario, EnderecoEntity enderecoEntity);

}
