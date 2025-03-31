package com.fatecipiranga.idata.api.controller;

import com.fatecipiranga.idata.api.request.VerificationRequestDTO;
import com.fatecipiranga.idata.business.EmailTestService; 
import com.fatecipiranga.idata.business.EmailVerificationService;
import com.fatecipiranga.idata.business.ProfessionalService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class ProfessionalController {

    private static final Logger LOGGER = LoggerFactory.getLogger(ProfessionalController.class);
    private final ProfessionalService professionalService;
    private final EmailVerificationService emailVerificationService;
    private final EmailTestService emailTestService;

    public ProfessionalController(ProfessionalService professionalService,
        EmailVerificationService emailVerificationService,
        EmailTestService emailTestService) {
        this.professionalService = professionalService;
        this.emailVerificationService = emailVerificationService;
        this.emailTestService = emailTestService;
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

    @GetMapping("/test-email")
    public ResponseEntity<String> testEmail() {
        try {
            emailTestService.testEmail();
            return ResponseEntity.ok("Teste enviado com sucesso");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erro ao enviar e-mail: " + e.getMessage());
        }
    }

}