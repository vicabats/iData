package com.fatecipiranga.idata.api.converter;

import com.fatecipiranga.idata.api.request.EnderecoDTO;
import com.fatecipiranga.idata.api.request.UsuarioDTO;
import com.fatecipiranga.idata.api.response.EnderecoResponse;
import com.fatecipiranga.idata.api.response.UsuarioResponse;
import com.fatecipiranga.idata.infrastructure.entity.EnderecoEntity;
import com.fatecipiranga.idata.infrastructure.entity.UsuarioEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface UsuarioMapper {

    UsuarioMapper INSTANCE = Mappers.getMapper(UsuarioMapper.class);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "registrationDate", ignore = true)
    @Mapping(target = "birthdate", source = "birthdate")
    @Mapping(target = "address", source = "address")
    UsuarioEntity toEntity(UsuarioDTO usuarioDTO);

    @Mapping(target = "address", source = "address")
    UsuarioResponse toResponse(UsuarioEntity usuarioEntity);

    EnderecoEntity toEnderecoEntity(EnderecoDTO enderecoDTO);

    EnderecoResponse toEnderecoResponse(EnderecoEntity enderecoEntity);
}