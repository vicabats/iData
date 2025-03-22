package com.fatecipiranga.idata.business;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.fatecipiranga.idata.infrastructure.entity.EnderecoEntity;
import com.fatecipiranga.idata.infrastructure.repository.EnderecoRepository;


@Service
@RequiredArgsConstructor
public class EnderecoService {

    private final EnderecoRepository enderecoRepository;


    public EnderecoEntity salvaEndereco(EnderecoEntity enderecoEntity) {
        return enderecoRepository.save(enderecoEntity);
    }
    public EnderecoEntity findByUserId(String userId) {
        return enderecoRepository.findByUserId(userId);
    }
    public void deleteByUserId(String userId){
        enderecoRepository.deleteByUserId(userId);
    }

}



