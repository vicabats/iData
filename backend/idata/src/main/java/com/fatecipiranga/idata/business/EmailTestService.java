package com.fatecipiranga.idata.business;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailTestService {
    private final JavaMailSender mailSender;

    public EmailTestService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void testEmail(String toEmail) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Teste de E-mail");
        message.setText("Este é um teste de envio de e-mail.");
        try {
            mailSender.send(message);
            System.out.println("E-mail enviado com sucesso para: " + toEmail);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
