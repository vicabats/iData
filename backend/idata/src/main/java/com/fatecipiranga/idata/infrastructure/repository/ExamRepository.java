package com.fatecipiranga.idata.infrastructure.repository;

import com.fatecipiranga.idata.infrastructure.entity.ExamEntity;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface ExamRepository extends MongoRepository<ExamEntity, String> {
    Optional<ExamEntity> findByIdAndPersonalId(String id, String personalId);
    List<ExamEntity> findByProfessionalIdAndStatus(String professionalId, String status);
    ExamEntity findByExamIdAndProfessionalId(String examId, String professionalId);
}