package com.fatecipiranga.idata.api.request;

import com.fatecipiranga.idata.api.enums.ExamType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ExamDTO {
    @NotBlank(message = "userId é obrigatório")
    private String userId;
    @NotNull(message = "type é obrigatório")
    private ExamType type;
    @NotBlank(message = "title é obrigatório")
    private String title;
    private String description;
    @NotNull(message = "date é obrigatório")
    private LocalDateTime date;
    @NotBlank(message = "file é obrigatório")
    private String file;
}