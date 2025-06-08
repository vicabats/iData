package com.fatecipiranga.idata.api.controller;

import com.fatecipiranga.idata.api.response.ApiResponse;
import com.fatecipiranga.idata.api.response.SharedExamResponse;
import com.fatecipiranga.idata.api.response.SuccessResponse;
import com.fatecipiranga.idata.business.ExamService;
import com.fatecipiranga.idata.infrastructure.exceptions.ErrorResponse;
import com.fatecipiranga.idata.infrastructure.exceptions.ExamManagementException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class ExamController {
    private static final Logger LOGGER = LoggerFactory.getLogger(ExamController.class);

    private final ExamService examService;

    public ExamController(ExamService examService) {
        this.examService = examService;
    }

    @PostMapping("/{userCPF}/exam/{examId}/share")
    public ResponseEntity<ApiResponse> shareExam(@PathVariable String userCPF, 
        @PathVariable String examId,
        @RequestBody Map<String, String> requestBody) {
        try {
            String professionalEmail = requestBody.get("professionalEmail");
            if (professionalEmail == null || professionalEmail.trim().isEmpty()) {
                throw new ExamManagementException("Email do profissional é obrigatório", "INVALID_EMAIL");
            }
            
            examService.shareExam(userCPF, examId, professionalEmail);
            SuccessResponse<String> response = new SuccessResponse<>("Exame compartilhado com sucesso.");
            return ResponseEntity.ok(response);
        } catch (ExamManagementException e) {
            LOGGER.error("Erro ao compartilhar exame ID: {} para usuário CPF: {}. Detalhes: {}", 
                    examId, userCPF, e.getMessage(), e);
            ErrorResponse error = new ErrorResponse(e.getMessage(), e.getErrorCode());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @GetMapping("/{userId}/shared-exams")
    public ResponseEntity<ApiResponse> getVisibleSharedExams(@PathVariable String userId) {
        try {
            List<SharedExamResponse> sharedExams = examService.getVisibleSharedExams(userId);
            SuccessResponse<List<SharedExamResponse>> response = 
                    new SuccessResponse<>("Exames compartilhados recuperados com sucesso", sharedExams);
            return ResponseEntity.ok(response);
        } catch (ExamManagementException e) {
            LOGGER.error("Erro ao buscar exames compartilhados para usuário ID: {}. Detalhes: {}", 
                    userId, e.getMessage(), e);
            ErrorResponse error = new ErrorResponse(e.getMessage(), e.getErrorCode());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @GetMapping("/{userId}/shared-exams/{examId}")
    public ResponseEntity<ApiResponse> getSharedExamDetails(@PathVariable String userId, @PathVariable String examId) {
        try {
            SharedExamResponse sharedExam = examService.getSharedExamDetails(userId, examId);
            SuccessResponse<SharedExamResponse> response = 
                    new SuccessResponse<>("Detalhes do exame compartilhado recuperados com sucesso", sharedExam);
            return ResponseEntity.ok(response);
        } catch (ExamManagementException e) {
            LOGGER.error("Erro ao buscar detalhes do exame compartilhado ID: {} para usuário ID: {}. Detalhes: {}", 
                    examId, userId, e.getMessage(), e);
            ErrorResponse error = new ErrorResponse(e.getMessage(), e.getErrorCode());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
}