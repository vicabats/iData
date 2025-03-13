package com.fatecipiranga.api.converter;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.fatecipiranga.idata.api.response.UsuarioResponseDTO;
import com.fatecipiranga.idata.infrastructure.EnderecoEntity;
import com.fatecipiranga.idata.infrastructure.UsuarioEntity;

@Mapper(componentModel = "spring")
public interface UsuarioMapper {

    @Mapping(target = "id", source = "user.id")
    @Mapping(target = "name", source = "usuario.name")
    @Mapping(target = "cpf", source = "usuario.cpf")
    @Mapping(target = "endereco", source = "enderecoEntity")
    UsuarioResponseDTO paraUsuarioResponseDTO(UsuarioEntity usuario, EnderecoEntity enderecoEntity);

}
