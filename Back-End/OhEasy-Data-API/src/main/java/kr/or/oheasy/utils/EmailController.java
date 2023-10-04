package kr.or.oheasy.utils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.or.oheasy.sd.service.SdService;

@RestController
@RequestMapping("/api2/util")
public class EmailController {

    @Autowired
    private EmailService emailService;
    
    @Autowired
    private SdService sdService;

    @PostMapping("/sendSalaryEmail")
    public String sendEmail() {
    	System.out.println("오니??");
        try {
            String html = FileUtil.readHtmlFile("src/main/resources/static/email.html");

            // 여기서 파라미터 대체
            html = html.replace("{{nmEmp}}", "홍길동")
                    .replace("{{yyAllowance}}", "2023")
                    .replace("{{mmBelong}}", "10")
                    .replace("{{amtAllowance}}", "2000000")
                    .replace("{{nationalPension}}", "200000")
                    .replace("{{healthInsurance}}", "150000")
                    .replace("{{longtermNursingInsurance}}", "50000")
                    .replace("{{employmentInsurance}}", "50000")
                    .replace("{{incomeTax}}", "100000")
                    .replace("{{localIncomeTax}}", "50000")
                    .replace("{{totalTax}}", "650000")
                    .replace("{{actualSalary}}", "1350000");

            emailService.sendMail("parksungh12@naver.com", "급여명세서", html);
            return "Email sent successfully!";
        } catch (Exception e) {
            e.printStackTrace();
            return "Failed to send email.";
        }
    }
}
