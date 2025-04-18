package com.fatecipiranga.idata.api.controller;

import com.fatecipiranga.idata.api.request.CodeVerificationDTO;
import com.fatecipiranga.idata.api.request.CpfDTO;
import com.fatecipiranga.idata.api.request.LoginDTO;
import com.fatecipiranga.idata.api.request.UsuarioDTO;
import com.fatecipiranga.idata.api.response.ApiResponse;
import com.fatecipiranga.idata.api.response.SuccessResponse;
import com.fatecipiranga.idata.api.response.UpdateResponse;
import com.fatecipiranga.idata.api.response.UsuarioResponse;
import com.fatecipiranga.idata.business.EmailVerificationService;
import com.fatecipiranga.idata.business.UsuarioService;
import com.fatecipiranga.idata.infrastructure.exceptions.ErrorResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<ApiResponse> createUsuario(@RequestBody UsuarioDTO usuarioDTO) {
        try {
            UsuarioResponse response = usuarioService.createUsuario(usuarioDTO);
            SuccessResponse<String> success = new SuccessResponse<>("Usuário registrado com sucesso", response.getCpf());
            return ResponseEntity.ok(success);
        } catch (RuntimeException e) {
            LOGGER.error("Erro ao registrar usuário para: {}. Detalhes: {}", usuarioDTO.getEmail(), e.getMessage(), e);
            ErrorResponse error = new ErrorResponse("Erro ao registrar usuário: " + e.getMessage(), "REGISTRATION_FAILED");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @GetMapping(params = "type=personal")
    public ResponseEntity<ApiResponse> getUsuario(@RequestBody CpfDTO cpfDTO) {
        try {
            UsuarioResponse usuario = usuarioService.getUsuarioByCpf(cpfDTO.getCpf())
                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
            return new ResponseEntity<>(usuario, HttpStatus.OK);
        } catch (RuntimeException e) {
            LOGGER.error("Erro ao buscar usuário com CPF: {}. Detalhes: {}", cpfDTO.getCpf(), e.getMessage(), e);
            ErrorResponse error = new ErrorResponse("Usuário não encontrado", "NOT_FOUND");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    @PutMapping(params = "type=personal")
    public ResponseEntity<ApiResponse> updateUsuario(@RequestBody UsuarioDTO usuarioDTO) {
        try {
            UsuarioResponse updatedUsuario = usuarioService.updateUsuario(usuarioDTO.getCpf(), usuarioDTO);
            UpdateResponse<UsuarioResponse> response = new UpdateResponse<>("Registro atualizado com sucesso", updatedUsuario);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (RuntimeException e) {
            LOGGER.error("Erro ao atualizar usuário com CPF: {}. Detalhes: {}", usuarioDTO.getCpf(), e.getMessage(), e);
            ErrorResponse error = new ErrorResponse("Erro ao atualizar usuário: " + e.getMessage(), "UPDATE_FAILED");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @DeleteMapping(params = "type=personal")
    public ResponseEntity<ApiResponse> initiateDeleteUsuario(@RequestBody LoginDTO loginDTO) {
        try {
            usuarioService.verifyCredentials(loginDTO.getCpf(), loginDTO.getPassword());
            String email = usuarioService.getEmailByCpf(loginDTO.getCpf());
            emailVerificationService.sendVerificationCode(email, null);
            SuccessResponse<String> success = new SuccessResponse<>("Código de verificação enviado para " + email + ". Confirme para excluir sua conta.", email);
            return ResponseEntity.ok(success);
        } catch (RuntimeException e) {
            LOGGER.error("Erro ao iniciar exclusão para CPF: {}. Detalhes: {}", loginDTO.getCpf(), e.getMessage(), e);
            ErrorResponse error = new ErrorResponse("Erro ao iniciar exclusão: " + e.getMessage(), "DELETE_INIT_FAILED");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @PostMapping(value = "/confirm-delete", params = "type=personal")
    public ResponseEntity<ApiResponse> confirmDeleteUsuario(@RequestBody CodeVerificationDTO request) {
        try {
            String email = usuarioService.getEmailByCpf(request.getCpf());
            boolean isValid = emailVerificationService.verifyCode(email, request.getCode());
            if (isValid) {
                usuarioService.deleteUsuario(email);
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

    @PostMapping(value = "/login", params = "type=personal")
    public ResponseEntity<ApiResponse> login(@RequestBody LoginDTO loginDTO) {
        try {
            UsuarioResponse usuario = usuarioService.login(loginDTO);
            emailVerificationService.sendVerificationCode(usuario.getEmail(), null);
            SuccessResponse<String> success = new SuccessResponse<>("Código de verificação enviado para " + usuario.getEmail(), usuario.getEmail());
            return ResponseEntity.ok(success);
        } catch (RuntimeException e) {
            LOGGER.error("Erro ao realizar login para CPF: {}. Detalhes: {}", loginDTO.getCpf(), e.getMessage(), e);
            ErrorResponse error = new ErrorResponse("Erro ao realizar login: " + e.getMessage(), "LOGIN_FAILED");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
    }

    @PostMapping(value = "/verify-2fa", params = "type=personal")
    public ResponseEntity<ApiResponse> verify2FA(@RequestBody CodeVerificationDTO request) {
        try {
            String email = usuarioService.getEmailByCpf(request.getCpf());
            boolean isValid = emailVerificationService.verifyCode(email, request.getCode());
            if (isValid) {
                LOGGER.info("Login concluído com sucesso para CPF: {}", request.getCpf());
                UsuarioResponse usuario = usuarioService.getUsuarioByCpf(request.getCpf())
                        .orElseThrow(() -> new RuntimeException("Usuário não encontrado após 2FA"));
                SuccessResponse<UsuarioResponse> success = new SuccessResponse<>("Login realizado com sucesso", usuario);
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