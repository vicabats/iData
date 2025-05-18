package com.fatecipiranga.idata.api.converter;

import com.fatecipiranga.idata.api.request.AddressDTO;
import com.fatecipiranga.idata.api.request.UsuarioDTO;
import com.fatecipiranga.idata.api.response.EnderecoResponse;
import com.fatecipiranga.idata.api.response.UsuarioResponse;
import com.fatecipiranga.idata.infrastructure.entity.EnderecoEntity;
import com.fatecipiranga.idata.infrastructure.entity.UsuarioEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface UsuarioMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "registrationDate", ignore = true)
    @Mapping(target = "birthdate", source = "birthdate")
    @Mapping(target = "address", source = "address")
    UsuarioEntity toEntity(UsuarioDTO usuarioDTO);

    @Mapping(target = "id", source = "id")
    @Mapping(target = "name", source = "name")
    @Mapping(target = "cpf", source = "cpf")
    @Mapping(target = "birthdate", source = "birthdate")
    @Mapping(target = "password", source = "password")
    @Mapping(target = "email", source = "email")
    @Mapping(target = "password", source = "password")
    @Mapping(target = "phone", source = "phone")
    @Mapping(target = "registrationDate", source = "registrationDate")
    @Mapping(target = "address", source = "address", qualifiedByName = "toEnderecoResponse")
    UsuarioResponse toResponse(UsuarioEntity usuarioEntity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "userId", ignore = true)
    EnderecoEntity toEnderecoEntity(AddressDTO enderecoDTO);

    @Named("toEnderecoResponse")
    @Mapping(target = "id", source = "id")
    @Mapping(target = "street", source = "street")
    @Mapping(target = "number", source = "number")
    @Mapping(target = "complement", source = "complement")
    @Mapping(target = "neighborhood", source = "neighborhood")
    @Mapping(target = "zipCode", source = "zipCode")
    @Mapping(target = "city", source = "city")
    @Mapping(target = "state", source = "state")
    EnderecoResponse toEnderecoResponse(EnderecoEntity enderecoEntity);
}