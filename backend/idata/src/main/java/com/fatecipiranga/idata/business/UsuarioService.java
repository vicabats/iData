package com.fatecipiranga.idata.business;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.fatecipiranga.idata.api.converter.UsuarioMapper;
import com.fatecipiranga.idata.api.request.LoginDTO;
import com.fatecipiranga.idata.api.request.UsuarioDTO;
import com.fatecipiranga.idata.api.response.UsuarioResponse;
import com.fatecipiranga.idata.infrastructure.entity.EnderecoEntity;
import com.fatecipiranga.idata.infrastructure.entity.UsuarioEntity;
import com.fatecipiranga.idata.infrastructure.exceptions.UserManagementException;
import com.fatecipiranga.idata.infrastructure.repository.UsuarioRepository;

@Service
public class UsuarioService {

    private static final String USER_NOT_FOUND = "USER_NOT_FOUND";

    private final UsuarioRepository usuarioRepository;
    private final EnderecoService enderecoService;
    private final UsuarioMapper usuarioMapper;

    public UsuarioService(UsuarioRepository usuarioRepository, EnderecoService enderecoService, UsuarioMapper usuarioMapper) {
        this.usuarioRepository = usuarioRepository;
        this.enderecoService = enderecoService;
        this.usuarioMapper = usuarioMapper;
    }

    public UsuarioResponse createUsuario(UsuarioDTO usuarioDTO) {
        // Verificar unicidade de CPF e e-mail na coleção Usuario
        if (usuarioRepository.findByCpf(usuarioDTO.getCpf()).isPresent()) {
            throw new UserManagementException("CPF já cadastrado como usuário", "CPF_ALREADY_EXISTS");
        }
        if (usuarioRepository.findByEmail(usuarioDTO.getEmail()).isPresent()) {
            throw new UserManagementException("Email já cadastrado como usuário", "EMAIL_ALREADY_EXISTS");
        }

        UsuarioEntity usuarioEntity = usuarioMapper.toEntity(usuarioDTO);
        usuarioEntity.setId(UUID.randomUUID().toString());
        usuarioEntity.setRegistrationDate(LocalDateTime.now());

        if (usuarioDTO.getAddress() != null) {
            EnderecoEntity enderecoEntity = usuarioMapper.toEnderecoEntity(usuarioDTO.getAddress());
            enderecoEntity.setUserId(usuarioEntity.getId());
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
                .toList();
    }

    public Optional<UsuarioResponse> getUsuarioByEmail(String email) {
        Optional<UsuarioEntity> usuario = usuarioRepository.findByEmail(email);
        if (usuario.isEmpty()) {
            throw new UserManagementException("Usuário não encontrado", USER_NOT_FOUND);
        }
        return Optional.of(usuarioMapper.toResponse(usuario.get()));
    }

    public UsuarioResponse updateUsuario(String email, UsuarioDTO usuarioDTO) {
        Optional<UsuarioEntity> existingUsuario = usuarioRepository.findByEmail(email);
        if (existingUsuario.isEmpty()) {
            throw new UserManagementException("Usuário não encontrado para atualização", USER_NOT_FOUND);
        }

        // Verificar unicidade de CPF e e-mail (exceto para o próprio usuário sendo atualizado)
        Optional<UsuarioEntity> usuarioByCpf = usuarioRepository.findByCpf(usuarioDTO.getCpf());
        if (usuarioByCpf.isPresent() && !usuarioByCpf.get().getId().equals(existingUsuario.get().getId())) {
            throw new UserManagementException("CPF já cadastrado como outro usuário", "CPF_ALREADY_EXISTS");
        }
        Optional<UsuarioEntity> usuarioByEmail = usuarioRepository.findByEmail(usuarioDTO.getEmail());
        if (usuarioByEmail.isPresent() && !usuarioByEmail.get().getId().equals(existingUsuario.get().getId())) {
            throw new UserManagementException("Email já cadastrado como outro usuário", "EMAIL_ALREADY_EXISTS");
        }

        UsuarioEntity usuarioEntity = existingUsuario.get();
        usuarioEntity.setName(usuarioDTO.getName());
        usuarioEntity.setCpf(usuarioDTO.getCpf());
        usuarioEntity.setEmail(usuarioDTO.getEmail());
        usuarioEntity.setPassword(usuarioDTO.getPassword());
        usuarioEntity.setPhone(usuarioDTO.getPhone());

        if (usuarioDTO.getAddress() != null) {
            EnderecoEntity enderecoEntity = usuarioMapper.toEnderecoEntity(usuarioDTO.getAddress());
            enderecoEntity.setUserId(usuarioEntity.getId());
            enderecoEntity = enderecoService.updateEndereco(usuarioEntity.getId(), enderecoEntity);
            usuarioEntity.setAddress(enderecoEntity);
        }

        usuarioEntity = usuarioRepository.save(usuarioEntity);
        return usuarioMapper.toResponse(usuarioEntity);
    }

    public boolean deleteUsuario(String email) {
        Optional<UsuarioEntity> usuario = usuarioRepository.findByEmail(email);
        if (usuario.isEmpty()) {
            throw new UserManagementException("Usuário não encontrado para exclusão", USER_NOT_FOUND);
        }

        String id = usuario.get().getId();
        usuarioRepository.delete(usuario.get());
        enderecoService.deleteEndereco(id);
        return true;
    }

    public UsuarioResponse login(LoginDTO loginDTO) {
        Optional<UsuarioEntity> usuarioOpt = usuarioRepository.findByCpf(loginDTO.getCpf());
        if (usuarioOpt.isEmpty()) {
            throw new UserManagementException("Usuário não encontrado", USER_NOT_FOUND);
        }

        UsuarioEntity usuario = usuarioOpt.get();
        if (!usuario.getPassword().equals(loginDTO.getPassword())) {
            throw new UserManagementException("Senha inválida", "INVALID_PASSWORD");
        }

        return usuarioMapper.toResponse(usuario);
    }
}