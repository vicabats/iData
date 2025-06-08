package com.fatecipiranga.idata.infrastructure.entity;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
@Data
@Document(collection = "exams")
public class ExamEntity {
    @Id
    private String id;
    private String examId;
    private String professionalId;
    private String personalId;
    private LocalDateTime sharingDate;
    public ExamStatus getStatus() {
        return sharingDate.plusHours(24).isAfter(LocalDateTime.now()) ?
               ExamStatus.VISIBLE : ExamStatus.EXPIRED;
    }
}