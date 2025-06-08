package com.fatecipiranga.idata.api.response;

import com.fatecipiranga.idata.api.enums.ExamType;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class SharedExamResponse {
    private String id;
    private LocalDateTime sharingDate;
    private ExamResponse exam;
    private PersonalResponse personal;

    @Data
    public static class ExamResponse {
        private String id;
        private ExamType type;
        private LocalDateTime date;
        private String title;
        private String description;
        private String fileContent;
    }

    @Data
    public static class PersonalResponse {
        private String name;
        private String cpf;
        private String email;
    }
}