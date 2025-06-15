package com.fatecipiranga.idata.infrastructure.repository;

import com.fatecipiranga.idata.infrastructure.entity.ShareExamViewedLogEntity;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ShareExamViewedLogRepository extends MongoRepository<ShareExamViewedLogEntity, String> {
}