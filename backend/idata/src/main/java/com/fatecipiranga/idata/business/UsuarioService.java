package com.fatecipiranga.idata.business;

import com.fatecipiranga.idata.api.request.UsuarioDTO;
import com.fatecipiranga.idata.api.response.UsuarioResponse;
import com.fatecipiranga.idata.api.converter.UsuarioMapper;
import com.fatecipiranga.idata.infrastructure.entity.EnderecoEntity;
import com.fatecipiranga.idata.infrastructure.entity.UsuarioEntity;
import com.fatecipiranga.idata.infrastructure.exceptions.UserManagementException;
import com.fatecipiranga.idata.infrastructure.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final EnderecoService enderecoService;
    private final UsuarioMapper usuarioMapper;

    public UsuarioService(UsuarioRepository usuarioRepository, EnderecoService enderecoService, UsuarioMapper usuarioMapper) {
        this.usuarioRepository = usuarioRepository;
        this.enderecoService = enderecoService;
        this.usuarioMapper = usuarioMapper;
    }

    public UsuarioResponse createUsuario(UsuarioDTO usuarioDTO) {
        if (usuarioRepository.findByEmail(usuarioDTO.getEmail()).isPresent()) {
            throw new UserManagementException("Email já cadastrado", "EMAIL_ALREADY_EXISTS");
        }

        UsuarioEntity usuarioEntity = usuarioMapper.toEntity(usuarioDTO);
        usuarioEntity.setUserId(UUID.randomUUID().toString());
        usuarioEntity.setRegistrationDate(LocalDateTime.now());

        if (usuarioDTO.getAddress() != null) {
            EnderecoEntity enderecoEntity = usuarioMapper.toEnderecoEntity(usuarioDTO.getAddress());
            enderecoEntity.setUserId(usuarioEntity.getUserId());
            enderecoEntity = enderecoService.createEndereco(enderecoEntity);
            usuarioEntity.setAddress(enderecoEntity);
        }

        usuarioEntity = usuarioRepository.save(usuarioEntity);
        return usuarioMapper.toResponse(usuarioEntity);
    }

    public List<UsuarioResponse> getAllUsuarios() {
        List<UsuarioEntity> usuarios = usuarioRepository.findAll();
        if (usuarios.isEmpty()) {
            throw new UserManagementException("Nenhum usuário encontrado", "NO_USERS_FOUND");
        }
        return usuarios.stream()
                .map(usuarioMapper::toResponse)
                .collect(Collectors.toList());
    }

    public Optional<UsuarioResponse> getUsuarioByEmail(String email) {
        Optional<UsuarioEntity> usuario = usuarioRepository.findByEmail(email);
        if (usuario.isEmpty()) {
            throw new UserManagementException("Usuário não encontrado", "USER NOT FOUND");
        }
        return Optional.of(usuarioMapper.toResponse(usuario.get()));
    }

    public UsuarioResponse updateUsuario(String email, UsuarioDTO usuarioDTO) {
        Optional<UsuarioEntity> existingUsuario = usuarioRepository.findByEmail(email);
        if (existingUsuario.isEmpty()) {
            throw new UserManagementException("Usuário não encontrado para atualização", "USER NOT FOUND");
        }

        UsuarioEntity usuarioEntity = existingUsuario.get();
        usuarioEntity.setName(usuarioDTO.getName());
        usuarioEntity.setCpf(usuarioDTO.getCpf());
        usuarioEntity.setEmail(usuarioDTO.getEmail());
        usuarioEntity.setPassword(usuarioDTO.getPassword());
        usuarioEntity.setPhone(usuarioDTO.getPhone());

        if (usuarioDTO.getAddress() != null) {
            EnderecoEntity enderecoEntity = usuarioMapper.toEnderecoEntity(usuarioDTO.getAddress());
            enderecoEntity.setUserId(usuarioEntity.getUserId());
            enderecoEntity = enderecoService.updateEndereco(usuarioEntity.getUserId(), enderecoEntity);
            usuarioEntity.setAddress(enderecoEntity);
        }

        usuarioEntity = usuarioRepository.save(usuarioEntity);
        return usuarioMapper.toResponse(usuarioEntity);
    }

    public boolean deleteUsuario(String email) {
        Optional<UsuarioEntity> usuario = usuarioRepository.findByEmail(email);
        if (usuario.isEmpty()) {
            throw new UserManagementException("Usuário não encontrado para exclusão", "USER_NOT_FOUND");
        }

        String userId = usuario.get().getUserId();
        usuarioRepository.delete(usuario.get());
        enderecoService.deleteEndereco(userId);
        return true;
    }
}