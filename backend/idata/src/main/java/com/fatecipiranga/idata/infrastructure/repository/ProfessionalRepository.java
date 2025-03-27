package com.fatecipiranga.idata.infrastructure.repository;

import com.fatecipiranga.idata.infrastructure.entity.ProfessionalEntity;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface ProfessionalRepository extends MongoRepository<ProfessionalEntity, String> {
    Optional<ProfessionalEntity> findByCpf(String cpf);
}