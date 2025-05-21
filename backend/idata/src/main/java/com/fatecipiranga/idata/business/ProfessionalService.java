package com.fatecipiranga.idata.business;

import com.fatecipiranga.idata.api.request.LoginDTO;
import com.fatecipiranga.idata.api.request.ProfessionalDTO;
import com.fatecipiranga.idata.api.response.ProfessionalResponse;
import com.fatecipiranga.idata.api.converter.ProfessionalMapper;
import com.fatecipiranga.idata.infrastructure.entity.AddressEntity;
import com.fatecipiranga.idata.infrastructure.entity.ProfessionalEntity;
import com.fatecipiranga.idata.infrastructure.exceptions.UserManagementException;
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
    private static final String PROFESSIONAL_NOT_FOUND_FOR_CPF_LOG = "Profissional não encontrado para CPF: {}";
    private static final String INVALID_TYPE = "Tipo de usuário deve ser 'professional'";

    private final ProfessionalRepository professionalRepository;
    private final ProfessionalMapper professionalMapper;

    public ProfessionalService(ProfessionalRepository professionalRepository, ProfessionalMapper professionalMapper) {
        this.professionalRepository = professionalRepository;
        this.professionalMapper = professionalMapper;
    }

    public ProfessionalResponse createProfessional(ProfessionalDTO professionalDTO) {
        LOGGER.info("Iniciando criação de profissional");
        if (professionalDTO == null) {
            LOGGER.error("ProfessionalDTO recebido é null");
            throw new UserManagementException("Dados do profissional não fornecidos", "INVALID_INPUT");
        }
        if (!"professional".equals(professionalDTO.getType())) {
            LOGGER.error("Tipo inválido: {}", professionalDTO.getType());
            throw new UserManagementException(INVALID_TYPE, "INVALID_TYPE");
        }
        LOGGER.info("Processando CPF: {}", professionalDTO.getCpf());
        if (professionalRepository.findByCpf(professionalDTO.getCpf()).isPresent()) {
            throw new UserManagementException("CPF já cadastrado como profissional", "CPF_ALREADY_EXISTS");
        }
        if (professionalRepository.findByEmail(professionalDTO.getEmail()).isPresent()) {
            throw new UserManagementException("Email já cadastrado como profissional", "EMAIL_ALREADY_EXISTS");
        }

        ProfessionalEntity professionalEntity = professionalMapper.toEntity(professionalDTO);
        professionalEntity.setId(UUID.randomUUID().toString());
        professionalEntity.setRegistrationDate(LocalDateTime.now());

        if (professionalDTO.getAddress() != null) {
            AddressEntity address = professionalMapper.addressDtoToEntity(professionalDTO.getAddress());
            address.setId(UUID.randomUUID().toString());
            professionalEntity.setAddress(address);
        }

        professionalEntity = professionalRepository.save(professionalEntity);
        LOGGER.info("Profissional criado com sucesso: {}", professionalEntity.getCpf());
        return professionalMapper.toResponse(professionalEntity);
    }

    public Optional<ProfessionalResponse> getProfessionalByEmail(String email) {
        LOGGER.info("Buscando profissional pelo email: {}", email);
        Optional<ProfessionalEntity> professional = professionalRepository.findByEmail(email);
        return professional.map(professionalMapper::toResponse);
    }

    public Optional<ProfessionalResponse> getProfessionalByCpf(String cpf) {
        LOGGER.info("Buscando profissional pelo CPF: {}", cpf);
        Optional<ProfessionalEntity> professional = professionalRepository.findByCpf(cpf);
        return professional.map(professionalMapper::toResponse);
    }

    public ProfessionalResponse updateProfessional(String cpf, ProfessionalDTO professionalDTO) {
        LOGGER.info("Atualizando profissional com CPF: {}", cpf);
        Optional<ProfessionalEntity> existingProfessional = professionalRepository.findByCpf(cpf);
        if (existingProfessional.isEmpty()) {
            throw new UserManagementException("Profissional não encontrado para atualização", "PROFESSIONAL_NOT_FOUND");
        }

        Optional<ProfessionalEntity> professionalByCpf = professionalRepository.findByCpf(professionalDTO.getCpf());
        if (professionalByCpf.isPresent() && !professionalByCpf.get().getId().equals(existingProfessional.get().getId())) {
            throw new UserManagementException("CPF já cadastrado como outro profissional", "CPF_ALREADY_EXISTS");
        }
        if (!"professional".equals(professionalDTO.getType())) {
            LOGGER.error("Tipo inválido: {}", professionalDTO.getType());
            throw new UserManagementException(INVALID_TYPE, "INVALID_TYPE");
        }
        Optional<ProfessionalEntity> professionalByEmail = professionalRepository.findByEmail(professionalDTO.getEmail());
        if (professionalByEmail.isPresent() && !professionalByEmail.get().getId().equals(existingProfessional.get().getId())) {
            throw new UserManagementException("Email já cadastrado como outro profissional", "EMAIL_ALREADY_EXISTS");
        }

        ProfessionalEntity professionalEntity = professionalMapper.toEntity(professionalDTO);
        professionalEntity.setId(existingProfessional.get().getId());
        professionalEntity.setRegistrationDate(existingProfessional.get().getRegistrationDate());

        if (professionalDTO.getAddress() != null) {
            AddressEntity address = professionalMapper.addressDtoToEntity(professionalDTO.getAddress());
            address.setId(existingProfessional.get().getAddress() != null ? existingProfessional.get().getAddress().getId() : UUID.randomUUID().toString());
            professionalEntity.setAddress(address);
        } else {
            professionalEntity.setAddress(existingProfessional.get().getAddress());
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
        LOGGER.info("Profissional deletado com sucesso: {}", email);
        return true;
    }

    public ProfessionalResponse login(LoginDTO loginDTO) {
        LOGGER.info("Tentando login de profissional com CPF: {}", loginDTO.getCpf());
        if (loginDTO.getCpf() == null || loginDTO.getPassword() == null) {
            LOGGER.error("CPF ou senha ausentes no login");
            throw new UserManagementException("Dados de login inválidos: CPF ou senha ausentes", "INVALID_INPUT");
        }

        Optional<ProfessionalEntity> professionalOpt = professionalRepository.findByCpf(loginDTO.getCpf());
        if (professionalOpt.isEmpty()) {
            LOGGER.warn(PROFESSIONAL_NOT_FOUND_FOR_CPF_LOG, loginDTO.getCpf());
            throw new UserManagementException("Profissional não encontrado", "PROFESSIONAL_NOT_FOUND");
        }

        ProfessionalEntity professional = professionalOpt.get();
        if (!professional.getPassword().equals(loginDTO.getPassword())) {
            LOGGER.warn("Senha inválida para CPF: {}", loginDTO.getCpf());
            throw new UserManagementException("Senha inválida", "INVALID_PASSWORD");
        }

        LOGGER.info("Login bem-sucedido para CPF: {}", loginDTO.getCpf());
        return professionalMapper.toResponse(professional);
    }

    public void verifyCredentials(String cpf, String password) {
        LOGGER.info("Verificando credenciais para CPF: {}", cpf);
        Optional<ProfessionalEntity> professional = professionalRepository.findByCpf(cpf);
        if (professional.isEmpty()) {
            LOGGER.warn(PROFESSIONAL_NOT_FOUND_FOR_CPF_LOG, cpf);
            throw new UserManagementException("Profissional não encontrado", "PROFESSIONAL_NOT_FOUND");
        }
        if (!professional.get().getPassword().equals(password)) {
            LOGGER.warn("Senha inválida para CPF: {}", cpf);
            throw new UserManagementException("Senha inválida", "INVALID_PASSWORD");
        }
    }

    public String getEmailByCpf(String cpf) {
        LOGGER.info("Buscando email pelo CPF: {}", cpf);
        Optional<ProfessionalEntity> professional = professionalRepository.findByCpf(cpf);
        if (professional.isEmpty()) {
            LOGGER.warn(PROFESSIONAL_NOT_FOUND_FOR_CPF_LOG, cpf);
            throw new UserManagementException("Profissional não encontrado", "PROFESSIONAL_NOT_FOUND");
        }
        return professional.get().getEmail();
    }
}