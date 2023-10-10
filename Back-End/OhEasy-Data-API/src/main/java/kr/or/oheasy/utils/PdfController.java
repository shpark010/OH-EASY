package kr.or.oheasy.utils;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
		Map<String, Object> response = new HashMap<>();
		
		//사원 정보 불러오기
		SdPdfInfoVO pdfInfo = sdService.seletForPdf(pdfData);

		//PDF 정보 가져오기
        var bis = pdfService.generatePdf(pdfInfo);
        byte[] pdfBytes = bis.readAllBytes();
        String base64Pdf = Base64.getEncoder().encodeToString(pdfBytes);
        
        response.put("pdfInfo", pdfInfo);
        response.put("pdf", base64Pdf);
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/hrPdf")
    public ResponseEntity<?> hrDownloadFiles(@RequestBody Map<String, List<String>> pdfData) throws IOException {
        List<String> codes = pdfData.get("codes");
        
        // 결과를 담을 List
        List<Map<String, Object>> responses = new ArrayList<>();
        for(String code : codes) {
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
	    	
	        
	        byte[] pdfBytes = bis.readAllBytes();
	        String base64Pdf = Base64.getEncoder().encodeToString(pdfBytes);
	        
	        Map<String, Object> response = new HashMap<>();
	        
	        response.put("empInfo", hrPdfVO);
	        response.put("pdf", base64Pdf);
	        responses.add(response);
        }
        System.out.println(responses);
        return ResponseEntity.ok(responses);
        
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


