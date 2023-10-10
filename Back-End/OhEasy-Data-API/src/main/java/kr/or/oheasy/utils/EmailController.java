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

import kr.or.oheasy.sd.service.SdService;
import kr.or.oheasy.vo.SdEmailInfoVO;

@RestController
@RequestMapping("/api2/util")
@EnableAsync
public class EmailController {

    @Autowired
    private EmailService emailService;
    
    @Autowired
    private SdService sdService;

    @PostMapping("/sendSalaryEmail")
    public ResponseEntity<?> sendEmail(@RequestBody Map<String, Object> emailData) {
    	Map<String, Object> resultData = new HashMap<>();
		// 사원코드
		List<String> codeList = (List<String>) emailData.get("codeList");
		// 연도
		String yyAllowance = emailData.get("belongingDate").toString().substring(0, 4);
		// 귀속월
		String mmBelong = emailData.get("belongingDate").toString().substring(4, 6);
		// 지급일
		String dtAllowance = emailData.get("dtAllowance").toString();
		List<SdEmailInfoVO> emailInfoList = new ArrayList<>();
		try {
			Map<String, Object> searchData = new HashMap<>();
			searchData.put("yyAllowance", yyAllowance);
			searchData.put("mmBelong", mmBelong);
			searchData.put("dtAllowance", dtAllowance);
			searchData.put("codeList", codeList);
			// 사원정보 가져오기
			emailInfoList = sdService.seletForMail(searchData);
			System.out.println(emailInfoList);
		} catch (Exception e) {
			e.getMessage();
		}
		int sendResult = 0;
		EmailValidator emailValidator = new EmailValidator();
        try {
        	for (SdEmailInfoVO emailInfo : emailInfoList) {
        		String html = FileUtil.readHtmlFile("src/main/resources/static/email.html");
        		if(emailValidator.validate(emailInfo.getNmEmail())) {
        		System.out.println(emailInfo);
        		FormatPrice formatPrice = new FormatPrice();
        		// 여기서 파라미터 대체
        		html = html.replace("{{nmEmp}}", emailInfo.getCdEmp())
        				.replace("{{yyAllowance}}", emailInfo.getYyAllowance())
        				.replace("{{mmBelong}}", emailInfo.getMmBelong())
        				.replace("{{amtAllowance}}", formatPrice.formatMoney(emailInfo.getAmtAllowance()))
        				.replace("{{nationalPension}}", formatPrice.formatMoney(emailInfo.getNationalPension()))
        				.replace("{{healthInsurance}}", formatPrice.formatMoney(emailInfo.getHealthInsurance()))
        				.replace("{{longtermNursingInsurance}}", formatPrice.formatMoney(emailInfo.getLongtermNursingInsurance()))
        				.replace("{{employmentInsurance}}", formatPrice.formatMoney(emailInfo.getEmploymentInsurance()))
        				.replace("{{incomeTax}}", formatPrice.formatMoney(emailInfo.getIncomeTax()))
        				.replace("{{localIncomeTax}}", formatPrice.formatMoney(emailInfo.getLocalIncomeTax()))
        				.replace("{{totalTax}}", formatPrice.formatMoney(emailInfo.getTotalDeduct()))
        				.replace("{{netPay}}", formatPrice.formatMoney(emailInfo.getNetPay()));
        		
        		emailService.sendMail(emailInfo.getNmEmail(), "급여명세서", html);				
        		sendResult++;
        		}
			}
        } catch (Exception e) {
            e.printStackTrace();
        }
        System.out.println(sendResult);
        resultData.put("sendResult", sendResult);
		return new ResponseEntity<>(resultData, HttpStatus.OK);
    }
}
