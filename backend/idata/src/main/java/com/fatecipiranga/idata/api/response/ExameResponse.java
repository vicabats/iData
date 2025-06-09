package com.fatecipiranga.idata.api.response;

import com.fatecipiranga.idata.api.enums.ExamType;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ExameResponse {
    private String id;
    private String file;
    private String fileContent;
    private String userId;
    private ExamType type;
    private String title;
    private String description;
    private LocalDateTime date;
}