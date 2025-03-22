package com.fatecipiranga.idata.infrastructure.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Repository;
import com.fatecipiranga.idata.infrastructure.entity.UsuarioEntity;

@Repository
public interface UsuarioRepository extends MongoRepository<UsuarioEntity, String>{
    UsuarioEntity findByEmail(String email);

    @Transactional
    void deleteByEmail(String email);
    }

    
