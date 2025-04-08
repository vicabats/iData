package com.fatecipiranga.idata.api.controller;

import com.fatecipiranga.idata.api.request.CodeVerificationDTO;
import com.fatecipiranga.idata.api.request.LoginDTO;
import com.fatecipiranga.idata.api.request.ProfessionalDTO;
import com.fatecipiranga.idata.api.request.VerificationRequestDTO;
import com.fatecipiranga.idata.api.response.LoginResponse;
import com.fatecipiranga.idata.api.response.ProfessionalResponse;
import com.fatecipiranga.idata.business.EmailTestService;
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
@CrossOrigin(origins = "http://localhost:4200")
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

    @PostMapping(value = "/register", params = "type=professional")
    public ResponseEntity<String> registerProfessional(@RequestBody VerificationRequestDTO request) {
        try {
            ProfessionalResponse response = professionalService.createProfessional(request.getProfessionalDTO());
            return ResponseEntity.ok("Profissional registrado com sucesso: " + response.getCpf());
        } catch (RuntimeException e) {
            LOGGER.error("Erro ao registrar profissional para: {}. Detalhes: {}", request.getEmail(), e.getMessage(), e);
            return ResponseEntity.status(500).body("Erro ao registrar profissional: " + e.getMessage());
        }
    }

    @GetMapping(params = "type=professional")
    public ResponseEntity<ProfessionalResponse> getProfessional(@RequestParam("email") String email) {
        ProfessionalResponse professional = professionalService.getProfessionalByEmail(email)
                .orElseThrow(() -> new RuntimeException("Profissional não encontrado"));
        return new ResponseEntity<>(professional, HttpStatus.OK);
    }

    @PutMapping(value = "/{email}", params = "type=professional")
    public ResponseEntity<ProfessionalResponse> updateProfessional(@PathVariable String email, @RequestBody ProfessionalDTO professionalDTO) {
        ProfessionalResponse updatedProfessional = professionalService.updateProfessional(email, professionalDTO);
        return new ResponseEntity<>(updatedProfessional, HttpStatus.OK);
    }

    @DeleteMapping(value = "/{email}", params = "type=professional")
    public ResponseEntity<String> initiateDeleteProfessional(@PathVariable String email) {
        professionalService.getProfessionalByEmail(email)
                .orElseThrow(() -> new RuntimeException("Profissional não encontrado"));
        emailVerificationService.sendVerificationCode(email, null);
        return ResponseEntity.ok("Código de verificação enviado para " + email + ". Confirme para excluir sua conta.");
    }

    @PostMapping(value = "/confirm-delete", params = "type=professional")
    public ResponseEntity<String> confirmDeleteProfessional(@RequestBody CodeVerificationDTO request) {
        boolean isValid = emailVerificationService.verifyCode(request.getEmail(), request.getCode());
        if (isValid) {
            professionalService.deleteProfessional(request.getEmail());
            return ResponseEntity.ok("Conta excluída com sucesso.");
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Código de verificação inválido ou expirado");
    }

    @PostMapping(value = "/login", params = "type=professional")
    public ResponseEntity<String> loginProfessional(@RequestBody LoginDTO loginDTO) {
        try {
            ProfessionalResponse professional = professionalService.login(loginDTO);
            emailVerificationService.sendVerificationCode(professional.getEmail(), null);
            return ResponseEntity.ok("Código de verificação enviado para " + professional.getEmail());
        } catch (RuntimeException e) {
            LOGGER.error("Erro ao realizar login para CPF: {}. Detalhes: {}", loginDTO.getCpf(), e.getMessage(), e);
            return ResponseEntity.status(401).body("Erro ao realizar login: " + e.getMessage());
        }
    }

    @PostMapping(value = "/verify-2fa", params = "type=professional")
    public ResponseEntity<LoginResponse<ProfessionalResponse>> verify2FA(@RequestBody CodeVerificationDTO request) {
        try {
            boolean isValid = emailVerificationService.verifyCode(request.getEmail(), request.getCode());
            if (isValid) {
                ProfessionalResponse professional = professionalService.getProfessionalByEmail(request.getEmail())
                        .orElseThrow(() -> new RuntimeException("Profissional não encontrado após verificação"));
                String token = UUID.randomUUID().toString();
                LoginResponse<ProfessionalResponse> response = new LoginResponse<>(professional, token);
                LOGGER.info("Login concluído com sucesso para: {}", request.getEmail());
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new LoginResponse<>(null, null, "Código de verificação inválido ou expirado"));
            }
        } catch (RuntimeException e) {
            LOGGER.error("Erro ao verificar código 2FA para: {}. Detalhes: {}", request.getEmail(), e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new LoginResponse<>(null, null, "Erro ao verificar código 2FA: " + e.getMessage()));
        }
    }

    @GetMapping("/test-email")
    public ResponseEntity<String> testEmail(@RequestParam String email) {
        try {
            emailTestService.testEmail(email);
            return ResponseEntity.ok("Teste enviado com sucesso para " + email);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erro ao enviar e-mail: " + e.getMessage());
        }
    }
}