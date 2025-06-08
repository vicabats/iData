package com.fatecipiranga.idata.infrastructure.repository;

import com.fatecipiranga.idata.infrastructure.entity.CompartilhamentoExame;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CompartilhamentoExameRepository extends MongoRepository<CompartilhamentoExame, String> {
    List<CompartilhamentoExame> findByProfissionalId(String profissionalId);
    List<CompartilhamentoExame> findByExameIdAndProfissionalId(String exameId, String profissionalId);
}