package kr.or.oheasy.utils;

import java.io.IOException;
import java.util.Base64;
import java.net.URLEncoder;
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

import kr.or.oheasy.hrm.service.HrService;
import kr.or.oheasy.hrm.utils.DepartmentUtil;
import kr.or.oheasy.hrm.utils.FgMilitaryDischargeTypeUtil;
import kr.or.oheasy.hrm.utils.FgMilitaryRankUtil;
import kr.or.oheasy.hrm.utils.FgMilitaryServiceUtil;
import kr.or.oheasy.hrm.utils.FgMilitaryTypeUtil;
import kr.or.oheasy.hrm.utils.PositionUtil;
import kr.or.oheasy.hrm.vo.HrPdfVO;
import kr.or.oheasy.sd.service.SdService;
import kr.or.oheasy.vo.SdPdfInfoVO;

@RestController
@RequestMapping("/api2/util")
public class PdfController {

    @Autowired
    private PdfService pdfService;
    
    @Autowired
    private SdService sdService;
    
    @Autowired
    private HrService hrService;
    

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
    @PostMapping("/hrPdf")
    public ResponseEntity<?> hrDownloadFile(@RequestBody Map<String, String> pdfData) throws IOException {
    	// 사원코드
    	String code = pdfData.get("code");
    	System.out.println(code);
 
    	// pdf 에 넣을 한명의 사원정보 vo 가져오기
    	HrPdfVO hrPdfVO = hrService.getHrPdfData(code);
    	System.out.println(hrPdfVO.getNmHanjaEmp());
    	
    	Map<String, String> dataMap = new HashMap<>();

    	//부서번호를 부서명으로 변환
    	String deptName = DepartmentUtil.getDepartmentName(hrPdfVO.getNoDepartment());	
    	//직급번호를 직급명으로 변환
    	String positionName = PositionUtil.getPositionName(hrPdfVO.getNoPositionUnique());
    	
    	if (hrPdfVO.getPath() != null) {
    	    dataMap.put("imagePath", hrPdfVO.getPath()); // 이미지
    	}
    	// 왼쪽열
    	if (code != null) {
    	    dataMap.put("220,745,1", code); // 사원번호
    	}
    	if (hrPdfVO.getNmHanjaEmp() != null) {
    	    dataMap.put("220,729,1", hrPdfVO.getNmHanjaEmp()); // 성명(한자)
    	}
    	if (deptName != null) {
    	    dataMap.put("220,713,1", deptName); // 부서명
    	}
    	if(hrPdfVO.getNoResident() !=null) {
    		dataMap.put("220,680,1", hrPdfVO.getNoResident()); // 주민번호
    	}
    	if(hrPdfVO.getDtBirth() !=null) {
    		String formattedDate = formatDateWithHyphen(hrPdfVO.getDtBirth());
    		dataMap.put("220,663,1", formattedDate); // 생년월일
    	}
    	if(hrPdfVO.getNoPhone() !=null) {
    		dataMap.put("220,647,1", hrPdfVO.getNoPhone()); // 전화번호
    	}
    	// 오른쪽열
    	if(hrPdfVO.getNmEmp() !=null) {
    		
    		dataMap.put("443,745,1", hrPdfVO.getNmEmp()); // 생년월일
    	}
    	if(hrPdfVO.getNmEngEmp() !=null) {
    		dataMap.put("443,729,1", hrPdfVO.getNmEngEmp()); // 성명(영문)
    	}
    	if(hrPdfVO.getNoPositionUnique() != null) {
    		dataMap.put("443,713,1", positionName); // 직급명
    	}
    	if(hrPdfVO.getDtHire() != null) {
    		String formattedDate = formatDateWithHyphen(hrPdfVO.getDtHire());
    		dataMap.put("443,696,1", formattedDate); // 입사일
    	}
    	if(hrPdfVO.getDtResign() != null) {
    		String formattedDate = formatDateWithHyphen(hrPdfVO.getDtResign());
    		dataMap.put("443,680,1", formattedDate); // 퇴사일
    	}
    	if(hrPdfVO.getNoPhone() !=null) {
    		dataMap.put("443,647,1", hrPdfVO.getNoPhone()); // 휴대폰번호
    	}
    	
    	// 주소 
    	if(hrPdfVO.getNoPost() !=null) {
    		dataMap.put("150,625,1", hrPdfVO.getNoPost()); // 우편번호
    	}
    	
    	if(hrPdfVO.getNmAddress() !=null) {
    		dataMap.put("217,625,1", hrPdfVO.getNmAddress()); // 주소
    	}
    	
    	// 신체
    	if(hrPdfVO.getLenBody() !=null) {
    		dataMap.put("35,538,1", hrPdfVO.getLenBody()); // 키
    	}
    	if(hrPdfVO.getWgtBody() !=null) {
    		dataMap.put("85,538,1", hrPdfVO.getWgtBody() ); // 몸무게
    	}
    	if(hrPdfVO.getNclBloodMin() !=null) {
    		dataMap.put("130,543,1", hrPdfVO.getNclBloodMin()+"~" ); // 최저혈압
    	}
    	if(hrPdfVO.getNclBloodMax() !=null) {
    		dataMap.put("146,543,1", hrPdfVO.getNclBloodMax() ); // 최대혈압
    	}
    	if(hrPdfVO.getLenBust() !=null) {
    		dataMap.put("188,538,1", hrPdfVO.getLenBust() ); // 가슴둘레
    	}
    	
    	if(hrPdfVO.getDcCaseHistory() !=null) {
    		dataMap.put("238,543,1", hrPdfVO.getDcCaseHistory() ); // 병력
    	}
    	if(hrPdfVO.getFgBloodType() !=null) {
    		dataMap.put("385,538,1", hrPdfVO.getFgBloodType() ); // 혈액형
    	}
    	
    	if(hrPdfVO.getFgEye() !=null) {
    		dataMap.put("430,538,1", hrPdfVO.getFgEye() ); // 색신
    	}
    	if(hrPdfVO.getLeftEyesight() !=null) {
    		dataMap.put("470,538,1", hrPdfVO.getLeftEyesight() ); // 좌우
    	}
    	if(hrPdfVO.getRightEyesight() !=null) {
    		dataMap.put("495,538,1", hrPdfVO.getRightEyesight() ); // 좌우
    	}
    	
    	if(hrPdfVO.getApilityHearing() !=null) {
    		String result = null;
    		if(hrPdfVO.getApilityHearing().equals("1")) {
    			result = "이상없음";
    		}else {
    			result = "이상";
    		}
    		dataMap.put("519,538,1", result ); // 청각장애
    	}
    	
    	if(hrPdfVO.getFgObstacle() != null) {
    		dataMap.put("65,481,1", hrPdfVO.getFgObstacle() ); // 장애구분
    	}
    	if(hrPdfVO.getLvObstacle()!=null) {
    		dataMap.put("190,481,1", hrPdfVO.getLvObstacle() ); // 장애등급
    	}else {
    		dataMap.put("110,481,1", "없음" ); // 장애등급
    	}
    	if(hrPdfVO.getFgVerterans()!=null) {
    		dataMap.put("290,481,1", hrPdfVO.getFgVerterans() ); // 보훈구분
    	}
    	if(hrPdfVO.getLvVerterans()!=null) {
    		dataMap.put("395,481,1", hrPdfVO.getLvVerterans() ); // 보훈등급
    	}
    	if(hrPdfVO.getRelationVerterans()!=null) {
    		dataMap.put("495,481,1", hrPdfVO.getRelationVerterans() ); // 보훈관계
    	}
    	
    	
    	// 병역
    	String FgMilitaryServiceName = FgMilitaryServiceUtil.getFgMilitaryService(hrPdfVO.getFgMilitaryService());
    	dataMap.put("32,426,1", FgMilitaryServiceName);
    	
    	if(hrPdfVO.getDcExemption()!=null) {
    		dataMap.put("95,430,1", hrPdfVO.getDcExemption() ); // 면제사유
    	}
    	if(hrPdfVO.getDtMilitaryStart()!=null) {
    		String formattedDate = formatDateWithHyphen(hrPdfVO.getDtMilitaryStart());
    		dataMap.put("184,426,1", formattedDate); // 복무시작일
    	}
    	if(hrPdfVO.getDtMilitaryEnd()!=null) {
    		String formattedDate = formatDateWithHyphen(hrPdfVO.getDtMilitaryEnd());
    		dataMap.put("254,426,1", formattedDate); // 복무종료일
    	}
    	String FgMilitaryTypeName = FgMilitaryTypeUtil.getFgMilitaryType(hrPdfVO.getFgMilitaryType());
    	dataMap.put("327,426,1", FgMilitaryTypeName); // 군별
    	
    	if(hrPdfVO.getDcClassMilitary()!=null) {
    		dataMap.put("380,426,1", hrPdfVO.getDcClassMilitary()); // 병과
    	}
    	
    	String FgMilitaryDischargeTypeName = FgMilitaryDischargeTypeUtil.getFgMilitaryDischargeType(hrPdfVO.getFgMilitaryDischarge());
    	dataMap.put("445,426,1", FgMilitaryDischargeTypeName); // 제대구분
    	
    	String FgMilitaryRankName= FgMilitaryRankUtil.getFgMilitaryRank(hrPdfVO.getFgMilitaryRank());
    	System.out.println(FgMilitaryRankName);
    	dataMap.put("520,426,1", FgMilitaryRankName); // 계급
    	
    	var bis = pdfService.generatePdfHr(dataMap); // 데이터 값
    	
//        var headers = new HttpHeaders();
//        headers.add("Content-Disposition", "inline; filename=result.pdf");
//    	
//    	return ResponseEntity
//    	        .ok()
//    	        .headers(headers)
//    	        .contentType(MediaType.APPLICATION_PDF)
//    	        .body(new InputStreamResource(bis));
        
        
        byte[] pdfBytes = bis.readAllBytes();
        String base64Pdf = Base64.getEncoder().encodeToString(pdfBytes);
        
        Map<String, Object> response = new HashMap<>();
        
        response.put("empInfo", hrPdfVO);
        response.put("pdf", base64Pdf);
        
        return ResponseEntity.ok(response);
        
    }
    
    
    public static String formatDateWithHyphen(String date) {
        if (date == null || date.length() != 8) {
            return date; // 원본 날짜 반환 (또는 오류 메시지나 다른 문자열 반환 가능)
        }
        String year = date.substring(0, 4);
        String month = date.substring(4, 6);
        String day = date.substring(6, 8);
        
        return year + "-" + month + "-" + day;
    }
    
}


