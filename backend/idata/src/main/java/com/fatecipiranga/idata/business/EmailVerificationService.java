package com.fatecipiranga.idata.business;

import com.fatecipiranga.idata.infrastructure.exceptions.EmailVerificationException;
import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.stereotype.Service;

import java.util.Random;
import java.util.concurrent.TimeUnit;

@Service
public class EmailVerificationService {

    private static final Logger LOGGER = LoggerFactory.getLogger(EmailVerificationService.class);
    private final JavaMailSender mailSender;
    private static final Random RANDOM = new Random();

    public EmailVerificationService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
        LOGGER.info("JavaMailSender injetado: {}", mailSender != null ? "Sim" : "Não");
        if (mailSender instanceof JavaMailSenderImpl impl) {
            LOGGER.info("SMTP Host: {}", impl.getHost());
            LOGGER.info("SMTP Port: {}", impl.getPort());
            LOGGER.info("SMTP Username: {}", impl.getUsername());
            LOGGER.info("SMTP Password: {}", impl.getPassword());
            LOGGER.info("SMTP Properties: {}", impl.getJavaMailProperties());
        }
    }

    private final Cache<String, String> verificationCodes = Caffeine.newBuilder()
            .expireAfterWrite(10, TimeUnit.MINUTES)
            .maximumSize(1000)
            .build();

    public void sendVerificationCode(String email, Object unused) {
        String code = generateCode();
        verificationCodes.put(email, code);
        sendEmail(email, code);
        LOGGER.info("Código de verificação enviado para: {}", email);
    }

    public boolean verifyCode(String email, String code) {
        String storedCode = verificationCodes.getIfPresent(email);
        if (storedCode == null || !storedCode.equals(code)) {
            LOGGER.warn("Código inválido ou expirado para: {}", email);
            return false;
        }
        verificationCodes.invalidate(email);
        LOGGER.info("Código verificado com sucesso para: {}", email);
        return true;
    }

    private String generateCode() {
        int code = 100000 + RANDOM.nextInt(900000);
        return String.valueOf(code);
    }

    private void sendEmail(String email, String code) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Código de Verificação - iData (Login)");
        message.setText("Seu código de verificação para login é: " + code + "\nValidade: 10 minutos.");
        try {
            LOGGER.debug("Tentando enviar e-mail para: {}", email);
            mailSender.send(message);
            LOGGER.debug("E-mail enviado com sucesso para: {}", email);
        } catch (MailException e) {
            LOGGER.error("Erro ao enviar e-mail para: {}. Mensagem: {}. Classe da exceção: {}. Stacktrace: ",
                    email, e.getMessage(), e.getClass().getName(), e);
            String errorMessage = e.getMessage() != null ? e.getMessage() : "Erro desconhecido no envio do e-mail";
            throw new EmailVerificationException("Falha ao enviar código de verificação: " + errorMessage, "EMAIL_SEND_ERROR", e);
        }
    }
}