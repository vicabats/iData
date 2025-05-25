package com.fatecipiranga.idata.business;

import com.fatecipiranga.idata.api.request.ExameDTO;
import com.fatecipiranga.idata.api.response.ExameResponse;
import com.fatecipiranga.idata.api.converter.ExameMapper;
import com.fatecipiranga.idata.api.enums.ExamType;
import com.fatecipiranga.idata.infrastructure.entity.ExameEntity;
import com.fatecipiranga.idata.infrastructure.exceptions.ExameManagementException;
import com.fatecipiranga.idata.infrastructure.repository.ExameRepository;
import com.fatecipiranga.idata.infrastructure.repository.ProfessionalRepository;
import com.fatecipiranga.idata.infrastructure.repository.UsuarioRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class ExameService {

    private static final Logger LOGGER = LoggerFactory.getLogger(ExameService.class);
    private static final String[] ALLOWED_MIME_TYPES = {"application/pdf", "image/jpeg"};

    private final ExameRepository exameRepository;
    private final UsuarioRepository usuarioRepository;
    private final ProfessionalRepository professionalRepository;
    private final ExameMapper exameMapper;

    public ExameService(ExameRepository exameRepository,
                        UsuarioRepository usuarioRepository,
                        ProfessionalRepository professionalRepository,
                        ExameMapper exameMapper) {
        this.exameRepository = exameRepository;
        this.usuarioRepository = usuarioRepository;
        this.professionalRepository = professionalRepository;
        this.exameMapper = exameMapper;
    }

    public ExameResponse createExame(ExameDTO exameDTO, MultipartFile file) {
        LOGGER.info("Iniciando criação de exame para o usuário: {}", exameDTO.getUserId());
        validateUser(exameDTO.getUserId());
        validateFile(file);
        validateExamType(exameDTO.getType());

        ExameEntity exameEntity = exameMapper.toEntity(exameDTO);
        exameEntity.setId(UUID.randomUUID().toString());
        exameEntity.setMimeType(file.getContentType());
        exameEntity.setUploadDate(LocalDateTime.now());

        try {
            exameEntity.setContent(file.getBytes());
        } catch (IOException e) {
            LOGGER.error("Erro ao converter arquivo '{}' para bytes para usuário ID: {}. Detalhes: {}",
                    exameDTO.getFile(), exameDTO.getUserId(), e.getMessage(), e);
            throw new ExameManagementException(
                    "Erro ao processar arquivo '" + exameDTO.getFile() + "' para usuário ID: " + exameDTO.getUserId(),
                    "FILE_PROCESSING_ERROR", e);
        }

        exameEntity = exameRepository.save(exameEntity);
        LOGGER.info("Exame salvo com sucesso: {}", exameEntity.getId());
        return exameMapper.toResponse(exameEntity);
    }

    public ExameResponse updateExame(String examId, String userId, ExameDTO exameDTO) {
        LOGGER.info("Atualizando exame ID: {} para usuário: {}", examId, userId);
        validateUser(userId);
        validateExamType(exameDTO.getType());

        ExameEntity exame = exameRepository.findByIdAndUserId(examId, userId)
                .orElseThrow(() -> new ExameManagementException(
                        "Exame ID: " + examId + " não encontrado ou não pertence ao usuário ID: " + userId,
                        "EXAME_NOT_FOUND"));

        exame.setType(exameDTO.getType());
        exame.setTitle(exameDTO.getTitle());
        exame.setDescription(exameDTO.getDescription());
        exame.setDate(exameDTO.getDate());
        exame.setFileName(exameDTO.getFile());

        exameRepository.save(exame);
        LOGGER.info("Exame atualizado com sucesso: {}", examId);
        return exameMapper.toResponse(exame);
    }

    public ExameResponse getExameById(String examId, String userId) {
        LOGGER.info("Buscando exame ID: {} para usuário: {}", examId, userId);
        validateUser(userId);

        ExameEntity exame = exameRepository.findByIdAndUserId(examId, userId)
                .orElseThrow(() -> new ExameManagementException(
                        "Exame ID: " + examId + " não encontrado ou não pertence ao usuário ID: " + userId,
                        "EXAME_NOT_FOUND"));

        return exameMapper.toResponse(exame);
    }

    public List<ExameResponse> getExamesByUserId(String userId) {
        LOGGER.info("Buscando exames para o usuário: {}", userId);
        validateUser(userId);
        List<ExameEntity> exames = exameRepository.findByUserId(userId);
        return exames.stream().map(exameMapper::toResponse).toList();
    }

    public void deleteExame(String examId, String userId) {
        LOGGER.info("Deletando exame ID: {} para usuário: {}", examId, userId);
        validateUser(userId);

        ExameEntity exame = exameRepository.findByIdAndUserId(examId, userId)
                .orElseThrow(() -> new ExameManagementException(
                        "Exame ID: " + examId + " não encontrado ou não pertence ao usuário ID: " + userId,
                        "EXAME_NOT_FOUND"));

        exameRepository.delete(exame);
        LOGGER.info("Exame deletado com sucesso: {}", examId);
    }

    public ExameResponse shareExame(String examId, String userId, String professionalId, boolean consentGiven) {
        LOGGER.info("Compartilhando exame ID: {} do usuário: {} com profissional: {}", examId, userId, professionalId);
        validateUser(userId);
        validateProfessional(professionalId);

        ExameEntity exame = exameRepository.findByIdAndUserId(examId, userId)
                .orElseThrow(() -> new ExameManagementException(
                        "Exame ID: " + examId + " não encontrado ou não pertence ao usuário ID: " + userId,
                        "EXAME_NOT_FOUND"));

        if (!consentGiven) {
            throw new ExameManagementException(
                    "Consentimento explícito não fornecido para compartilhar exame ID: " + examId
                            + " com profissional ID: " + professionalId,
                    "CONSENT_REQUIRED");
        }

        exame.setSharedWithProfessionalId(professionalId);
        exame.setConsentGiven(true);
        exameRepository.save(exame);
        LOGGER.info("Exame compartilhado com sucesso: {}", examId);
        return exameMapper.toResponse(exame);
    }

    public List<ExameResponse> getExamesByProfessionalId(String professionalId) {
        LOGGER.info("Buscando exames compartilhados com o profissional: {}", professionalId);
        validateProfessional(professionalId);
        List<ExameEntity> exames = exameRepository.findBySharedWithProfessionalId(professionalId);
        return exames.stream().map(exameMapper::toResponse).toList();
    }

    public ExameEntity downloadExame(String examId, String userId, String professionalId) {
        LOGGER.info("Tentando baixar exame ID: {} para usuário: {} ou profissional: {}", examId, userId, professionalId);
        return validateAccess(examId, userId, professionalId);
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ExameManagementException("Arquivo não fornecido ou vazio", "INVALID_FILE");
        }

        String mimeType = file.getContentType();
        boolean isValidMimeType = false;
        for (String allowedType : ALLOWED_MIME_TYPES) {
            if (allowedType.equals(mimeType)) {
                isValidMimeType = true;
                break;
            }
        }

        if (!isValidMimeType) {
            throw new ExameManagementException(
                    "Formato de arquivo '" + mimeType + "' não permitido. Apenas PDF e JPEG são aceitos.",
                    "INVALID_FILE_TYPE");
        }
    }

    private void validateUser(String userId) {
        if (!usuarioRepository.findById(userId).isPresent()) {
            throw new ExameManagementException("Usuário ID: " + userId + " não encontrado", "USER_NOT_FOUND");
        }
    }

    private void validateProfessional(String professionalId) {
        if (!professionalRepository.findById(professionalId).isPresent()) {
            throw new ExameManagementException("Profissional ID: " + professionalId + " não encontrado",
                    "PROFESSIONAL_NOT_FOUND");
        }
    }

    private void validateExamType(ExamType type) {
        if (type == null) {
            throw new ExameManagementException("Tipo de exame é obrigatório", "INVALID_EXAM_TYPE");
        }
    }

    private ExameEntity validateAccess(String examId, String userId, String professionalId) {
        ExameEntity exame = exameRepository.findById(examId)
                .orElseThrow(() -> new ExameManagementException("Exame ID: " + examId + " não encontrado", "EXAME_NOT_FOUND"));

        if (userId != null && exame.getUserId().equals(userId)) {
            return exame;
        }

        if (professionalId != null &&
            exame.getSharedWithProfessionalId() != null &&
            exame.getSharedWithProfessionalId().equals(professionalId) &&
            exame.isConsentGiven()) {
            return exame;
        }

        throw new ExameManagementException(
                "Acesso não autorizado ao exame ID: " + examId + " para usuário: " + userId
                        + " ou profissional: " + professionalId,
                "UNAUTHORIZED_ACCESS");
    }
}