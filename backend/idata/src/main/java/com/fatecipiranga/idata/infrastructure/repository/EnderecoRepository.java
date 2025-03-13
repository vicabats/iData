package com.fatecipiranga.idata.infrastructure.repository;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.transaction.annotation.Transactional;

import com.fatecipiranga.idata.infrastructure.EnderecoEntity;

public interface EnderecoRepository extends MongoRepository<EnderecoEntity, String>{
    EnderecoEntity findByUserId(String userId);

    @Transactional
    void deleteByUserId(String userId);
}
