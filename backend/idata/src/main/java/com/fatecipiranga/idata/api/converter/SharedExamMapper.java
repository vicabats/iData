package com.fatecipiranga.idata.api.converter;

import com.fatecipiranga.idata.api.response.SharedExamResponse;
import com.fatecipiranga.idata.infrastructure.entity.CompartilhamentoExame;
import com.fatecipiranga.idata.infrastructure.entity.ExameEntity;
import com.fatecipiranga.idata.infrastructure.entity.UsuarioEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface SharedExamMapper {

    @Mapping(target = "id", source = "compartilhamento.id")
    @Mapping(target = "sharingDate", source = "compartilhamento.dataCompartilhamento")
    @Mapping(target = "status", source = "compartilhamento.status")
    @Mapping(target = "exam", source = "exame")
    @Mapping(target = "personal", source = "personal")
    SharedExamResponse toResponse(CompartilhamentoExame compartilhamento, ExameEntity exame, UsuarioEntity personal);

    @Mapping(target = "id", source = "id")
    @Mapping(target = "type", source = "type")
    @Mapping(target = "date", source = "date")
    @Mapping(target = "title", source = "title")
    @Mapping(target = "description", source = "description")
    @Mapping(target = "fileContent", expression = "java(exame.getContent() != null ? java.util.Base64.getEncoder().encodeToString(exame.getContent()) : null)")
    SharedExamResponse.ExamDetails toExamDetails(ExameEntity exame);

    @Mapping(target = "name", source = "name")
    @Mapping(target = "cpf", source = "cpf")
    @Mapping(target = "email", source = "email")
    SharedExamResponse.PersonalDetails toPersonalDetails(UsuarioEntity personal);
}