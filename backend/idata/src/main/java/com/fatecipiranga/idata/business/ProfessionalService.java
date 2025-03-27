package com.fatecipiranga.idata.business;

import com.fatecipiranga.idata.api.request.LoginDTO;
import com.fatecipiranga.idata.api.request.ProfessionalDTO;
import com.fatecipiranga.idata.api.response.ProfessionalResponse;
import com.fatecipiranga.idata.api.converter.ProfessionalMapper;
import com.fatecipiranga.idata.infrastructure.entity.FacilityEntity;
import com.fatecipiranga.idata.infrastructure.entity.ProfessionalEntity;
import com.fatecipiranga.idata.infrastructure.exceptions.UserManagementException;
import com.fatecipiranga.idata.infrastructure.repository.FacilityRepository;
import com.fatecipiranga.idata.infrastructure.repository.ProfessionalRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class ProfessionalService {

    private static final Logger LOGGER = LoggerFactory.getLogger(ProfessionalService.class);

    private final ProfessionalRepository professionalRepository;
    private final FacilityRepository facilityRepository;
    private final ProfessionalMapper professionalMapper;

    public ProfessionalService(ProfessionalRepository professionalRepository, FacilityRepository facilityRepository, ProfessionalMapper professionalMapper) {
        this.professionalRepository = professionalRepository;
        this.facilityRepository = facilityRepository;
        this.professionalMapper = professionalMapper;
    }

    public ProfessionalResponse createProfessional(ProfessionalDTO professionalDTO) {
        LOGGER.info("Iniciando criação de profissional com CPF: {}", professionalDTO.getCpf());
        try {
            LOGGER.debug("Convertendo ProfessionalDTO para ProfessionalEntity");
            ProfessionalEntity professionalEntity = professionalMapper.toEntity(professionalDTO);
            professionalEntity.setProfessionalId(UUID.randomUUID().toString());
            professionalEntity.setRegistrationDate(LocalDateTime.now());
            LOGGER.debug("ProfessionalEntity inicializado: {}", professionalEntity);

            if (professionalDTO.getFacility() != null) {
                LOGGER.debug("Criando FacilityEntity para: {}", professionalDTO.getFacility().getName());
                FacilityEntity facility = new FacilityEntity();
                facility.setId(UUID.randomUUID().toString());
                facility.setName(professionalDTO.getFacility().getName());
                LOGGER.debug("Convertendo AddressDTO para AddressEntity");
                facility.setAddress(professionalMapper.addressDtoToEntity(professionalDTO.getFacility().getAddress()));
                LOGGER.debug("Salvando FacilityEntity: {}", facility);
                facilityRepository.save(facility);
                professionalEntity.setFacility(facility);
            }

            LOGGER.debug("Salvando ProfessionalEntity no repositório");
            professionalEntity = professionalRepository.save(professionalEntity);
            LOGGER.info("Profissional criado com sucesso: {}", professionalEntity.getCpf());
            return professionalMapper.toResponse(professionalEntity);
        } catch (Exception e) {
            LOGGER.error("Erro ao criar profissional com CPF: {}. Detalhes: {}", professionalDTO.getCpf(), e.getMessage(), e);
            throw new UserManagementException("Falha ao criar profissional com CPF: " + professionalDTO.getCpf(), "CREATE_PROFESSIONAL_ERROR", e);
        }
    }

    public ProfessionalResponse login(LoginDTO loginDTO) {
        LOGGER.info("Tentando login de profissional com CPF: {}", loginDTO.getCpf());
        try {
            Optional<ProfessionalEntity> professionalOpt = professionalRepository.findByCpf(loginDTO.getCpf());
            if (professionalOpt.isEmpty()) {
                LOGGER.warn("Profissional não encontrado para CPF: {}", loginDTO.getCpf());
                throw new UserManagementException("Profissional não encontrado", "PROFESSIONAL_NOT_FOUND");
            }

            ProfessionalEntity professional = professionalOpt.get();
            LOGGER.info("Profissional encontrado: {}", professional.getCpf());
            if (!professional.getPassword().equals(loginDTO.getPassword())) {
                LOGGER.warn("Senha inválida para CPF: {}", loginDTO.getCpf());
                throw new UserManagementException("Senha inválida", "INVALID_PASSWORD");
            }

            LOGGER.info("Login bem-sucedido para CPF: {}", loginDTO.getCpf());
            return professionalMapper.toResponse(professional);
        } catch (Exception e) {
            LOGGER.error("Erro ao realizar login com CPF: {}. Detalhes: {}", loginDTO.getCpf(), e.getMessage(), e);
            throw new UserManagementException("Falha ao realizar login com CPF: " + loginDTO.getCpf(), "LOGIN_ERROR", e);
        }
    }
}