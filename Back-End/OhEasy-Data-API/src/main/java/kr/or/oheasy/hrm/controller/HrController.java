package kr.or.oheasy.hrm.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import kr.or.oheasy.hrm.service.HrService;
import kr.or.oheasy.hrm.service.S3FileUploadTestService;
import kr.or.oheasy.hrm.vo.HrEmpMstCdEmpNmNameVO;
import kr.or.oheasy.hrm.vo.HrEmpMstJoinDtlVO;
import kr.or.oheasy.vo.HrBodyDataDtlVO;
import kr.or.oheasy.vo.HrCareerDtlVO;
import kr.or.oheasy.vo.HrEducationDtlVO;
import kr.or.oheasy.vo.HrEmpMstVO;
import kr.or.oheasy.vo.HrFamilyDtlVO;
import kr.or.oheasy.vo.HrLicenseDtlVO;
import kr.or.oheasy.vo.HrLicenseSdtlVO;
import kr.or.oheasy.vo.HrMilitaryInfoDtlVO;

@RestController
@RequestMapping("/api2/hr")
public class HrController {
	
	@Autowired
	private HrService hrService;
	
	@Autowired
	private S3FileUploadTestService s3FileUploadTestService;

	@GetMapping("/insertAllHrEmpData")
	public ResponseEntity<?> insertAllHrEmpData(){
		
		System.out.println("insertAllHrEmpData 진입 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
		
		List<HrEmpMstVO> result = hrService.insertAllHrEmpData();
	    int total = result.size(); // 총인원수
	    int working = (int) result.stream().filter(emp -> emp.getDtResign() == null).count(); // 재직중인원
	    int resigned = total - working; // 퇴사한인원

	    Map<String, Object> response = new HashMap();
	    response.put("result", result);
	    response.put("total", total);
	    response.put("working", working);
	    response.put("resigned", resigned);

	    System.out.println(response);
	    
		return new ResponseEntity<>(response,HttpStatus.OK);
	}
	
	@GetMapping("/getAllModalEmpList")
	public ResponseEntity<?> getAllModalEmpList(){
	    // 사원테이블에 등록되어있지만 인사테이블에는 없는 사원목록 리스트
	    System.out.println("getAllModalEmpList");
	    
	    List<HrEmpMstVO> result = hrService.getAllModalEmpList();

	    return new ResponseEntity<>(result, HttpStatus.OK);
	}
	
	@GetMapping("/getLicenseList")
	public ResponseEntity<?> getLicenseList(){
		// 자격증 리스트
		System.out.println("getLicenseList");
		
		List<HrLicenseSdtlVO> result = hrService.getLicenseList();
		System.out.println("가져온 자격증 정보 *****************************");
		System.out.println(result);
		
		return new ResponseEntity<>(result,HttpStatus.OK);
	}
	
	@GetMapping("insertHrEmpData")
	public ResponseEntity<?> insertHrEmpData(@RequestParam("cdEmp") String cdEmp){
		System.out.println("insertHrEmpData");
		System.out.println("넘어온 cdEmp : " + cdEmp);
		// 사원번호 받으면 해당사원의 mst 정보 전부 끌어오고 insert문 4개 진행
		HrEmpMstCdEmpNmNameVO result  = hrService.insertHrDtlAndGetHrMst(cdEmp);
		
		return new ResponseEntity<>(result,HttpStatus.OK);
	}
	
	
	
	@GetMapping("getConditionalEmpList")
	public ResponseEntity<?> getAllEmpList(@RequestParam("category") int category,@RequestParam("sort") int sort){
		System.out.println("getConditionalEmpList");
		
		System.out.println("category : " + category);
		System.out.println("sort : " + sort);
		
		List<HrEmpMstVO> result = hrService.getConditionalEmpList(category, sort);
	    int total = result.size(); // 총인원수
	    int working = (int) result.stream().filter(emp -> emp.getDtResign() == null).count(); // 재직중인원
	    int resigned = total - working; // 퇴사한인원

	    Map<String, Object> response = new HashMap();
	    response.put("result", result);
	    response.put("total", total);
	    response.put("working", working);
	    response.put("resigned", resigned);
		
		return new ResponseEntity<>(response,HttpStatus.OK);
	}
	
	@PostMapping("/HrEmpDataDelete")
	public ResponseEntity<?> deleteHrEmpDtlList(@RequestBody Map<String, List<String>> payload){
		
	    List<String> cdEmpList = payload.get("selectedEmpCodes");
	    
	    System.out.println("*******************************");
	    System.out.println(cdEmpList);
	    System.out.println("*******************************");
	    
	    // 넘어온 사원리스트 삭제 
	    hrService.deleteHrEmpDtlList(cdEmpList);
	    
	    
		
		return new ResponseEntity<>(1,HttpStatus.OK);
	}
	
	@GetMapping("/getOneEmpBasicData")
	public ResponseEntity<?> getOneEmpBasicData(@RequestParam String cdEmp){
		System.out.println("getOneEmpBasicData");
		
		HrEmpMstJoinDtlVO result =hrService.getOneEmpBasicData(cdEmp);
		System.out.println(result);
		
		return new ResponseEntity<>(result,HttpStatus.OK);
	}
	
	 @PostMapping("/uploadImg")
	    public ResponseEntity<?> uploadImg(@RequestParam("file") MultipartFile file,@RequestParam("cdEmp") String cdEmp) {

	    	System.out.println("넘어온 cdEmp : " + cdEmp);
	    	System.out.println("file : " + file);
	    	
	    	
	        if (file.isEmpty()) {
	        	System.out.println("업로드된 파일이 없습니다.");
	            return new ResponseEntity<>("업로드된 파일이 없습니다.", HttpStatus.BAD_REQUEST);
	        }

	        // 이미지 파일 유효성 검사
	        if (!file.getContentType().startsWith("image/")) {
	        	System.out.println("이미지 파일만 업로드 가능합니다.");
	            return new ResponseEntity<>("이미지 파일만 업로드 가능합니다.", HttpStatus.BAD_REQUEST);
	        }

	        if (file.getSize() > 5 * 1024 * 1024) {
	        	System.out.println("파일의 크기는 5MB를 초과할 수 없습니다.");
	            return new ResponseEntity<>("파일의 크기는 5MB를 초과할 수 없습니다.", HttpStatus.BAD_REQUEST);
	        }

	        try {
	        	System.out.println("try 1 ***********");
	        	
	        	String url = s3FileUploadTestService.uploadFile(file,cdEmp);
	            
	        	return new ResponseEntity<>(url,HttpStatus.OK);
	        } catch (Exception e) {
	        	System.out.println("파일 업로드 중 오류가 발생했습니다.");
	            return new ResponseEntity<>("파일 업로드 중 오류가 발생했습니다.", HttpStatus.INTERNAL_SERVER_ERROR);
	        }
	    }
	
	@PostMapping("deleteImg")
	public ResponseEntity<?> deleteImg(@RequestBody Map<String, String> payload){
	
		System.out.println("deleteImg");
		//{cdEmp=CD002, path=https://leefinal.s3.ap-northeast-2.amazonaws.com/profileImg/9daf7148-35dc-4216-adad-889605301bd3.jpg}
		System.out.println(payload);
        String cdEmp = payload.get("cdEmp");
        String s3Path = payload.get("path");
		
		
		hrService.updateEmpBasicData(cdEmp, "PATH", "null");
        // 파일명 추출
        String fileName = s3Path.substring(s3Path.lastIndexOf("/") + 1);

        // S3에서 이미지 삭제
        s3FileUploadTestService.deleteFileFromS3("profileImg/" + fileName);
        

		
		
		return new ResponseEntity<>("", HttpStatus.OK);
		
	}
	
	
	
	
	
	
	
	
	
	@GetMapping("/updateBasicEmpData")
	public ResponseEntity<?> updateEmpBasicData(@RequestParam Map<String, String> params){
		System.out.println("updateBasicEmpdata");
		System.out.println(params);
		String cdEmp = params.remove("cdEmp");
		Entry<String, String> entry = params.entrySet().iterator().next();
		String column = entry.getKey();
		String value = entry.getValue();
		System.out.println("cdEmp : " + cdEmp + ", column : " + column + ", value : " + value);
		int result = hrService.updateEmpBasicData(cdEmp, column, value);
		
		return new ResponseEntity<>(result,HttpStatus.OK);
	}
	
	@GetMapping("/getFamilyDataList")
	public ResponseEntity<?> getFamilyDataList(@RequestParam String cdEmp){
		System.out.println("getFamilyDataList");
		
		System.out.println(cdEmp);
		List<HrFamilyDtlVO> result = hrService.getFamilyDataList(cdEmp);
		System.out.println(result);
		
		return new ResponseEntity<>(result,HttpStatus.OK);
	}
	
	@GetMapping("insertFamilyData")
	public ResponseEntity<?> insertFamilyData(@RequestParam Map<String, String> params){
		System.out.println("insertFamilyData");
		String cdEmp = params.remove("cdEmp");
		Entry<String, String> entry = params.entrySet().iterator().next();
		String column = entry.getKey();
		String value = entry.getValue();
		System.out.println("cdEmp : " + cdEmp + ", column : " + column + ", value : " + value);
		System.out.println("인서트 가족 정보 *************************");
		
		int result = hrService.insertFamilyData(cdEmp, column, value);
		
		return new ResponseEntity<>(result,HttpStatus.OK);
	}
	
	@GetMapping("updateFamilyData")
	public ResponseEntity<?> updateFamilyData(@RequestParam Map<String, String> params){
		System.out.println("updateFamilyData");
	    String seqFamily = params.remove("seqFamily");
	    Entry<String, String> entry = params.entrySet().iterator().next();
	    String column = entry.getKey();
	    String value = entry.getValue();
	    System.out.println("seqFamily : " + seqFamily + ", column : " + column + ", value : " + value);
	    
	    int result = hrService.updateFamilyData(seqFamily, column, value);
	    
		return new ResponseEntity<>(result,HttpStatus.OK);
	}
	
	@GetMapping("/getEduDataList")
	public ResponseEntity<?> getEduDataList(@RequestParam String cdEmp){
		System.out.println("getEduDataList");
		
		System.out.println(cdEmp);
		List<HrEducationDtlVO> result = hrService.getEduDataList(cdEmp);
		System.out.println(result);
		
		return new ResponseEntity<>(result,HttpStatus.OK);
	}
	
	@GetMapping("insertEduData")
	public ResponseEntity<?> insertEduData(@RequestParam Map<String, String> params){
		System.out.println("insertEduData");
		String cdEmp = params.remove("cdEmp");
		Entry<String, String> entry = params.entrySet().iterator().next();
		String column = entry.getKey();
		String value = entry.getValue();
		System.out.println("cdEmp : " + cdEmp + ", column : " + column + ", value : " + value);
		System.out.println("인서트 학력 정보 *************************");
		
		int result = hrService.insertEduData(cdEmp, column, value);
		return new ResponseEntity<>(result,HttpStatus.OK);
	}
	@GetMapping("updateEduData")
	public ResponseEntity<?> updateEduData(@RequestParam Map<String, String> params){
		System.out.println("updateEdudata");
		System.out.println("updateEdudata");
		System.out.println("updateEdudata");
	    String seqEducation = params.remove("seqEducation");
	    Entry<String, String> entry = params.entrySet().iterator().next();
	    String column = entry.getKey();
	    String value = entry.getValue();
	    System.out.println("seqEducation : " + seqEducation + ", column : " + column + ", value : " + value);
	    
	    int result = hrService.updateEduData(seqEducation, column, value);
		

		return new ResponseEntity<>("",HttpStatus.OK);
	}
	
	@GetMapping("/getCareerDataList")
	public ResponseEntity<?> getCarrerDataList(@RequestParam String cdEmp){
		System.out.println("getCarrerDataList");
		
		System.out.println(cdEmp);
		List<HrCareerDtlVO> result = hrService.getCareerDataList(cdEmp);
		System.out.println("가져온 경력 결과 **********************");
		System.out.println(result);
		
		return new ResponseEntity<>(result,HttpStatus.OK);
	}
	
	@GetMapping("insertCareerData")
	public ResponseEntity<?> insertCareerData(@RequestParam Map<String, String> params){
		System.out.println("insertEduData");
		String cdEmp = params.remove("cdEmp");
		Entry<String, String> entry = params.entrySet().iterator().next();
		String column = entry.getKey();
		String value = entry.getValue();
		System.out.println("cdEmp : " + cdEmp + ", column : " + column + ", value : " + value);
		System.out.println("인서트 경력 정보 *************************");
		
		int result = hrService.insertCareerData(cdEmp, column, value);
		return new ResponseEntity<>(result,HttpStatus.OK);
	}
	
	@GetMapping("updateCareerData")
	public ResponseEntity<?> updateCareerData(@RequestParam Map<String, String> params){
		System.out.println("updateCareerData");
		String seqCareer = params.remove("seqCareer");
		Entry<String, String> entry = params.entrySet().iterator().next();
		String column = entry.getKey();
		String value = entry.getValue();
		System.out.println("seqCareer : " + seqCareer + ", column : " + column + ", value : " + value);
		
		int result = hrService.updateCareerData(seqCareer, column, value);
		
		return new ResponseEntity<>("",HttpStatus.OK);
	}
	
	@GetMapping("/getBodyData")
	public ResponseEntity<?> getBodyData(@RequestParam String cdEmp){
		System.out.println("getBodyData");
		
		HrBodyDataDtlVO result = hrService.getBodyData(cdEmp);
		return new ResponseEntity<>(result,HttpStatus.OK);
	}
	@GetMapping("/updateBodyData")
	public ResponseEntity<?> updateBodyData(@RequestParam Map<String, String> params){
		System.out.println("updateBodyData");
		System.out.println(params);
		String cdEmp = params.remove("cdEmp");
		Entry<String, String> entry = params.entrySet().iterator().next();
		String column = entry.getKey();
		String value = entry.getValue();
		System.out.println("cdEmp : " + cdEmp + ", column : " + column + ", value : " + value);
		
	
		int result = hrService.updateBodyData(cdEmp, column, value);
		
		return new ResponseEntity<>(result,HttpStatus.OK);
	}
	
	@GetMapping("/getMilitaryData")
	public ResponseEntity<?> getMilitaryData(@RequestParam String cdEmp){
		System.out.println("getMilitaryData");
		
		HrMilitaryInfoDtlVO result = hrService.getMilitaryData(cdEmp);
		return new ResponseEntity<>(result,HttpStatus.OK);
		
	}
	
	@GetMapping("/updateMilitaryData")
	public ResponseEntity<?> updateMilitaryData(@RequestParam Map<String, String> params){
		System.out.println("updateMilitaryData");
		System.out.println(params);
		String cdEmp = params.remove("cdEmp");
		Entry<String, String> entry = params.entrySet().iterator().next();
		String column = entry.getKey();
		String value = entry.getValue();
		System.out.println("cdEmp : " + cdEmp + ", column : " + column + ", value : " + value);
		
	
		int result = hrService.updateMilitaryData(cdEmp, column, value);
		
		return new ResponseEntity<>(result,HttpStatus.OK);
	}
	
	@GetMapping("/getLicenseDataList")
	public ResponseEntity<?> getLicenseDataList(@RequestParam String cdEmp){
		System.out.println("getLicenseDataList");
		
		System.out.println(cdEmp);
		List<HrLicenseDtlVO> result = hrService.getLicenseDataList(cdEmp);
		System.out.println(result);
		
		return new ResponseEntity<>(result,HttpStatus.OK);
	}
	
	@GetMapping("insertLicenseData")
	public ResponseEntity<?> insertLienscData(@RequestParam Map<String, String> params){
		System.out.println("insertLicenseData");
		String cdEmp = params.remove("cdEmp");
		Entry<String, String> entry = params.entrySet().iterator().next();
		String column = entry.getKey();
		String value = entry.getValue();
		System.out.println("cdEmp : " + cdEmp + ", column : " + column + ", value : " + value);
		System.out.println("인서트 자격증 정보 *************************");
		
		int result = hrService.insertLicenseData(cdEmp, column, value);
		return new ResponseEntity<>(result,HttpStatus.OK);
	}
	
	
	
	@GetMapping("updateLicenseData")
	public ResponseEntity<?> updateLicenseData(@RequestParam Map<String, String> params){
		System.out.println("updateLicenseData");
	    String seqLicense = params.remove("seqLicense");
	    Entry<String, String> entry = params.entrySet().iterator().next();
	    String column = entry.getKey();
	    String value = entry.getValue();
	    System.out.println("seqLicense : " + seqLicense + ", column : " + column + ", value : " + value);
	    
	    int result = hrService.updateLicenseData(seqLicense, column, value);
	    
		return new ResponseEntity<>(result,HttpStatus.OK);
	}
	
	
	@PostMapping("deleteFamilyData")
	public ResponseEntity<?> deleteFamilyData(@RequestBody Map<String,String> payload){
		
		String seqFamily = payload.get("seqFamily");
		System.out.println("deleteFamilyData");
		System.out.println(seqFamily);
		int result = hrService.deleteFamilyData(seqFamily);
		
		
		return new ResponseEntity<>(result,HttpStatus.OK);
	}
	
	@PostMapping("deleteEduData")
	public ResponseEntity<?> deleteEduData(@RequestBody Map<String,String> payload){
		
		String seqEducation = payload.get("seqEducation");
		System.out.println("deleteEduData");
		System.out.println(seqEducation);
		int result = hrService.deleteEduData(seqEducation);
		
		
		return new ResponseEntity<>(result,HttpStatus.OK);
	}
	@PostMapping("deleteCareerData")
	public ResponseEntity<?> deleteCareerData(@RequestBody Map<String,String> payload){
		
		String seqCareer = payload.get("seqCareer");
		System.out.println("deleteCareerData");
		System.out.println(seqCareer);
		int result = hrService.deleteCareerData(seqCareer);
		
		
		return new ResponseEntity<>(result,HttpStatus.OK);
	}
	
	@PostMapping("deleteLicenseData")
	public ResponseEntity<?> deleteLicenseData(@RequestBody Map<String,String> payload){
		
		String seqLicense = payload.get("seqLicense");
		System.out.println("deleteLicenseData");
		System.out.println(seqLicense);
		int result = hrService.deleteLicenseData(seqLicense);
		
		
		return new ResponseEntity<>(result,HttpStatus.OK);
	}
	
	
	
	
	
	
}
