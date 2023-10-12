package kr.or.oheasy.utils;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.itextpdf.io.IOException;






	
@RestController
@RequestMapping("/api2/util")
@EnableAsync
public class WcEmailController {
    @Autowired
    private WcEmailService wcemailService;
    


//    @PostMapping("/workContractEmail")
//    public ResponseEntity<?> sendEmail(@RequestBody Map<String, Object> emailData) {
//        try {
//            String responseMessage = wcemailService.sendEmailToEmployees(emailData);
//            return ResponseEntity.ok().body(responseMessage);
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
//        }
//    }
    
    @PostMapping("/workContractEmail")
    public SseEmitter sendEmail(@RequestBody Map<String, Object> emailData) throws Exception {
        SseEmitter emitter = new SseEmitter();

        wcemailService.sendEmailToEmployees(emailData).thenAccept(responseMessage -> {
            try {
                emitter.send(responseMessage);
                emitter.complete();
            } catch (IOException e) {
                emitter.completeWithError(e);
            } catch (java.io.IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
        }).exceptionally(ex -> {
            try {
                emitter.send(SseEmitter.event().name("error").data(ex.getMessage()));
            } catch (IOException e) {
                emitter.completeWithError(e);
            } catch (java.io.IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
            return null;
        });

        return emitter;
    }
}
