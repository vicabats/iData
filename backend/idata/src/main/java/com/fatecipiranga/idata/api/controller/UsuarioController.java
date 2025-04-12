package com.fatecipiranga.idata.api.controller;

import com.fatecipiranga.idata.api.request.CodeVerificationDTO;
import com.fatecipiranga.idata.api.request.CpfDTO;
import com.fatecipiranga.idata.api.request.LoginDTO;
import com.fatecipiranga.idata.api.request.UsuarioDTO;
import com.fatecipiranga.idata.api.response.UsuarioResponse;
import com.fatecipiranga.idata.business.EmailVerificationService;
import com.fatecipiranga.idata.business.UsuarioService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.fatecipiranga.idata.api.response.UpdateResponse;

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

    @PostMapping(value = "/register", params = "type=personal")
    public ResponseEntity<String> createUsuario(@RequestBody UsuarioDTO usuarioDTO) {
        try {
            UsuarioResponse response = usuarioService.createUsuario(usuarioDTO);
            return ResponseEntity.ok("Usuário registrado com sucesso: " + response.getCpf());
        } catch (RuntimeException e) {
            LOGGER.error("Erro ao registrar usuário para: {}. Detalhes: {}", usuarioDTO.getEmail(), e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao registrar usuário: " + e.getMessage());
        }
    }

    @GetMapping(params = "type=personal")
    public ResponseEntity<UsuarioResponse> getUsuario(@RequestBody CpfDTO cpfDTO) {
        try {
            UsuarioResponse usuario = usuarioService.getUsuarioByCpf(cpfDTO.getCpf())
                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
            return new ResponseEntity<>(usuario, HttpStatus.OK);
        } catch (RuntimeException e) {
            LOGGER.error("Erro ao buscar usuário com CPF: {}. Detalhes: {}", cpfDTO.getCpf(), e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PutMapping(params = "type=personal")
    public ResponseEntity<UpdateResponse<UsuarioResponse>> updateUsuario(@RequestBody UsuarioDTO usuarioDTO) {
        try {
            UsuarioResponse updatedUsuario = usuarioService.updateUsuario(usuarioDTO.getCpf(), usuarioDTO);
            UpdateResponse<UsuarioResponse> response = new UpdateResponse<>("Registro atualizado com sucesso", updatedUsuario);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (RuntimeException e) {
            LOGGER.error("Erro ao atualizar usuário com CPF: {}. Detalhes: {}", usuarioDTO.getCpf(), e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @DeleteMapping(params = "type=personal")
    public ResponseEntity<String> initiateDeleteUsuario(@RequestBody LoginDTO loginDTO) {
        try {
            usuarioService.verifyCredentials(loginDTO.getCpf(), loginDTO.getPassword());
            String email = usuarioService.getEmailByCpf(loginDTO.getCpf());
            emailVerificationService.sendVerificationCode(email, null);
            return ResponseEntity.ok("Código de verificação enviado para " + email + ". Confirme para excluir sua conta.");
        } catch (RuntimeException e) {
            LOGGER.error("Erro ao iniciar exclusão para CPF: {}. Detalhes: {}", loginDTO.getCpf(), e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Erro ao iniciar exclusão: " + e.getMessage());
        }
    }

    @PostMapping(value = "/confirm-delete", params = "type=personal")
    public ResponseEntity<String> confirmDeleteUsuario(@RequestBody CodeVerificationDTO request) {
        try {
            boolean isValid = emailVerificationService.verifyCode(request.getEmail(), request.getCode());
            if (isValid) {
                usuarioService.deleteUsuario(request.getEmail());
                return ResponseEntity.ok("Conta excluída com sucesso.");
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Código de verificação inválido ou expirado");
        } catch (RuntimeException e) {
            LOGGER.error("Erro ao confirmar exclusão para: {}. Detalhes: {}", request.getEmail(), e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao confirmar exclusão: " + e.getMessage());
        }
    }

    @PostMapping(value = "/login", params = "type=personal")
    public ResponseEntity<String> login(@RequestBody LoginDTO loginDTO) {
        try {
            UsuarioResponse usuario = usuarioService.login(loginDTO);
            emailVerificationService.sendVerificationCode(usuario.getEmail(), null);
            return ResponseEntity.ok("Código de verificação enviado para " + usuario.getEmail());
        } catch (RuntimeException e) {
            LOGGER.error("Erro ao realizar login para CPF: {}. Detalhes: {}", loginDTO.getCpf(), e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Erro ao realizar login: " + e.getMessage());
        }
    }

    @PostMapping(value = "/verify-2fa", params = "type=personal")
    public ResponseEntity<String> verify2FA(@RequestBody CodeVerificationDTO request) {
        try {
            boolean isValid = emailVerificationService.verifyCode(request.getEmail(), request.getCode());
            if (isValid) {
                LOGGER.info("Login concluído com sucesso para: {}", request.getEmail());
                return ResponseEntity.ok("Login realizado com sucesso");
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Código de verificação inválido ou expirado");
            }
        } catch (RuntimeException e) {
            LOGGER.error("Erro ao verificar código 2FA para: {}. Detalhes: {}", request.getEmail(), e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao verificar código 2FA: " + e.getMessage());
        }
    }
}