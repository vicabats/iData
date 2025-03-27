package com.fatecipiranga.idata.api;

import com.fatecipiranga.idata.api.request.LoginDTO;
import com.fatecipiranga.idata.api.request.UsuarioDTO;
import com.fatecipiranga.idata.api.response.UsuarioResponse;
import com.fatecipiranga.idata.business.UsuarioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:4200")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping
    public ResponseEntity<UsuarioResponse> createUsuario(@RequestBody UsuarioDTO usuarioDTO) {
        UsuarioResponse createdUsuario = usuarioService.createUsuario(usuarioDTO);
        return new ResponseEntity<>(createdUsuario, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<UsuarioResponse>> getAllUsuarios() {
        List<UsuarioResponse> usuarios = usuarioService.getAllUsuarios();
        return new ResponseEntity<>(usuarios, HttpStatus.OK);
    }

    @GetMapping("/{email}")
    public ResponseEntity<UsuarioResponse> getUsuarioByEmail(@PathVariable String email) {
        UsuarioResponse usuario = usuarioService.getUsuarioByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        return new ResponseEntity<>(usuario, HttpStatus.OK);
    }

    @PutMapping("/{email}")
    public ResponseEntity<UsuarioResponse> updateUsuario(@PathVariable String email, @RequestBody UsuarioDTO usuarioDTO) {
        UsuarioResponse updatedUsuario = usuarioService.updateUsuario(email, usuarioDTO);
        return new ResponseEntity<>(updatedUsuario, HttpStatus.OK);
    }

    @DeleteMapping("/{email}")
    public ResponseEntity<Void> deleteUsuario(@PathVariable String email) {
        usuarioService.deleteUsuario(email);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PostMapping("/login")
    public ResponseEntity<UsuarioResponse> login(@RequestBody LoginDTO loginDTO) {
        UsuarioResponse usuario = usuarioService.login(loginDTO);
        return new ResponseEntity<>(usuario, HttpStatus.OK);
    }
}