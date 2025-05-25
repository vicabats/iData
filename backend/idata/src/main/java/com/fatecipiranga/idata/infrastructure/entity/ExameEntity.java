package com.fatecipiranga.idata.infrastructure.entity;

import com.fatecipiranga.idata.api.enums.ExamType;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "exams")
public class ExameEntity {
    @Id
    private String id;
    private String userId;
    private ExamType type;
    private String title;
    private String description;
    private LocalDateTime date;
    private String fileName;
    private String mimeType;
    private byte[] content;
    private LocalDateTime uploadDate;
    private String sharedWithProfessionalId;
    private boolean consentGiven;
}