package com.fatecipiranga.idata.business;

import com.fatecipiranga.idata.api.converter.ExamMapper;
import com.fatecipiranga.idata.api.response.SharedExamResponse;
import com.fatecipiranga.idata.infrastructure.entity.ExamEntity;
import com.fatecipiranga.idata.infrastructure.entity.ExamStatus;
import com.fatecipiranga.idata.infrastructure.entity.UsuarioEntity;
import com.fatecipiranga.idata.infrastructure.exceptions.ExamManagementException;
import com.fatecipiranga.idata.infrastructure.repository.ExamRepository;
import com.fatecipiranga.idata.infrastructure.repository.ProfessionalRepository;
import com.fatecipiranga.idata.infrastructure.repository.UsuarioRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class ExamService {
    private static final Logger LOGGER = LoggerFactory.getLogger(ExamService.class);

    private static final String USER_NOT_FOUND = "USER_NOT_FOUND";
    private static final String PROFESSIONAL_NOT_FOUND = "PROFESSIONAL_NOT_FOUND";
    private static final String EXAM_NOT_FOUND = "EXAM_NOT_FOUND";
    private static final String SHARED_EXAM_NOT_FOUND = "SHARED_EXAM_NOT_FOUND";
    private static final String SHARED_EXAM_EXPIRED = "SHARED_EXAM_EXPIRED";
    private static final String EXAM_ID_PREFIX = "Exame ID: ";
    private static final String NOT_FOUND_SUFFIX = " não encontrado";

    private final ExamRepository examRepository;
    private final UsuarioRepository usuarioRepository;
    private final ProfessionalRepository professionalRepository;
    private final ExamMapper examMapper;

    public ExamService(
            ExamRepository examRepository,
            UsuarioRepository usuarioRepository,
            ProfessionalRepository professionalRepository,
            ExamMapper examMapper) {
        this.examRepository = examRepository;
        this.usuarioRepository = usuarioRepository;
        this.professionalRepository = professionalRepository;
        this.examMapper = examMapper;
    }

    public void shareExam(String userCpf, String examId, String professionalEmail) {
        LOGGER.info("Iniciando compartilhamento: CPF={}, ExamId={}, Email={}", userCpf, examId, professionalEmail);

        // Validate user
        UsuarioEntity personal = usuarioRepository.findByCpf(userCpf)
                .orElseThrow(() -> new ExamManagementException(
                        "Usuário com CPF " + userCpf + NOT_FOUND_SUFFIX, USER_NOT_FOUND));
        LOGGER.info("Usuário encontrado: id={}", personal.getId());

        // Validate professional
        professionalRepository.findByEmail(professionalEmail)
                .orElseThrow(() -> new ExamManagementException(
                        "Ops, seu médico ainda não está cadastrado no iData!", PROFESSIONAL_NOT_FOUND));

        // Validate exam
        LOGGER.info("Buscando exame: examId={}, personalId={}", examId, personal.getId());
        ExamEntity exam = examRepository.findByIdAndPersonalId(examId, personal.getId())
                .orElseThrow(() -> new ExamManagementException(
                        EXAM_ID_PREFIX + examId + NOT_FOUND_SUFFIX + " ou não pertence ao usuário CPF: " + userCpf,
                        EXAM_NOT_FOUND));
        LOGGER.info("Exame encontrado: id={}", exam.getId());

        ExamEntity sharedExam = new ExamEntity();
        sharedExam.setId(UUID.randomUUID().toString());
        sharedExam.setExamId(examId);
        sharedExam.setProfessionalId(professionalRepository.findByEmail(professionalEmail).get().getId());
        sharedExam.setPersonalId(personal.getId());
        sharedExam.setSharingDate(LocalDateTime.now());

        examRepository.save(sharedExam);
        LOGGER.info("Exame ID: {} compartilhado com sucesso", examId);
    }

    public List<SharedExamResponse> getVisibleSharedExams(String professionalId) {
        LOGGER.info("Buscando exames compartilhados visíveis para profissional ID: {}", professionalId);
        
        validateProfessional(professionalId);
        
        List<ExamEntity> sharedExams = examRepository
                .findByProfessionalIdAndStatus(professionalId, ExamStatus.VISIBLE.name());
        
        return sharedExams.stream()
                .map(sharedExam -> {
                    ExamEntity exam = examRepository.findById(sharedExam.getExamId())
                            .orElseThrow(() -> new ExamManagementException(
                                    EXAM_ID_PREFIX + sharedExam.getExamId() + NOT_FOUND_SUFFIX, EXAM_NOT_FOUND));
                    UsuarioEntity personal = usuarioRepository.findById(sharedExam.getPersonalId())
                            .orElseThrow(() -> new ExamManagementException(
                                    "Usuário ID: " + sharedExam.getPersonalId() + NOT_FOUND_SUFFIX, 
                                    USER_NOT_FOUND));
                    return examMapper.toResponse(sharedExam, exam, personal);
                })
                .toList();
    }

    public SharedExamResponse getSharedExamDetails(String professionalId, String examId) {
        LOGGER.info("Buscando detalhes do exame compartilhado ID: {} para profissional ID: {}", 
                examId, professionalId);
        
        validateProfessional(professionalId);
        
        ExamEntity sharedExam = examRepository.findByExamIdAndProfessionalId(examId, professionalId);
        if (sharedExam == null) {
            throw new ExamManagementException(
                    EXAM_ID_PREFIX + examId + NOT_FOUND_SUFFIX + " para profissional ID: " + professionalId,
                    SHARED_EXAM_NOT_FOUND);
        }
        
        if (sharedExam.getStatus() != ExamStatus.VISIBLE) {
            throw new ExamManagementException(
                    "O compartilhamento do exame ID: " + examId + " está expirado",
                    SHARED_EXAM_EXPIRED);
        }

        ExamEntity exam = examRepository.findById(sharedExam.getExamId())
                .orElseThrow(() -> new ExamManagementException(
                        EXAM_ID_PREFIX + examId + NOT_FOUND_SUFFIX, 
                        EXAM_NOT_FOUND));
        
        UsuarioEntity personal = usuarioRepository.findById(sharedExam.getPersonalId())
                .orElseThrow(() -> new ExamManagementException(
                        "Usuário ID: " + sharedExam.getPersonalId() + NOT_FOUND_SUFFIX, 
                        USER_NOT_FOUND));

        return examMapper.toResponse(sharedExam, exam, personal);
    }

    private void validateProfessional(String professionalId) {
        if (!professionalRepository.findById(professionalId).isPresent()) {
            throw new ExamManagementException(
                    "Profissional ID: " + professionalId + NOT_FOUND_SUFFIX,
                    PROFESSIONAL_NOT_FOUND);
        }
    }
}