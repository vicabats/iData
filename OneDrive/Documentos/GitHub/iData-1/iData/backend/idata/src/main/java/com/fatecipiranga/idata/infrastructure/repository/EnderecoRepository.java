package com.fatecipiranga.idata.infrastructure.repository;

import com.fatecipiranga.idata.infrastructure.entity.EnderecoEntity;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface EnderecoRepository extends MongoRepository<EnderecoEntity, String> {
    Optional<EnderecoEntity> findByUserId(String userId);
}