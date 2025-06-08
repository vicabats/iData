package com.fatecipiranga.idata.business;

import com.fatecipiranga.idata.api.converter.SharedExamMapper;
import com.fatecipiranga.idata.api.enums.SharedExamStatus;
import com.fatecipiranga.idata.api.request.ShareExamRequest;
import com.fatecipiranga.idata.api.response.SharedExamResponse;
import com.fatecipiranga.idata.infrastructure.entity.CompartilhamentoExame;
import com.fatecipiranga.idata.infrastructure.entity.ExameEntity;
import com.fatecipiranga.idata.infrastructure.entity.ProfessionalEntity;
import com.fatecipiranga.idata.infrastructure.entity.UsuarioEntity;
import com.fatecipiranga.idata.infrastructure.exceptions.ExameManagementException;
import com.fatecipiranga.idata.infrastructure.repository.CompartilhamentoExameRepository;
import com.fatecipiranga.idata.infrastructure.repository.ExameRepository;
import com.fatecipiranga.idata.infrastructure.repository.ProfessionalRepository;
import com.fatecipiranga.idata.infrastructure.repository.UsuarioRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class SharedExamService {

    private static final Logger LOGGER = LoggerFactory.getLogger(SharedExamService.class);
    private static final String NOT_FOUND_SUFFIX = " não encontrado";
    private static final String USER_NOT_FOUND_CODE = "USER_NOT_FOUND";
    private static final String EXAM_ID_PREFIX = "Exame ID: ";
    private static final String EXAM_NOT_FOUND_CODE = "EXAME_NOT_FOUND";
    private static final String PROFESSIONAL_NOT_FOUND_CODE = "PROFESSIONAL_NOT_FOUND";

    private final CompartilhamentoExameRepository compartilhamentoExameRepository;
    private final ExameRepository exameRepository;
    private final ProfessionalRepository professionalRepository;
    private final UsuarioRepository usuarioRepository;
    private final SharedExamMapper sharedExamMapper;

    public SharedExamService(CompartilhamentoExameRepository compartilhamentoExameRepository,
                             ExameRepository exameRepository,
                             ProfessionalRepository professionalRepository,
                             UsuarioRepository usuarioRepository,
                             SharedExamMapper sharedExamMapper) {
        this.compartilhamentoExameRepository = compartilhamentoExameRepository;
        this.exameRepository = exameRepository;
        this.professionalRepository = professionalRepository;
        this.usuarioRepository = usuarioRepository;
        this.sharedExamMapper = sharedExamMapper;
    }

    public void shareExam(String userCPF, String examId, ShareExamRequest request) {
        LOGGER.info("Iniciando compartilhamento do exame ID: {} pelo usuário CPF: {} para o e-mail: {}",
                examId, userCPF, request.getProfessionalEmail());

        // Valida usuário
        UsuarioEntity personal = usuarioRepository.findByCpf(userCPF)
                .orElseThrow(() -> new ExameManagementException("Usuário com CPF: " + userCPF + NOT_FOUND_SUFFIX, USER_NOT_FOUND_CODE));
        LOGGER.debug("Usuário encontrado: {}", personal.getId());

        // Valida exame
        ExameEntity exame = exameRepository.findByIdAndUserId(examId, personal.getId())
                .orElseThrow(() -> new ExameManagementException(
                        EXAM_ID_PREFIX + examId + " não encontrado ou não pertence ao usuário CPF: " + userCPF,
                        EXAM_NOT_FOUND_CODE));
        LOGGER.debug("Exame encontrado: {}", exame.getId());

        // Valida profissional
        ProfessionalEntity profissional = professionalRepository.findByEmail(request.getProfessionalEmail())
                .orElseThrow(() -> new ExameManagementException(
                        "Ops, seu médico ainda não está cadastrado no iData!",
                        PROFESSIONAL_NOT_FOUND_CODE));
        LOGGER.debug("Profissional encontrado: {}", profissional.getId());

        // Cria compartilhamento
        CompartilhamentoExame compartilhamento = new CompartilhamentoExame();
        compartilhamento.setId(UUID.randomUUID().toString());
        compartilhamento.setExameId(exame.getId());
        compartilhamento.setProfissionalId(profissional.getId());
        compartilhamento.setDataCompartilhamento(LocalDateTime.now());
        LOGGER.debug("Compartilhamento criado: {}", compartilhamento.getId());

        // Salva compartilhamento
        compartilhamentoExameRepository.save(compartilhamento);
        LOGGER.info("Exame ID: {} compartilhado com sucesso para profissional ID: {}", examId, profissional.getId());
    }

    public List<SharedExamResponse> getSharedExams(String professionalId) {
        LOGGER.info("Buscando exames compartilhados para o profissional ID: {}", professionalId);

        professionalRepository.findById(professionalId)
                .orElseThrow(() -> new ExameManagementException(
                        "Profissional ID: " + professionalId + NOT_FOUND_SUFFIX,
                        PROFESSIONAL_NOT_FOUND_CODE));

        List<CompartilhamentoExame> compartilhamentos = compartilhamentoExameRepository.findByProfissionalId(professionalId);

        return compartilhamentos.stream()
                .filter(comp -> comp.getStatus() == SharedExamStatus.VISIBLE)
                .map(comp -> {
                    ExameEntity exame = exameRepository.findById(comp.getExameId())
                            .orElseThrow(() -> new ExameManagementException(
                                    EXAM_ID_PREFIX + comp.getExameId() + NOT_FOUND_SUFFIX,
                                    EXAM_NOT_FOUND_CODE));
                    UsuarioEntity personal = usuarioRepository.findById(exame.getUserId())
                            .orElseThrow(() -> new ExameManagementException(
                                    "Usuário ID: " + exame.getUserId() + NOT_FOUND_SUFFIX,
                                    USER_NOT_FOUND_CODE));
                    return sharedExamMapper.toResponse(comp, exame, personal);
                })
                .toList();
    }

    public SharedExamResponse getSharedExamById(String professionalId, String examId) {
        LOGGER.info("Buscando exame compartilhado ID: {} para profissional ID: {}", examId, professionalId);

        professionalRepository.findById(professionalId)
                .orElseThrow(() -> new ExameManagementException(
                        "Profissional ID: " + professionalId + NOT_FOUND_SUFFIX,
                        PROFESSIONAL_NOT_FOUND_CODE));

        List<CompartilhamentoExame> compartilhamentos = compartilhamentoExameRepository
                .findByExameIdAndProfissionalId(examId, professionalId);

        if (compartilhamentos.isEmpty()) {
            throw new ExameManagementException(
                    EXAM_ID_PREFIX + examId + " não foi compartilhado com o profissional ID: " + professionalId,
                    "SHARED_EXAM_NOT_FOUND");
        }

        CompartilhamentoExame compartilhamento = compartilhamentos.get(0);
        if (compartilhamento.getStatus() != SharedExamStatus.VISIBLE) {
            throw new ExameManagementException(
                    "O compartilhamento do exame ID: " + examId + " expirou",
                    "SHARED_EXAM_EXPIRED");
        }

        ExameEntity exame = exameRepository.findById(compartilhamento.getExameId())
                .orElseThrow(() -> new ExameManagementException(
                        EXAM_ID_PREFIX + compartilhamento.getExameId() + NOT_FOUND_SUFFIX,
                        EXAM_NOT_FOUND_CODE));
        UsuarioEntity personal = usuarioRepository.findById(exame.getUserId())
                .orElseThrow(() -> new ExameManagementException(
                        "Usuário ID: " + exame.getUserId() + NOT_FOUND_SUFFIX,
                        USER_NOT_FOUND_CODE));

        return sharedExamMapper.toResponse(compartilhamento, exame, personal);
    }
}