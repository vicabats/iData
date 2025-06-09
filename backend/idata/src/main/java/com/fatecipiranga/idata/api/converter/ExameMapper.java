package com.fatecipiranga.idata.api.converter;

import com.fatecipiranga.idata.api.request.ExameDTO;
import com.fatecipiranga.idata.api.response.ExameResponse;
import com.fatecipiranga.idata.infrastructure.entity.ExameEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.AfterMapping;
import org.mapstruct.MappingTarget;

import java.util.Base64;

@Mapper(componentModel = "spring")
public interface ExameMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "content", ignore = true)
    @Mapping(target = "uploadDate", ignore = true)
    @Mapping(target = "sharedWithProfessionalId", ignore = true)
    @Mapping(target = "consentGiven", ignore = true)
    @Mapping(target = "fileName", source = "file")
    @Mapping(target = "userId", source = "userId")
    @Mapping(target = "type", source = "type")
    @Mapping(target = "title", source = "title")
    @Mapping(target = "description", source = "description")
    @Mapping(target = "date", source = "date")
    @Mapping(target = "mimeType", ignore = true)
    ExameEntity toEntity(ExameDTO exameDTO);

    @Mapping(target = "id", source = "id")
    @Mapping(target = "file", source = "fileName")
    @Mapping(target = "fileContent", ignore = true)
    @Mapping(target = "userId", source = "userId")
    @Mapping(target = "type", source = "type")
    @Mapping(target = "title", source = "title")
    @Mapping(target = "description", source = "description")
    @Mapping(target = "date", source = "date")
    ExameResponse toResponse(ExameEntity exameEntity);

    @AfterMapping
    default void fillFileContent(ExameEntity entity, @MappingTarget ExameResponse response) {
        if (entity.getContent() != null) {
            response.setFileContent(Base64.getEncoder().encodeToString(entity.getContent()));
        }
    }
}