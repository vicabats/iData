package com.fatecipiranga.idata.api.converter;

import com.fatecipiranga.idata.api.request.AddressDTO;
import com.fatecipiranga.idata.api.request.ProfessionalDTO;
import com.fatecipiranga.idata.api.response.ProfessionalResponse;
import com.fatecipiranga.idata.infrastructure.entity.AddressEntity;
import com.fatecipiranga.idata.infrastructure.entity.ProfessionalEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProfessionalMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "registrationDate", ignore = true)
    ProfessionalEntity toEntity(ProfessionalDTO professionalDTO);

    @Mapping(target = "id", source = "id")
    @Mapping(target = "name", source = "name")
    @Mapping(target = "email", source = "email")
    @Mapping(target = "cpf", source = "cpf")
    @Mapping(target = "phone", source = "phone")
    @Mapping(target = "password", source = "password")
    @Mapping(target = "birthdate", source = "birthdate")
    @Mapping(target = "professionalLicense", source = "professionalLicense")
    @Mapping(target = "address", source = "address")
    ProfessionalResponse toResponse(ProfessionalEntity professionalEntity);

    @Mapping(target = "id", ignore = true)
    AddressEntity addressDtoToEntity(AddressDTO addressDTO);
}