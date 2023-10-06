package kr.or.oheasy.utils;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;






	
@RestController
@RequestMapping("/api2/util")
public class WcEmailController {
    @Autowired
    private WcEmailService wcemailService;
    

    @PostMapping("/workContractEmail")
    public ResponseEntity<?> sendEmail(@RequestBody Map<String, Object> emailData) {
        
        try {
            String responseMessage = wcemailService.sendEmailToEmployees(emailData);
            if ("Emails sent successfully".equals(responseMessage)) {
                return ResponseEntity.ok().body(responseMessage);
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseMessage);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}
