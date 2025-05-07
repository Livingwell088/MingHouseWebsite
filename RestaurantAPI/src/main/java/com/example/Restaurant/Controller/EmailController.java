package com.example.Restaurant.Controller;
import com.example.Restaurant.Service.EmailService;
import org.springframework.stereotype.Component;


@Component
public class EmailController {
    private final EmailService emailService;

    public EmailController(EmailService emailService) {
        this.emailService = emailService;
    }

    public void myMethod() {
        // ... your logic ...
        String recipientEmail = "Livingwell088@gmail.com";
        String emailSubject = "Testing";
        String emailBody = "Testing";
        emailService.sendEmail(recipientEmail, emailSubject, emailBody);
    }
}



//@Component
//public class MyComponent {
//
//
//}