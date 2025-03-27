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
    @Mapping(target = "professionalId", ignore = true)
    @Mapping(target = "registrationDate", ignore = true)
    ProfessionalEntity toEntity(ProfessionalDTO professionalDTO);

    ProfessionalResponse toResponse(ProfessionalEntity professionalEntity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "userId", ignore = true)
    @Mapping(target = "street", ignore = true)
    @Mapping(target = "number", ignore = true)
    @Mapping(target = "complement", ignore = true)
    @Mapping(target = "neighborhood", ignore = true)
    @Mapping(target = "zipCode", ignore = true)
    AddressEntity addressDtoToEntity(AddressDTO addressDTO);
}