package com.fatecipiranga.idata.api.controller;

import com.fatecipiranga.idata.api.request.LoginDTO;
import com.fatecipiranga.idata.api.request.UsuarioDTO;
import com.fatecipiranga.idata.api.response.LoginResponse;
import com.fatecipiranga.idata.api.response.UsuarioResponse;
import com.fatecipiranga.idata.business.UsuarioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:4200")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping(params = "type=personal")
    public ResponseEntity<UsuarioResponse> createUsuario(@RequestBody UsuarioDTO usuarioDTO) {
        UsuarioResponse createdUsuario = usuarioService.createUsuario(usuarioDTO);
        return new ResponseEntity<>(createdUsuario, HttpStatus.CREATED);
    }

    @GetMapping(params = "type=personal")
    public ResponseEntity<List<UsuarioResponse>> getAllUsuarios() {
        List<UsuarioResponse> usuarios = usuarioService.getAllUsuarios();
        return new ResponseEntity<>(usuarios, HttpStatus.OK);
    }

    @GetMapping(value = "/{email}", params = "type=personal")
    public ResponseEntity<UsuarioResponse> getUsuarioByEmail(@PathVariable String email) {
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
    public ResponseEntity<Void> deleteUsuario(@PathVariable String email) {
        usuarioService.deleteUsuario(email);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PostMapping(value = "/login", params = "type=personal")
    public ResponseEntity<LoginResponse<UsuarioResponse>> login(@RequestBody LoginDTO loginDTO) {
        UsuarioResponse usuario = usuarioService.login(loginDTO);
        String token = UUID.randomUUID().toString();
        LoginResponse<UsuarioResponse> response = new LoginResponse<>(usuario, token);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}