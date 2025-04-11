package com.fatecipiranga.idata.business;

import com.fatecipiranga.idata.api.converter.UsuarioMapper;
import com.fatecipiranga.idata.api.request.LoginDTO;
import com.fatecipiranga.idata.api.request.UsuarioDTO;
import com.fatecipiranga.idata.api.response.UsuarioResponse;
import com.fatecipiranga.idata.infrastructure.entity.EnderecoEntity;
import com.fatecipiranga.idata.infrastructure.entity.UsuarioEntity;
import com.fatecipiranga.idata.infrastructure.exceptions.UserManagementException;
import com.fatecipiranga.idata.infrastructure.repository.UsuarioRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UsuarioService {

    private static final Logger LOGGER = LoggerFactory.getLogger(UsuarioService.class);
    private static final String USER_NOT_FOUND = "USER_NOT_FOUND";
    private static final String USER_NOT_FOUND_FOR_CPF_LOG = "Usuário não encontrado para CPF: {}";

    private final UsuarioRepository usuarioRepository;
    private final EnderecoService enderecoService;
    private final UsuarioMapper usuarioMapper;

    public UsuarioService(UsuarioRepository usuarioRepository, EnderecoService enderecoService, UsuarioMapper usuarioMapper) {
        this.usuarioRepository = usuarioRepository;
        this.enderecoService = enderecoService;
        this.usuarioMapper = usuarioMapper;
    }

    public UsuarioResponse createUsuario(UsuarioDTO usuarioDTO) {
        LOGGER.info("Iniciando criação de usuário");
        if (usuarioDTO == null) {
            LOGGER.error("UsuarioDTO recebido é null");
            throw new UserManagementException("Dados do usuário não fornecidos", "INVALID_INPUT");
        }
        LOGGER.info("Processando CPF: {}", usuarioDTO.getCpf());
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
        LOGGER.info("Usuário criado com sucesso: {}", usuarioEntity.getCpf());
        return usuarioMapper.toResponse(usuarioEntity);
    }

    public List<UsuarioResponse> getAllUsuarios() {
        LOGGER.info("Buscando todos os usuários");
        List<UsuarioEntity> usuarios = usuarioRepository.findAll();
        if (usuarios.isEmpty()) {
            throw new UserManagementException("Nenhum usuário encontrado", "NO_USERS_FOUND");
        }
        return usuarios.stream()
                .map(usuarioMapper::toResponse)
                .toList();
    }

    public Optional<UsuarioResponse> getUsuarioByEmail(String email) {
        LOGGER.info("Buscando usuário pelo email: {}", email);
        Optional<UsuarioEntity> usuario = usuarioRepository.findByEmail(email);
        return usuario.map(usuarioMapper::toResponse);
    }

    public Optional<UsuarioResponse> getUsuarioByCpf(String cpf) {
        LOGGER.info("Buscando usuário pelo CPF: {}", cpf);
        Optional<UsuarioEntity> usuario = usuarioRepository.findByCpf(cpf);
        return usuario.map(usuarioMapper::toResponse);
    }

    public UsuarioResponse updateUsuario(String cpf, UsuarioDTO usuarioDTO) {
        LOGGER.info("Atualizando usuário com CPF: {}", cpf);
        Optional<UsuarioEntity> existingUsuario = usuarioRepository.findByCpf(cpf);
        if (existingUsuario.isEmpty()) {
            throw new UserManagementException("Usuário não encontrado para atualização", USER_NOT_FOUND);
        }

        Optional<UsuarioEntity> usuarioByCpf = usuarioRepository.findByCpf(usuarioDTO.getCpf());
        if (usuarioByCpf.isPresent() && !usuarioByCpf.get().getId().equals(existingUsuario.get().getId())) {
            throw new UserManagementException("CPF já cadastrado como outro usuário", "CPF_ALREADY_EXISTS");
        }
        Optional<UsuarioEntity> usuarioByEmail = usuarioRepository.findByEmail(usuarioDTO.getEmail());
        if (usuarioByEmail.isPresent() && !usuarioByEmail.get().getId().equals(existingUsuario.get().getId())) {
            throw new UserManagementException("Email já cadastrado como outro usuário", "EMAIL_ALREADY_EXISTS");
        }

        UsuarioEntity usuarioEntity = usuarioMapper.toEntity(usuarioDTO);
        usuarioEntity.setId(existingUsuario.get().getId());
        usuarioEntity.setRegistrationDate(existingUsuario.get().getRegistrationDate());

        if (usuarioDTO.getAddress() != null) {
            EnderecoEntity enderecoEntity = usuarioMapper.toEnderecoEntity(usuarioDTO.getAddress());
            enderecoEntity.setUserId(usuarioEntity.getId());
            enderecoEntity = enderecoService.updateEndereco(usuarioEntity.getId(), enderecoEntity);
            usuarioEntity.setAddress(enderecoEntity);
        } else {
            usuarioEntity.setAddress(existingUsuario.get().getAddress());
        }

        usuarioEntity = usuarioRepository.save(usuarioEntity);
        LOGGER.info("Usuário atualizado com sucesso: {}", usuarioEntity.getCpf());
        return usuarioMapper.toResponse(usuarioEntity);
    }

    public boolean deleteUsuario(String email) {
        LOGGER.info("Deletando usuário com email: {}", email);
        Optional<UsuarioEntity> usuario = usuarioRepository.findByEmail(email);
        if (usuario.isEmpty()) {
            throw new UserManagementException("Usuário não encontrado para exclusão", USER_NOT_FOUND);
        }

        String id = usuario.get().getId();
        usuarioRepository.delete(usuario.get());
        enderecoService.deleteEndereco(id);
        LOGGER.info("Usuário deletado com sucesso: {}", email);
        return true;
    }

    public UsuarioResponse login(LoginDTO loginDTO) {
        LOGGER.info("Tentando login de usuário com CPF: {}", loginDTO.getCpf());
        if (loginDTO.getCpf() == null || loginDTO.getPassword() == null) {
            LOGGER.error("CPF ou senha ausentes no login");
            throw new UserManagementException("Dados de login inválidos: CPF ou senha ausentes", "INVALID_INPUT");
        }

        Optional<UsuarioEntity> usuarioOpt = usuarioRepository.findByCpf(loginDTO.getCpf());
        if (usuarioOpt.isEmpty()) {
            LOGGER.warn(USER_NOT_FOUND_FOR_CPF_LOG, loginDTO.getCpf());
            throw new UserManagementException("Usuário não encontrado", USER_NOT_FOUND);
        }

        UsuarioEntity usuario = usuarioOpt.get();
        if (!usuario.getPassword().equals(loginDTO.getPassword())) {
            LOGGER.warn("Senha inválida para CPF: {}", loginDTO.getCpf());
            throw new UserManagementException("Senha inválida", "INVALID_PASSWORD");
        }

        LOGGER.info("Login bem-sucedido para CPF: {}", loginDTO.getCpf());
        return usuarioMapper.toResponse(usuario);
    }

    public void verifyCredentials(String cpf, String password) {
        LOGGER.info("Verificando credenciais para CPF: {}", cpf);
        Optional<UsuarioEntity> usuario = usuarioRepository.findByCpf(cpf);
        if (usuario.isEmpty()) {
            LOGGER.warn(USER_NOT_FOUND_FOR_CPF_LOG, cpf);
            throw new UserManagementException("Usuário não encontrado", USER_NOT_FOUND);
        }
        if (!usuario.get().getPassword().equals(password)) {
            LOGGER.warn("Senha inválida para CPF: {}", cpf);
            throw new UserManagementException("Senha inválida", "INVALID_PASSWORD");
        }
    }

    public String getEmailByCpf(String cpf) {
        LOGGER.info("Buscando email pelo CPF: {}", cpf);
        Optional<UsuarioEntity> usuario = usuarioRepository.findByCpf(cpf);
        if (usuario.isEmpty()) {
            LOGGER.warn(USER_NOT_FOUND_FOR_CPF_LOG, cpf);
            throw new UserManagementException("Usuário não encontrado", USER_NOT_FOUND);
        }
        return usuario.get().getEmail();
    }
}