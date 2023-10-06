package kr.or.oheasy.utils;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.or.oheasy.sd.service.SdService;
import kr.or.oheasy.vo.SdPdfInfoVO;

@RestController
@RequestMapping("/api2/util")
public class PdfController {

    @Autowired
    private PdfService pdfService;
    
    @Autowired
    private SdService sdService;

    @PostMapping("/salaryPdf")
    public ResponseEntity<InputStreamResource> downloadFile(@RequestBody Map<String, String> pdfData) throws IOException {
		// 사원코드
		String code = pdfData.get("code");
		// 연도
		String yyAllowance = pdfData.get("belongingDate").toString().substring(0, 4);
		// 귀속월
		String mmBelong = pdfData.get("belongingDate").toString().substring(4, 6);
		// 지급일
		String dtAllowance = pdfData.get("dtAllowance").toString();
		System.out.println(pdfData);
		SdPdfInfoVO pdfInfo = new SdPdfInfoVO();
		FormatPrice formatPrice = new FormatPrice();
		try {
			Map<String, String> searchData = new HashMap<>();
			searchData.put("yyAllowance", yyAllowance);
			searchData.put("mmBelong", mmBelong);
			searchData.put("dtAllowance", dtAllowance);
			searchData.put("cdEmp", code);
			// 사원정보 가져오기
			pdfInfo = sdService.seletForPdf(searchData);
			System.out.println(pdfInfo);
		} catch (Exception e) {
			e.getMessage();
		}

        Map<String, String> dataMap = new HashMap<>();
        
        dataMap.put("195,748,1", pdfInfo.getYyAllowance()); 					//년도
        dataMap.put("262,748,1", pdfInfo.getMmBelong());						//지급월
        dataMap.put("467,690,1", pdfInfo.getDtAllowance()); 					//지급일
        
        dataMap.put("94,670,1", pdfInfo.getCdEmp()); 						//사원코드
        dataMap.put("237,670,1", pdfInfo.getNmEmp()); 						//사원명
        dataMap.put("400,670,1", pdfInfo.getDtBirth()); 					//생년월일
        dataMap.put("92,660,1", pdfInfo.getNmDept()); 						//부서명
        dataMap.put("237,660,1", pdfInfo.getNmPosition()); 					//직급명
        dataMap.put("397,653,1", pdfInfo.getDtHire()); 						//입사일
        
        dataMap.put("210,560,1", formatPrice.formatMoney(pdfInfo.getAmtAllowance())); 				//기본급
        dataMap.put("210,235,1", formatPrice.formatMoney(pdfInfo.getAmtAllowance())); 				//지급액 계
        
        dataMap.put("450,560,1", formatPrice.formatMoney(pdfInfo.getNationalPension())); 			//국민연금
        dataMap.put("450,535,1", formatPrice.formatMoney(pdfInfo.getHealthInsurance())); 			//건강보험
        dataMap.put("450,510,1", formatPrice.formatMoney(pdfInfo.getLongtermNursingInsurance())); 	//장기요양보험
        dataMap.put("450,485,1", formatPrice.formatMoney(pdfInfo.getEmploymentInsurance())); 		//고용보험
        dataMap.put("450,457,1", formatPrice.formatMoney(pdfInfo.getIncomeTax())); 					//소득세
        dataMap.put("450,430,1", formatPrice.formatMoney(pdfInfo.getLocalIncomeTax())); 				//지방소득세
        dataMap.put("450,253,1", formatPrice.formatMoney(pdfInfo.getTotalDeduct())); 				//공제액 계
        dataMap.put("450,235,1", formatPrice.formatMoney(pdfInfo.getNetPay()));						//차인지급액(실수령액) 
        dataMap.put("460,144,1", formatPrice.formatMoney(pdfInfo.getNetPay())); 						//지급액


        var bis = pdfService.generatePdf(dataMap); // 데이터 값

        var headers = new HttpHeaders();
        headers.add("Content-Disposition", "inline; filename=result.pdf");

        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(bis));
    }
}


