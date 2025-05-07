package com.example.Restaurant.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.MailParseException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

//    public void sendEmail(String to, String subject, String body) {
//        SimpleMailMessage message = new SimpleMailMessage();
//        message.setTo(to);
//        message.setSubject(subject);
//        message.setText(body);
//        mailSender.send(message);
//    }


    public String sendEmail(String to,String subject, String body){
        String result =null;
        MimeMessage message =mailSender.createMimeMessage();
        try {

            MimeMessageHelper helper = new MimeMessageHelper(message, false, "utf-8");
            String htmlMsg = body;
            message.setContent(htmlMsg, "text/html");
            helper.setTo(to);
            helper.setSubject(subject);
            result="success";
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new MailParseException(e);
        }finally {
            if(result !="success"){
                result="fail";
            }
        }

        return result;

    }
}