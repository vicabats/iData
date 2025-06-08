package com.fatecipiranga.idata.api.controller;

import com.fatecipiranga.idata.api.request.ShareExamRequest;
import com.fatecipiranga.idata.api.response.SharedExamResponse;
import com.fatecipiranga.idata.business.SharedExamService;
import com.fatecipiranga.idata.infrastructure.exceptions.ExameManagementException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class SharedExamController {

    private static final Logger LOGGER = LoggerFactory.getLogger(SharedExamController.class);
    private static final String SHARED_EXAMS = "sharedExams";
    private static final String MESSAGE = "message";
    private static final String ERROR_CODE = "errorCode";

    private final SharedExamService sharedExamService;

    public SharedExamController(SharedExamService sharedExamService) {
        this.sharedExamService = sharedExamService;
    }

    @PostMapping("/{userCPF}/exam/{examId}/share")
    public ResponseEntity<Map<String, Object>> shareExam(@PathVariable String userCPF,
        @PathVariable String examId,
        @RequestBody ShareExamRequest request) {
        try {
            sharedExamService.shareExam(userCPF, examId, request);
            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put(MESSAGE, "Exame compartilhado com sucesso.");
            return ResponseEntity.ok(responseBody);
        } catch (ExameManagementException e) {
            LOGGER.error("Erro ao compartilhar exame ID: {} para usuário CPF: {}. Detalhes: {}", 
                    examId, userCPF, e.getMessage(), e);
            Map<String, Object> errorBody = new HashMap<>();
            errorBody.put(MESSAGE, e.getMessage());
            errorBody.put(ERROR_CODE, e.getErrorCode());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorBody);
        }
    }

    @GetMapping("/{userId}/shared-exams")
    public ResponseEntity<Map<String, Object>> getSharedExams(@PathVariable String userId) {
        try {
            List<SharedExamResponse> sharedExams = sharedExamService.getSharedExams(userId);
            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put(SHARED_EXAMS, sharedExams);
            return ResponseEntity.ok(responseBody);
        } catch (ExameManagementException e) {
            LOGGER.error("Erro ao buscar exames compartilhados para profissional ID: {}. Detalhes: {}", 
                    userId, e.getMessage(), e);
            Map<String, Object> errorBody = new HashMap<>();
            errorBody.put(MESSAGE, "Erro ao buscar exames compartilhados: " + e.getMessage());
            errorBody.put(ERROR_CODE, e.getErrorCode());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorBody);
        }
    }

    @GetMapping("/{userId}/shared-exams/{examId}")
    public ResponseEntity<Map<String, Object>> getSharedExamById(@PathVariable String userId, 
                                                                @PathVariable String examId) {
        try {
            SharedExamResponse sharedExam = sharedExamService.getSharedExamById(userId, examId);
            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put(SHARED_EXAMS, sharedExam);
            return ResponseEntity.ok(responseBody);
        } catch (ExameManagementException e) {
            LOGGER.error("Erro ao buscar exame compartilhado ID: {} para profissional ID: {}. Detalhes: {}", 
                    examId, userId, e.getMessage(), e);
            Map<String, Object> errorBody = new HashMap<>();
            errorBody.put(MESSAGE, "Erro ao buscar exame compartilhado: " + e.getMessage());
            errorBody.put(ERROR_CODE, e.getErrorCode());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorBody);
        }
    }
}