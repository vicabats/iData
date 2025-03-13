package com.fatecipiranga.idata.infrastructure.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.transaction.annotation.Transactional;

import com.fatecipiranga.idata.infrastructure.UsuarioEntity;


public interface UsuarioRepository extends MongoRepository<UsuarioEntity, String>{
    UsuarioEntity findByEmail(String email);

    @Transactional
    void deleteByEmail(String email);
    }

    
