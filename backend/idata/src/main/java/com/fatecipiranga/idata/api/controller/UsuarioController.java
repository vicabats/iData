package com.fatecipiranga.idata.api.controller;

import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.fatecipiranga.idata.api.request.CodeVerificationDTO;
import com.fatecipiranga.idata.api.request.LoginDTO;
import com.fatecipiranga.idata.api.request.UsuarioDTO;
import com.fatecipiranga.idata.api.response.LoginResponse;
import com.fatecipiranga.idata.api.response.UsuarioResponse;
import com.fatecipiranga.idata.business.EmailVerificationService;
import com.fatecipiranga.idata.business.UsuarioService;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:4200")
public class UsuarioController {

    private static final Logger LOGGER = LoggerFactory.getLogger(UsuarioController.class);
    private final UsuarioService usuarioService;
    private final EmailVerificationService emailVerificationService;

    public UsuarioController(UsuarioService usuarioService, EmailVerificationService emailVerificationService) {
        this.usuarioService = usuarioService;
        this.emailVerificationService = emailVerificationService;
    }

    @PostMapping(params = "type=personal")
    public ResponseEntity<UsuarioResponse> createUsuario(@RequestBody UsuarioDTO usuarioDTO) {
        UsuarioResponse createdUsuario = usuarioService.createUsuario(usuarioDTO);
        return new ResponseEntity<>(createdUsuario, HttpStatus.CREATED);
    }

    @GetMapping(params = "type=personal")
    public ResponseEntity<UsuarioResponse> getUsuario(@RequestParam("email") String email) {
        UsuarioResponse usuario = usuarioService.getUsuarioByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        return new ResponseEntity<>(usuario, HttpStatus.OK);
    }

    @PutMapping(value = "/{email}", params = "type=personal")
    public ResponseEntity<UsuarioResponse> updateUsuario(@PathVariable String email, @RequestBody UsuarioDTO usuarioDTO) {
        UsuarioResponse updatedUsuario = usuarioService.updateUsuario(email, usuarioDTO);
        return new ResponseEntity<>(updatedUsuario, HttpStatus.OK);
    }

    @DeleteMapping(value = "/{email}", params = "type=personal")
    public ResponseEntity<String> initiateDeleteUsuario(@PathVariable String email) {
        usuarioService.getUsuarioByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        emailVerificationService.sendVerificationCode(email, null);
        return ResponseEntity.ok("Código de verificação enviado para " + email + ". Confirme para excluir sua conta.");
    }

    @PostMapping(value = "/confirm-delete", params = "type=personal")
    public ResponseEntity<String> confirmDeleteUsuario(@RequestBody CodeVerificationDTO request) {
        boolean isValid = emailVerificationService.verifyCode(request.getEmail(), request.getCode());
        if (isValid) {
            usuarioService.deleteUsuario(request.getEmail());
            return ResponseEntity.ok("Conta excluída com sucesso.");
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Código de verificação inválido ou expirado");
    }

    @PostMapping(value = "/login", params = "type=personal")
    public ResponseEntity<String> login(@RequestBody LoginDTO loginDTO) {
        try {
            UsuarioResponse usuario = usuarioService.login(loginDTO);
            emailVerificationService.sendVerificationCode(usuario.getEmail(), null);
            return ResponseEntity.ok("Código de verificação enviado para " + usuario.getEmail());
        } catch (RuntimeException e) {
            LOGGER.error("Erro ao realizar login para CPF: {}. Detalhes: {}", loginDTO.getCpf(), e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Erro ao realizar login: " + e.getMessage());
        }
    }

    @PostMapping(value = "/verify-2fa", params = "type=personal")
    public ResponseEntity<LoginResponse<UsuarioResponse>> verify2FA(@RequestBody CodeVerificationDTO request) {
        try {
            boolean isValid = emailVerificationService.verifyCode(request.getEmail(), request.getCode());
            if (isValid) {
                UsuarioResponse usuario = usuarioService.getUsuarioByEmail(request.getEmail())
                        .orElseThrow(() -> new RuntimeException("Usuário não encontrado após verificação"));
                String token = UUID.randomUUID().toString();
                LoginResponse<UsuarioResponse> response = new LoginResponse<>(usuario, token);
                LOGGER.info("Login concluído com sucesso para: {}", request.getEmail());
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new LoginResponse<>(null, null, "Código de verificação inválido ou expirado"));
            }
        } catch (RuntimeException e) {
            LOGGER.error("Erro ao verificar código 2FA para: {}. Detalhes: {}", request.getEmail(), e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new LoginResponse<>(null, null, "Erro ao verificar código 2FA: " + e.getMessage()));
        }
    }
}