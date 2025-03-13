package com.fatecipiranga.idata.business;

import lombok.RequiredArgsConstructor;

import org.springframework.data.mongodb.core.convert.UpdateMapper;
import org.springframework.stereotype.Service;

import com.fatecipiranga.api.converter.UsuarioMapper;
import com.fatecipiranga.idata.api.UsuarioController;
import com.fatecipiranga.idata.api.converter.UsuarioConverter;
import com.fatecipiranga.idata.api.request.UsuarioRequestDTO;
import com.fatecipiranga.idata.api.response.UsuarioResponseDTO;
import com.fatecipiranga.idata.infrastructure.EnderecoEntity;
import com.fatecipiranga.idata.infrastructure.UsuarioEntity;
import com.fatecipiranga.idata.infrastructure.exceptions.BusinessException;
import com.fatecipiranga.idata.infrastructure.repository.EnderecoRepository;
import com.fatecipiranga.idata.infrastructure.repository.UsuarioRepository;


import java.util.Collections;
import java.util.List;

import static org.springframework.util.Assert.notNull;

@SuppressWarnings("unused")
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



