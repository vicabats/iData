package com.fatecipiranga.idata.api.converter;

import com.fatecipiranga.idata.api.request.AddressDTO;
import com.fatecipiranga.idata.api.request.FacilityDTO;
import com.fatecipiranga.idata.api.request.ProfessionalDTO;
import com.fatecipiranga.idata.api.response.EnderecoResponse;
import com.fatecipiranga.idata.api.response.ProfessionalResponse;
import com.fatecipiranga.idata.infrastructure.entity.AddressEntity;
import com.fatecipiranga.idata.infrastructure.entity.FacilityEntity; // Adicionado
import com.fatecipiranga.idata.infrastructure.entity.ProfessionalEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProfessionalMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "registrationDate", ignore = true)
    ProfessionalEntity toEntity(ProfessionalDTO professionalDTO);

    @Mapping(target = "id", ignore = true)
    FacilityEntity facilityDtoToEntity(FacilityDTO facilityDTO);

    ProfessionalResponse toResponse(ProfessionalEntity professionalEntity);

    AddressEntity addressDtoToEntity(AddressDTO addressDTO);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "userId", ignore = true)
    EnderecoResponse toResponse(AddressEntity addressEntity);
}