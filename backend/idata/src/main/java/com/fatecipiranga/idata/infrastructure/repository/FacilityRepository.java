package com.fatecipiranga.idata.infrastructure.repository;

import com.fatecipiranga.idata.infrastructure.entity.FacilityEntity;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface FacilityRepository extends MongoRepository<FacilityEntity, String> {
}