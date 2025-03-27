package com.fatecipiranga.idata.api.converter;

import com.fatecipiranga.idata.api.request.AddressDTO;
import com.fatecipiranga.idata.api.request.FacilityDTO;
import com.fatecipiranga.idata.api.request.ProfessionalDTO;
import com.fatecipiranga.idata.api.response.FacilityResponse;
import com.fatecipiranga.idata.api.response.ProfessionalResponse;
import com.fatecipiranga.idata.infrastructure.entity.AddressEntity;
import com.fatecipiranga.idata.infrastructure.entity.FacilityEntity;
import com.fatecipiranga.idata.infrastructure.entity.ProfessionalEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface ProfessionalMapper {

    ProfessionalMapper INSTANCE = Mappers.getMapper(ProfessionalMapper.class);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "registrationDate", ignore = true)
    ProfessionalEntity toEntity(ProfessionalDTO professionalDTO);

    ProfessionalResponse toResponse(ProfessionalEntity professionalEntity);

    @Mapping(target = "id", ignore = true)
    FacilityEntity toFacilityEntity(FacilityDTO facilityDTO);

    FacilityResponse toFacilityResponse(FacilityEntity facilityEntity);

    AddressEntity addressDtoToEntity(AddressDTO addressDTO);
}