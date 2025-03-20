package com.fatecipiranga.business;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.fatecipiranga.api.converter.UsuarioConverter;
import com.fatecipiranga.api.converter.UsuarioMapper;
import com.fatecipiranga.api.request.UsuarioRequestDTO;
import com.fatecipiranga.api.response.UsuarioResponseDTO;
import com.fatecipiranga.infrastructure.EnderecoEntity;
import com.fatecipiranga.infrastructure.UsuarioEntity;
import com.fatecipiranga.infrastructure.exceptions.BusinessException;
import com.fatecipiranga.infrastructure.repository.UsuarioRepository;
import java.util.List;

import static org.springframework.util.Assert.notNull;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final UsuarioConverter usuarioConverter;
    private final UsuarioMapper usuarioMapper;
    private final EnderecoService enderecoService;

    public UsuarioEntity salvaUsuario(UsuarioEntity usuarioEntity) {
        return usuarioRepository.save(usuarioEntity);
    }

    public UsuarioResponseDTO gravarUsuario(UsuarioRequestDTO usuarioRequestDTO) {
        try {
            notNull(usuarioRequestDTO, "Os dados do usuário são obrigatórios");
            UsuarioEntity usuarioEntity = salvaUsuario(usuarioConverter.paraUsuarioEntity(usuarioRequestDTO));
            EnderecoEntity enderecoEntity = enderecoService.salvaEndereco(
                usuarioConverter.paraEnderecoEntity(usuarioRequestDTO.getEndereco(), usuarioEntity.getUserId()));
            return usuarioMapper.paraUsuarioResponseDTO(usuarioEntity, enderecoEntity);
        } catch (Exception e) {
            throw new BusinessException("Erro ao gravar dados de usuário", e);
        }
    }

    public UsuarioResponseDTO buscaDadosUsuario(String email) {
        try {
            UsuarioEntity entity = usuarioRepository.findByEmail(email);
            notNull(entity, "Usuário não encontrado");
            EnderecoEntity enderecoEntity = enderecoService.findByUserId(entity.getUserId());

            return usuarioMapper.paraUsuarioResponseDTO(entity, enderecoEntity);
        } catch (Exception e) {
            throw new BusinessException("Erro ao buscar dados de usuário", e);
        }
    }

    @Transactional
    public void deletaDadosUsuario(String email) {
        UsuarioEntity entity = usuarioRepository.findByEmail(email);
        usuarioRepository.deleteByEmail(email);
        enderecoService.deleteByUserId(entity.getUserId());
    }


    public List<UsuarioResponseDTO> listarTodosUsuarios() {
        try {
            List<UsuarioEntity> usuarios = usuarioRepository.findAll();
            return usuarios.stream()
                .map(usuario -> {
                    EnderecoEntity enderecoEntity = enderecoService.findByUserId(usuario.getUserId());
                    return usuarioMapper.paraUsuarioResponseDTO(usuario, enderecoEntity);
                })
                .toList();
        } catch (Exception e) {
            throw new BusinessException("Erro ao listar usuários", e);
        }
    }
}
