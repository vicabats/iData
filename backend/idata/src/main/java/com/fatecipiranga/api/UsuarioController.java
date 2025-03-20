package com.fatecipiranga.api;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fatecipiranga.api.request.UsuarioRequestDTO;
import com.fatecipiranga.api.response.UsuarioResponseDTO;
import com.fatecipiranga.business.UsuarioService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    @PostMapping("/register")
    public ResponseEntity<UsuarioResponseDTO> gravaDadosUsuario(@RequestBody UsuarioRequestDTO usuarioRequestDTO) {
        return ResponseEntity.ok(usuarioService.gravarUsuario(usuarioRequestDTO));
    }
    
    @GetMapping("/list")
    public ResponseEntity<List<UsuarioResponseDTO>> listarUsuarios() {
        return ResponseEntity.ok(usuarioService.listarTodosUsuarios());
}

    @DeleteMapping("/delete")
    public ResponseEntity<Void> deletaDadosUsuario(@RequestParam("email") String email) {
        usuarioService.deletaDadosUsuario(email);
        return ResponseEntity.noContent().build();
    }

}