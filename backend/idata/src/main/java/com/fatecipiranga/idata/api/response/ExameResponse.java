package com.fatecipiranga.idata.api.response;

import com.fatecipiranga.idata.api.enums.ExamType;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ExameResponse {
    private String id;
    private ExamType type;
    private String title;
    private String description;
    private LocalDateTime date;
    private String file;
    private String fileContent;
}