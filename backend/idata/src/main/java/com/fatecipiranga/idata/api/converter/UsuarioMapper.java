package com.fatecipiranga.idata.api.converter;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.stereotype.Component;

import com.fatecipiranga.idata.api.response.UsuarioResponseDTO;
import com.fatecipiranga.idata.infrastructure.entity.EnderecoEntity;
import com.fatecipiranga.idata.infrastructure.entity.UsuarioEntity;

@Component
@Mapper(componentModel = "spring")
public interface UsuarioMapper {

    @Mapping(target = "id", source = "usuario.id")
    @Mapping(target = "name", source = "usuario.name")
    @Mapping(target = "cpf", source = "usuario.cpf")
    @Mapping(target = "endereco", source = "enderecoEntity")
    UsuarioResponseDTO paraUsuarioResponseDTO(UsuarioEntity usuario, EnderecoEntity enderecoEntity);

}
