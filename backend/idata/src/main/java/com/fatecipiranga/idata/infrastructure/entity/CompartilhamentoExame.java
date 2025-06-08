package com.fatecipiranga.idata.infrastructure.entity;

import com.fatecipiranga.idata.api.enums.SharedExamStatus;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "shared_exams")
public class CompartilhamentoExame {
    @Id
    private String id;
    private String exameId;
    private String profissionalId;
    private LocalDateTime dataCompartilhamento;

    @Transient
    public SharedExamStatus getStatus() {
        return dataCompartilhamento.plusHours(24).isAfter(LocalDateTime.now())
                ? SharedExamStatus.VISIBLE
                : SharedExamStatus.EXPIRED;
    }
}