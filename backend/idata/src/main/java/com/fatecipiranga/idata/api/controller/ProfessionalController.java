package com.fatecipiranga.idata.api.controller;

import com.fatecipiranga.idata.api.request.CodeVerificationDTO;
import com.fatecipiranga.idata.api.request.CpfDTO;
import com.fatecipiranga.idata.api.request.LoginDTO;
import com.fatecipiranga.idata.api.request.ProfessionalDTO;
import com.fatecipiranga.idata.api.response.ApiResponse;
import com.fatecipiranga.idata.api.response.ProfessionalResponse;
import com.fatecipiranga.idata.api.response.SuccessResponse;
import com.fatecipiranga.idata.api.response.UpdateResponse;
import com.fatecipiranga.idata.business.EmailVerificationService;
import com.fatecipiranga.idata.business.ProfessionalService;
import com.fatecipiranga.idata.infrastructure.exceptions.ErrorResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class ProfessionalController {

    private static final Logger LOGGER = LoggerFactory.getLogger(ProfessionalController.class);
    private final ProfessionalService professionalService;
    private final EmailVerificationService emailVerificationService;

    public ProfessionalController(ProfessionalService professionalService, EmailVerificationService emailVerificationService) {
        this.professionalService = professionalService;
        this.emailVerificationService = emailVerificationService;
    }

    @PostMapping(value = "/register", params = "type=professional")
    public ResponseEntity<ApiResponse> createProfessional(@RequestBody ProfessionalDTO professionalDTO) {
        try {
            ProfessionalResponse response = professionalService.createProfessional(professionalDTO);
            SuccessResponse<String> success = new SuccessResponse<>("Profissional registrado com sucesso", response.getCpf());
            return ResponseEntity.ok(success);
        } catch (RuntimeException e) {
            LOGGER.error("Erro ao registrar profissional para: {}. Detalhes: {}", professionalDTO.getEmail(), e.getMessage(), e);
            ErrorResponse error = new ErrorResponse("Erro ao registrar profissional: " + e.getMessage(), "REGISTRATION_FAILED");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

@GetMapping(params = "type=professional")
public ResponseEntity<ApiResponse> getProfessional(@RequestParam("cpf") String cpf) {
    System.err.println(cpf);
    try {
        ProfessionalResponse professional = professionalService.getProfessionalByCpf(cpf)
                .orElseThrow(() -> new RuntimeException("Profissional não encontrado"));
        return new ResponseEntity<>(professional, HttpStatus.OK);
    } catch (RuntimeException e) {
        LOGGER.error("Erro ao buscar profissional com CPF: {}. Detalhes: {}", cpf, e.getMessage(), e);
        ErrorResponse error = new ErrorResponse("Profissional não encontrado", "NOT_FOUND");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }
}


    @PutMapping(params = "type=professional")
    public ResponseEntity<ApiResponse> updateProfessional(@RequestBody ProfessionalDTO professionalDTO) {
        try {
            ProfessionalResponse updatedProfessional = professionalService.updateProfessional(professionalDTO.getCpf(), professionalDTO);
            UpdateResponse<ProfessionalResponse> response = new UpdateResponse<>("Registro atualizado com sucesso", updatedProfessional);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (RuntimeException e) {
            LOGGER.error("Erro ao atualizar profissional com CPF: {}. Detalhes: {}", professionalDTO.getCpf(), e.getMessage(), e);
            ErrorResponse error = new ErrorResponse("Erro ao atualizar profissional: " + e.getMessage(), "UPDATE_FAILED");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @DeleteMapping(params = "type=professional")
    public ResponseEntity<ApiResponse> initiateDeleteProfessional(@RequestBody LoginDTO loginDTO) {
        try {
            professionalService.verifyCredentials(loginDTO.getCpf(), loginDTO.getPassword());
            String email = professionalService.getEmailByCpf(loginDTO.getCpf());
            emailVerificationService.sendVerificationCode(email, null);
            SuccessResponse<String> success = new SuccessResponse<>("Código de verificação enviado para " + email + ". Confirme para excluir sua conta.", email);
            return ResponseEntity.ok(success);
        } catch (RuntimeException e) {
            LOGGER.error("Erro ao iniciar exclusão para CPF: {}. Detalhes: {}", loginDTO.getCpf(), e.getMessage(), e);
            ErrorResponse error = new ErrorResponse("Erro ao iniciar exclusão: " + e.getMessage(), "DELETE_INIT_FAILED");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @PostMapping(value = "/confirm-delete", params = "type=professional")
    public ResponseEntity<ApiResponse> confirmDeleteProfessional(@RequestBody CodeVerificationDTO request) {
        try {
            String email = professionalService.getEmailByCpf(request.getCpf());
            boolean isValid = emailVerificationService.verifyCode(email, request.getCode());
            if (isValid) {
                professionalService.deleteProfessional(email);
                SuccessResponse<String> success = new SuccessResponse<>("Conta excluída com sucesso.", email);
                return ResponseEntity.ok(success);
            }
            ErrorResponse error = new ErrorResponse("Código de verificação inválido ou expirado", "INVALID_CODE");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        } catch (RuntimeException e) {
            LOGGER.error("Erro ao confirmar exclusão para CPF: {}. Detalhes: {}", request.getCpf(), e.getMessage(), e);
            ErrorResponse error = new ErrorResponse("Erro ao confirmar exclusão: " + e.getMessage(), "DELETE_CONFIRM_FAILED");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PostMapping(value = "/login", params = "type=professional")
    public ResponseEntity<ApiResponse> login(@RequestBody LoginDTO loginDTO) {
        try {
            ProfessionalResponse professional = professionalService.login(loginDTO);
            emailVerificationService.sendVerificationCode(professional.getEmail(), null);
            SuccessResponse<String> success = new SuccessResponse<>("Código de verificação enviado para " + professional.getEmail(), professional.getEmail());
            return ResponseEntity.ok(success);
        } catch (RuntimeException e) {
            LOGGER.error("Erro ao realizar login para CPF: {}. Detalhes: {}", loginDTO.getCpf(), e.getMessage(), e);
            ErrorResponse error = new ErrorResponse("Erro ao realizar login: " + e.getMessage(), "LOGIN_FAILED");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
    }

    @PostMapping(value = "/verify-2fa", params = "type=professional")
    public ResponseEntity<ApiResponse> verify2FA(@RequestBody CodeVerificationDTO request) {
        try {
            String email = professionalService.getEmailByCpf(request.getCpf());
            boolean isValid = emailVerificationService.verifyCode(email, request.getCode());
            if (isValid) {
                LOGGER.info("Login concluído com sucesso para CPF: {}", request.getCpf());
                ProfessionalResponse professional = professionalService.getProfessionalByCpf(request.getCpf())
                        .orElseThrow(() -> new RuntimeException("Profissional não encontrado após 2FA"));
                SuccessResponse<ProfessionalResponse> success = new SuccessResponse<>("Login realizado com sucesso", professional);
                return ResponseEntity.ok(success);
            } else {
                ErrorResponse error = new ErrorResponse("Código de verificação inválido ou expirado", "INVALID_2FA_CODE");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
            }
        } catch (RuntimeException e) {
            LOGGER.error("Erro ao verificar código 2FA para CPF: {}. Detalhes: {}", request.getCpf(), e.getMessage(), e);
            ErrorResponse error = new ErrorResponse("Erro ao verificar código 2FA: " + e.getMessage(), "2FA_FAILED");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}