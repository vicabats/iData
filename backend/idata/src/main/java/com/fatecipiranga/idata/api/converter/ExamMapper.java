package com.fatecipiranga.idata.api.converter;

import com.fatecipiranga.idata.api.response.SharedExamResponse;
import com.fatecipiranga.idata.infrastructure.entity.ExamEntity;
import com.fatecipiranga.idata.infrastructure.entity.UsuarioEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ExamMapper {
    
    @Mapping(target = "id", source = "sharedExam.id")
    @Mapping(target = "sharingDate", source = "sharedExam.sharingDate")
    @Mapping(target = "exam.id", source = "exam.examId")
    @Mapping(target = "personal.name", source = "personal.name")
    @Mapping(target = "personal.cpf", source = "personal.cpf")
    @Mapping(target = "personal.email", source = "personal.email")
    SharedExamResponse toResponse(ExamEntity sharedExam, ExamEntity exam, UsuarioEntity personal);
}