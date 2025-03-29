package com.fatecipiranga.idata.api.controller;

import com.fatecipiranga.idata.api.request.CodeVerificationDTO;
import com.fatecipiranga.idata.api.request.LoginDTO;
import com.fatecipiranga.idata.api.request.ProfessionalDTO; // Adicionado
import com.fatecipiranga.idata.api.request.VerificationRequestDTO;
import com.fatecipiranga.idata.api.response.LoginResponse;
import com.fatecipiranga.idata.api.response.ProfessionalResponse;
import com.fatecipiranga.idata.business.EmailVerificationService;
import com.fatecipiranga.idata.business.ProfessionalService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

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

    @PostMapping(value = "/send-code", params = "type=professional")
    public ResponseEntity<String> sendVerificationCode(@RequestBody VerificationRequestDTO request) {
        try {
            emailVerificationService.sendVerificationCode(request.getEmail(), request.getProfessionalDTO());
            return ResponseEntity.ok("Código de verificação enviado com sucesso");
        } catch (RuntimeException e) {
            LOGGER.error("Erro ao enviar código para: {}. Detalhes: {}", request.getEmail(), e.getMessage(), e);
            return ResponseEntity.status(500).body("Erro ao enviar código de verificação: " + e.getMessage());
        }
    }

    @PostMapping(value = "/verify-code", params = "type=professional")
    public ResponseEntity<ProfessionalResponse> verifyCodeAndCreate(@RequestBody CodeVerificationDTO request) {
        try {
            ProfessionalDTO professionalDTO = emailVerificationService.verifyCode(request.getEmail(), request.getCode());
            if (professionalDTO == null) {
                return ResponseEntity.badRequest().body(null);
            }
            ProfessionalResponse response = professionalService.createProfessional(professionalDTO);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (Exception e) {
            LOGGER.error("Erro ao verificar código e criar profissional para: {}. Detalhes: {}", request.getEmail(), e.getMessage(), e);
            return ResponseEntity.status(500).body(null);
        }
    }

    @PostMapping(value = "/login", params = "type=professional")
    public ResponseEntity<LoginResponse<ProfessionalResponse>> login(@RequestBody LoginDTO loginDTO) {
        ProfessionalResponse professional = professionalService.login(loginDTO);
        String token = UUID.randomUUID().toString();
        LoginResponse<ProfessionalResponse> response = new LoginResponse<>(professional, token);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}