package com.fatecipiranga.idata.api;

import com.fatecipiranga.idata.api.request.UsuarioDTO;
import com.fatecipiranga.idata.business.UsuarioService;
import com.fatecipiranga.idata.infrastructure.exceptions.UserManagementException;
import com.fatecipiranga.idata.api.response.UsuarioResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping
    public ResponseEntity<UsuarioResponse> createUsuario(@RequestBody UsuarioDTO usuarioDTO) {
        try {
            UsuarioResponse createdUsuario = usuarioService.createUsuario(usuarioDTO);
            return new ResponseEntity<>(createdUsuario, HttpStatus.CREATED);
        } catch (UserManagementException ex) {
            throw ex;
        }
    }

    @GetMapping
    public ResponseEntity<List<UsuarioResponse>> getAllUsuarios() {
        try {
            List<UsuarioResponse> usuarios = usuarioService.getAllUsuarios();
            return new ResponseEntity<>(usuarios, HttpStatus.OK);
        } catch (UserManagementException ex) {
            throw ex;
        }
    }

    @GetMapping("/{email}")
    public ResponseEntity<UsuarioResponse> getUsuarioByEmail(@PathVariable String email) {
        try {
            UsuarioResponse usuario = usuarioService.getUsuarioByEmail(email)
                    .orElseThrow(() -> new UserManagementException("Usuário não encontrado", "USER_NOT_FOUND"));
            return new ResponseEntity<>(usuario, HttpStatus.OK);
        } catch (UserManagementException ex) {
            throw ex;
        }
    }

    @PutMapping("/{email}")
    public ResponseEntity<UsuarioResponse> updateUsuario(@PathVariable String email, @RequestBody UsuarioDTO usuarioDTO) {
        try {
            UsuarioResponse updatedUsuario = usuarioService.updateUsuario(email, usuarioDTO);
            return new ResponseEntity<>(updatedUsuario, HttpStatus.OK);
        } catch (UserManagementException ex) {
            throw ex;
        }
    }

    @DeleteMapping("/{email}")
    public ResponseEntity<Void> deleteUsuario(@PathVariable String email) {
        try {
            usuarioService.deleteUsuario(email);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (UserManagementException ex) {
            throw ex;
        }
    }
}