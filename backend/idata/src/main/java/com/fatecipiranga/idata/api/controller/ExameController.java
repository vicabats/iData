package com.fatecipiranga.idata.api.controller;

import com.fatecipiranga.idata.api.request.ExameDTO;
import com.fatecipiranga.idata.api.response.ExameResponse;
import com.fatecipiranga.idata.business.ExameService;
import com.fatecipiranga.idata.infrastructure.entity.ExameEntity;
import com.fatecipiranga.idata.infrastructure.exceptions.ExameManagementException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class ExameController {
    private static final Logger LOGGER = LoggerFactory.getLogger(ExameController.class);
    private static final String EXAMS = "exams";
    private static final String MESSAGE = "message";
    private static final String ERROR_CODE = "errorCode";

    private final ExameService exameService;

    public ExameController(ExameService exameService) {
        this.exameService = exameService;
    }

    @PostMapping("/{userCPF}/exam")
    public ResponseEntity<Map<String, Object>> createExame(@PathVariable String userCPF,
                                                          @Valid @RequestPart("data") ExameDTO exameDTO,
                                                          @RequestPart("file") MultipartFile file) {
        try {
            exameDTO.setUserId(userCPF);
            ExameResponse response = exameService.createExame(exameDTO, file);
            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put(EXAMS, response);
            return ResponseEntity.ok(responseBody);
        } catch (ExameManagementException e) {
            LOGGER.error("Erro ao criar exame para usuário CPF: {}. Detalhes: {}", userCPF, e.getMessage(), e);
            Map<String, Object> errorBody = new HashMap<>();
            errorBody.put(MESSAGE, "Erro ao criar exame: " + e.getMessage());
            errorBody.put(ERROR_CODE, e.getErrorCode());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorBody);
        }
    }

    @GetMapping("/{userCPF}/exams")
    public ResponseEntity<Map<String, Object>> getExamesByUserCPF(@PathVariable String userCPF) {
        try {
            List<ExameResponse> exames = exameService.getExamesByUserId(userCPF);
            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put(EXAMS, exames);
            return ResponseEntity.ok(responseBody);
        } catch (ExameManagementException e) {
            LOGGER.error("Erro ao buscar exames para usuário CPF: {}. Detalhes: {}", userCPF, e.getMessage(), e);
            Map<String, Object> errorBody = new HashMap<>();
            errorBody.put(MESSAGE, "Erro ao buscar exames: " + e.getMessage());
            errorBody.put(ERROR_CODE, e.getErrorCode());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorBody);
        }
    }

    @GetMapping("/{userCPF}/exam/{examId}")
    public ResponseEntity<Map<String, Object>> getExameById(@PathVariable String userCPF, @PathVariable String examId) {
        try {
            ExameResponse response = exameService.getExameById(examId, userCPF);
            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put(EXAMS, response);
            return ResponseEntity.ok(responseBody);
        } catch (ExameManagementException e) {
            LOGGER.error("Erro ao buscar exame ID: {} para usuário CPF: {}. Detalhes: {}", examId, userCPF, e.getMessage(), e);
            Map<String, Object> errorBody = new HashMap<>();
            errorBody.put(MESSAGE, "Erro ao buscar exame: " + e.getMessage());
            errorBody.put(ERROR_CODE, e.getErrorCode());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorBody);
        }
    }

    @DeleteMapping("/{userCPF}/exam/{examId}")
    public ResponseEntity<Void> deleteExame(@PathVariable String userCPF, @PathVariable String examId) {
        try {
            exameService.deleteExame(examId, userCPF);
            return ResponseEntity.noContent().build();
        } catch (ExameManagementException e) {
            LOGGER.error("Erro ao deletar exame ID: {} para usuário CPF: {}. Detalhes: {}", examId, userCPF, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PutMapping("/{userCPF}/exam/{examId}")
    public ResponseEntity<Map<String, Object>> updateExame(@PathVariable String userCPF,
                                                          @PathVariable String examId,
                                                          @Valid @RequestBody ExameDTO exameDTO) {
        try {
            exameDTO.setUserId(userCPF);
            ExameResponse response = exameService.updateExame(examId, userCPF, exameDTO);
            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put(EXAMS, response);
            return ResponseEntity.ok(responseBody);
        } catch (ExameManagementException e) {
            LOGGER.error("Erro ao atualizar exame ID: {} para usuário CPF: {}. Detalhes: {}", examId, userCPF, e.getMessage(), e);
            Map<String, Object> errorBody = new HashMap<>();
            errorBody.put(MESSAGE, "Erro ao atualizar exame: " + e.getMessage());
            errorBody.put(ERROR_CODE, e.getErrorCode());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorBody);
        }
    }

    @PostMapping("/share/{examId}")
    public ResponseEntity<Map<String, Object>> shareExame(@PathVariable String examId,
                                                         @RequestParam String userId,
                                                         @RequestParam String professionalId,
                                                         @RequestParam boolean consentGiven) {
        try {
            ExameResponse response = exameService.shareExame(examId, userId, professionalId, consentGiven);
            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put(EXAMS, response);
            return ResponseEntity.ok(responseBody);
        } catch (ExameManagementException e) {
            LOGGER.error("Erro ao compartilhar exame ID: {} do usuário: {} com profissional: {}. Detalhes: {}", 
                    examId, userId, professionalId, e.getMessage(), e);
            Map<String, Object> errorBody = new HashMap<>();
            errorBody.put(MESSAGE, "Erro ao compartilhar exame: " + e.getMessage());
            errorBody.put(ERROR_CODE, e.getErrorCode());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorBody);
        }
    }

    @GetMapping("/professional/{professionalId}")
    public ResponseEntity<Map<String, Object>> getExamesByProfessionalId(@PathVariable String professionalId) {
        try {
            List<ExameResponse> exames = exameService.getExamesByProfessionalId(professionalId);
            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put(EXAMS, exames);
            return ResponseEntity.ok(responseBody);
        } catch (ExameManagementException e) {
            LOGGER.error("Erro ao buscar exames para profissional ID: {}. Detalhes: {}", professionalId, e.getMessage(), e);
            Map<String, Object> errorBody = new HashMap<>();
            errorBody.put(MESSAGE, "Erro ao buscar exames compartilhados: " + e.getMessage());
            errorBody.put(ERROR_CODE, e.getErrorCode());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorBody);
        }
    }

    @GetMapping("/download/{examId}")
    public ResponseEntity<Resource> downloadExame(@PathVariable String examId,
                                                 @RequestParam(value = "userId", required = false) String userId,
                                                 @RequestParam(value = "professionalId", required = false) String professionalId) {
        try {
            ExameEntity exame = exameService.downloadExame(examId, userId, professionalId);
            ByteArrayResource resource = new ByteArrayResource(exame.getContent());
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(exame.getMimeType()))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + exame.getFileName() + "\"")
                    .body(resource);
        } catch (ExameManagementException e) {
            LOGGER.error("Erro ao baixar exame ID: {} para usuário: {} ou profissional: {}. Detalhes: {}", 
                    examId, userId, professionalId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                    .body(new ByteArrayResource(("{\"message\": \"Erro ao baixar exame: " + e.getMessage() + "\", \"errorCode\": \"" + e.getErrorCode() + "\"}").getBytes()));
        }
    }
}