package com.fatecipiranga.idata.infrastructure.repository;

import com.fatecipiranga.idata.infrastructure.entity.ExameEntity;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface ExameRepository extends MongoRepository<ExameEntity, String> {
    List<ExameEntity> findByUserId(String userId);
    Optional<ExameEntity> findByIdAndUserId(String id, String userId);
    List<ExameEntity> findBySharedWithProfessionalId(String professionalId);
}