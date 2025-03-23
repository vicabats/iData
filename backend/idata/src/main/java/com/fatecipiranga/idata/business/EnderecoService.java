package com.fatecipiranga.idata.business;


import org.springframework.stereotype.Service;
import com.fatecipiranga.idata.infrastructure.entity.EnderecoEntity;
import com.fatecipiranga.idata.infrastructure.exceptions.UserManagementException;
import com.fatecipiranga.idata.infrastructure.repository.EnderecoRepository;



import java.util.Optional;
import java.util.UUID;

@Service
public class EnderecoService {

    private final EnderecoRepository enderecoRepository;

    public EnderecoService(EnderecoRepository enderecoRepository) {
        this.enderecoRepository = enderecoRepository;
    }

    public EnderecoEntity createEndereco(EnderecoEntity enderecoEntity) {
        if (enderecoEntity.getUserId() == null) {
            throw new UserManagementException("UserId é obrigatório para criar um endereço", "USER_ID_REQUIRED");
        }
        enderecoEntity.setId(UUID.randomUUID().toString());
        return enderecoRepository.save(enderecoEntity);
    }

    public Optional<EnderecoEntity> getEnderecoByUserId(String userId) throws UserManagementException {
        Optional<EnderecoEntity> endereco = enderecoRepository.findByUserId(userId);
        if (endereco.isEmpty()) {
            throw new UserManagementException("Endereço não encontrado para o usuário", "ADDRESS_NOT_FOUND");
        }
        return endereco;
    }

    public EnderecoEntity updateEndereco(String userId, EnderecoEntity enderecoEntity) throws UserManagementException {
        Optional<EnderecoEntity> existingEndereco = enderecoRepository.findByUserId(userId);
        if (existingEndereco.isEmpty()) {
            throw new UserManagementException("Endereço não encontrado para atualização", "ADDRESS_NOT_FOUND");
        }

        EnderecoEntity updatedEntity = existingEndereco.get();
        updatedEntity.setStreet(enderecoEntity.getStreet());
        updatedEntity.setNumber(enderecoEntity.getNumber());
        updatedEntity.setComplement(enderecoEntity.getComplement());
        updatedEntity.setNeighborhood(enderecoEntity.getNeighborhood());
        updatedEntity.setZipCode(enderecoEntity.getZipCode());
        updatedEntity.setCity(enderecoEntity.getCity());
        updatedEntity.setState(enderecoEntity.getState());
        return enderecoRepository.save(updatedEntity);
    }

    public boolean deleteEndereco(String userId) {
        Optional<EnderecoEntity> endereco = enderecoRepository.findByUserId(userId);
        if (endereco.isPresent()) {
            enderecoRepository.delete(endereco.get());
            return true;
        }
        return false;
    }
}