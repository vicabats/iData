package com.fatecipiranga.idata.api.response;

import com.fatecipiranga.idata.api.enums.ExamType;
import com.fatecipiranga.idata.api.enums.SharedExamStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class SharedExamResponse {
    private String id;
    private LocalDateTime sharingDate;
    private SharedExamStatus status;
    private ExamDetails exam;
    private PersonalDetails personal;

    @Data
    public static class ExamDetails {
        private String id;
        private ExamType type;
        private LocalDateTime date;
        private String title;
        private String description;
        private String fileContent;
    }

    @Data
    public static class PersonalDetails {
        private String name;
        private String cpf;
        private String email;
    }
}