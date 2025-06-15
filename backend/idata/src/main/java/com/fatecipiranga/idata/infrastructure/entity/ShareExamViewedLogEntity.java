package com.fatecipiranga.idata.infrastructure.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "share_exam_viewed_logs")
public class ShareExamViewedLogEntity {
    @Id
    private String id;
    private String sharedExamId;
    private String professionalId;
    private LocalDateTime viewedAt;
}