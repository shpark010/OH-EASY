package kr.or.oheasy.utils;

import java.io.IOException;
import java.util.Base64;
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
    public ResponseEntity<?> downloadFile(@RequestBody Map<String, String> pdfData) throws IOException {
		// 사원코드
		String code = pdfData.get("code");
		// 연도
		String yyAllowance = pdfData.get("belongingDate").toString().substring(0, 4);
		// 귀속월
		String mmBelong = pdfData.get("belongingDate").toString().substring(4, 6);
		// 지급일
		String dtAllowance = pdfData.get("dtAllowance").toString();
		Map<String, Object> response = new HashMap<>();
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
			System.out.println("pdfInfo 받기 오류");
		}
			
		
		
		Map<String,String> empInfo = new HashMap<>();
		empInfo.put("cdEmp", pdfInfo.getCdEmp());
		empInfo.put("nmEmp", pdfInfo.getNmEmp());
		empInfo.put("yyAllowance", yyAllowance);
		empInfo.put("mmBelong", mmBelong);
		

        Map<String, String> dataMap = new HashMap<>();
        
        dataMap.put("195,747,1", pdfInfo.getYyAllowance()); 					//년도
        dataMap.put("262,747,1", pdfInfo.getMmBelong());						//지급월
        dataMap.put("467,692,1", pdfInfo.getDtAllowance()); 					//지급일
        
        dataMap.put("94,669,1", pdfInfo.getCdEmp()); 						//사원코드
        dataMap.put("237,669,1", pdfInfo.getNmEmp()); 						//사원명
        dataMap.put("400,669,1", pdfInfo.getDtBirth()); 					//생년월일
        dataMap.put("87,653,1", pdfInfo.getNmDept()); 						//부서명
        dataMap.put("235,653,1", pdfInfo.getNmPosition()); 					//직급명
        dataMap.put("395,653,1", pdfInfo.getDtHire()); 						//입사일
        
        dataMap.put("210,560,1", formatPrice.formatMoney(pdfInfo.getAmtAllowance())); 				//기본급
        dataMap.put("210,235,1", formatPrice.formatMoney(pdfInfo.getAmtAllowance())); 				//지급액 계
        
        dataMap.put("463,560,1", formatPrice.formatMoney(pdfInfo.getNationalPension())); 			//국민연금
        dataMap.put("463,535,1", formatPrice.formatMoney(pdfInfo.getHealthInsurance())); 			//건강보험
        dataMap.put("466,511,1", formatPrice.formatMoney(pdfInfo.getLongtermNursingInsurance())); 	//장기요양보험
        dataMap.put("466,484,1", formatPrice.formatMoney(pdfInfo.getEmploymentInsurance())); 		//고용보험
        dataMap.put("463,459,1", formatPrice.formatMoney(pdfInfo.getIncomeTax())); 					//소득세
        dataMap.put("466,432,1", formatPrice.formatMoney(pdfInfo.getLocalIncomeTax())); 				//지방소득세
        dataMap.put("463,253,1", formatPrice.formatMoney(pdfInfo.getTotalDeduct())); 				//공제액 계
        dataMap.put("460,235,1", formatPrice.formatMoney(pdfInfo.getNetPay()));						//차인지급액(실수령액) 
        dataMap.put("460,144,1", formatPrice.formatMoney(pdfInfo.getNetPay())); 						//지급액


        var bis = pdfService.generatePdf(dataMap); // 데이터 값

//        var headers = new HttpHeaders();
//        headers.add("Content-Disposition", "inline; filename=result.pdf");
//
//        return ResponseEntity
//                .ok()
//                .headers(headers)
//                .contentType(MediaType.APPLICATION_PDF)
//                .body(new InputStreamResource(bis));
        byte[] pdfBytes = bis.readAllBytes();
        String base64Pdf = Base64.getEncoder().encodeToString(pdfBytes);
        
        
        response.put("empInfo", empInfo);
        response.put("pdf", base64Pdf);
        
        return ResponseEntity.ok(response);
    }
}


