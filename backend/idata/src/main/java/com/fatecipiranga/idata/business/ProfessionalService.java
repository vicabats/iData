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

    @SuppressWarnings("java:S2139")
    public ProfessionalResponse createProfessional(ProfessionalDTO professionalDTO) {
        LOGGER.info("Iniciando criação de profissional com CPF: {}", professionalDTO.getCpf());
        // Verificar unicidade de CPF e e-mail na coleção Professional
        if (professionalRepository.findByCpf(professionalDTO.getCpf()).isPresent()) {
            throw new UserManagementException("CPF já cadastrado como profissional", "CPF_ALREADY_EXISTS");
        }
        if (professionalRepository.findByEmail(professionalDTO.getEmail()).isPresent()) {
            throw new UserManagementException("Email já cadastrado como profissional", "EMAIL_ALREADY_EXISTS");
        }

        try {
            ProfessionalEntity professionalEntity = professionalMapper.toEntity(professionalDTO);
            professionalEntity.setId(UUID.randomUUID().toString());
            professionalEntity.setRegistrationDate(LocalDateTime.now());

            if (professionalDTO.getFacility() != null) {
                FacilityEntity facility = professionalMapper.facilityDtoToEntity(professionalDTO.getFacility());
                facility.setId(UUID.randomUUID().toString());
                facilityRepository.save(facility);
                professionalEntity.setFacility(facility);
            }

            professionalEntity = professionalRepository.save(professionalEntity);
            LOGGER.info("Profissional criado com sucesso: {}", professionalEntity.getCpf());
            return professionalMapper.toResponse(professionalEntity);
        } catch (IllegalArgumentException e) {
            LOGGER.error("Dados inválidos ao criar profissional com CPF: {}. Detalhes: {}", professionalDTO.getCpf(), e.getMessage(), e);
            throw new UserManagementException("Dados inválidos fornecidos para criar profissional com CPF: " + professionalDTO.getCpf() + ". Detalhes: " + e.getMessage(), "INVALID_INPUT", e);
        } catch (Exception e) {
            LOGGER.error("Erro inesperado ao criar profissional com CPF: {}. Detalhes: {}", professionalDTO.getCpf(), e.getMessage(), e);
            throw new UserManagementException("Erro interno ao criar profissional com CPF: " + professionalDTO.getCpf() + ". Contate o suporte. Erro: " + e.getClass().getSimpleName() + " - " + e.getMessage(), "CREATE_PROFESSIONAL_ERROR", e);
        }
    }

    public Optional<ProfessionalResponse> getProfessionalByEmail(String email) {
        LOGGER.info("Buscando profissional pelo email: {}", email);
        Optional<ProfessionalEntity> professional = professionalRepository.findByEmail(email);
        if (professional.isEmpty()) {
            LOGGER.warn("Profissional não encontrado para email: {}", email);
            throw new UserManagementException("Profissional não encontrado", "PROFESSIONAL_NOT_FOUND");
        }
        return Optional.of(professionalMapper.toResponse(professional.get()));
    }

    public ProfessionalResponse updateProfessional(String email, ProfessionalDTO professionalDTO) {
        LOGGER.info("Atualizando profissional com email: {}", email);
        Optional<ProfessionalEntity> existingProfessional = professionalRepository.findByEmail(email);
        if (existingProfessional.isEmpty()) {
            throw new UserManagementException("Profissional não encontrado para atualização", "PROFESSIONAL_NOT_FOUND");
        }

        // Verificar unicidade de CPF e e-mail (exceto para o próprio profissional sendo atualizado)
        Optional<ProfessionalEntity> professionalByCpf = professionalRepository.findByCpf(professionalDTO.getCpf());
        if (professionalByCpf.isPresent() && !professionalByCpf.get().getId().equals(existingProfessional.get().getId())) {
            throw new UserManagementException("CPF já cadastrado como outro profissional", "CPF_ALREADY_EXISTS");
        }
        Optional<ProfessionalEntity> professionalByEmail = professionalRepository.findByEmail(professionalDTO.getEmail());
        if (professionalByEmail.isPresent() && !professionalByEmail.get().getId().equals(existingProfessional.get().getId())) {
            throw new UserManagementException("Email já cadastrado como outro profissional", "EMAIL_ALREADY_EXISTS");
        }

        ProfessionalEntity professionalEntity = existingProfessional.get();
        professionalEntity.setName(professionalDTO.getName());
        professionalEntity.setCpf(professionalDTO.getCpf());
        professionalEntity.setEmail(professionalDTO.getEmail());
        professionalEntity.setPassword(professionalDTO.getPassword());
        professionalEntity.setPhone(professionalDTO.getPhone());
        professionalEntity.setProfessionalLicense(professionalDTO.getProfessionalLicense());

        if (professionalDTO.getFacility() != null) {
            FacilityEntity facility = professionalMapper.facilityDtoToEntity(professionalDTO.getFacility());
            facility.setId(professionalEntity.getFacility() != null ? professionalEntity.getFacility().getId() : UUID.randomUUID().toString());
            facilityRepository.save(facility);
            professionalEntity.setFacility(facility);
        }

        professionalEntity = professionalRepository.save(professionalEntity);
        LOGGER.info("Profissional atualizado com sucesso: {}", professionalEntity.getCpf());
        return professionalMapper.toResponse(professionalEntity);
    }

    public boolean deleteProfessional(String email) {
        LOGGER.info("Deletando profissional com email: {}", email);
        Optional<ProfessionalEntity> professional = professionalRepository.findByEmail(email);
        if (professional.isEmpty()) {
            throw new UserManagementException("Profissional não encontrado para exclusão", "PROFESSIONAL_NOT_FOUND");
        }

        ProfessionalEntity professionalEntity = professional.get();
        professionalRepository.delete(professionalEntity);
        if (professionalEntity.getFacility() != null) {
            facilityRepository.deleteById(professionalEntity.getFacility().getId());
        }
        LOGGER.info("Profissional deletado com sucesso: {}", email);
        return true;
    }

    @SuppressWarnings("java:S2139")
    public ProfessionalResponse login(LoginDTO loginDTO) {
        LOGGER.info("Tentando login de profissional com CPF: {}", loginDTO.getCpf());
        if (loginDTO.getCpf() == null || loginDTO.getPassword() == null) {
            LOGGER.error("CPF ou senha ausentes no login");
            throw new UserManagementException("Dados de login inválidos: CPF ou senha ausentes", "INVALID_INPUT");
        }

        try {
            Optional<ProfessionalEntity> professionalOpt = professionalRepository.findByCpf(loginDTO.getCpf());
            if (professionalOpt.isEmpty()) {
                LOGGER.warn("Profissional não encontrado para CPF: {}", loginDTO.getCpf());
                throw new UserManagementException("Profissional não encontrado", "PROFESSIONAL_NOT_FOUND");
            }

            ProfessionalEntity professional = professionalOpt.get();
            LOGGER.info("Profissional encontrado: {}", professional.getCpf());
            if (professional.getPassword() == null || !professional.getPassword().equals(loginDTO.getPassword())) {
                LOGGER.warn("Senha inválida ou ausente para CPF: {}", loginDTO.getCpf());
                throw new UserManagementException("Senha inválida", "INVALID_PASSWORD");
            }

            LOGGER.info("Login bem-sucedido para CPF: {}", loginDTO.getCpf());
            return professionalMapper.toResponse(professional);
        } catch (IllegalArgumentException e) {
            LOGGER.error("Dados inválidos ao realizar login com CPF: {}. Detalhes: {}", loginDTO.getCpf(), e.getMessage(), e);
            throw new UserManagementException("Dados inválidos fornecidos para login com CPF: " + loginDTO.getCpf() + ". Detalhes: " + e.getMessage(), "INVALID_INPUT", e);
        } catch (Exception e) {
            LOGGER.error("Erro inesperado ao realizar login com CPF: {}. Detalhes: {}", loginDTO.getCpf(), e.getMessage(), e);
            throw new UserManagementException("Erro interno ao realizar login com CPF: " + loginDTO.getCpf() + ". Contate o suporte. Erro: " + e.getClass().getSimpleName() + " - " + e.getMessage(), "LOGIN_ERROR", e);
        }
    }
}