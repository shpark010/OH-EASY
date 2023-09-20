package kr.or.oheasy.hrm.controller;

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
import org.springframework.web.bind.annotation.RestController;

import kr.or.oheasy.hrm.service.HrService;
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

	@GetMapping("/getAllEmpList")
	public ResponseEntity<?> getAllEmpList(){
		// 인사테이블에 등록되어있는 사원목록 리스트
		System.out.println("getAllEmpList");
		
		List<HrEmpMstVO> result = hrService.getAllEmpList();
		
		return new ResponseEntity<>(result,HttpStatus.OK);
	}
	
	@GetMapping("/getAllModalEmpList")
	public ResponseEntity<?> getAllModalEmpList(){
		// 사원테이블에 등록되어있지만 인사테이블에는 없는 사원목록 리스트
		System.out.println("getAllModalEmpList");
		
		List<HrEmpMstVO> result = hrService.getAllModalEmpList();
		
		return new ResponseEntity<>(result,HttpStatus.OK);
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
		
	
		// 인사테이블에 사원정보 insert 
		hrService.insertHrEmpData(cdEmp);
		// 신체테이블에 신체정보 insert
		hrService.insertBodyData(cdEmp);
		// 병역테이블에 병역정보 insert
		hrService.insertMilitaryData(cdEmp);
		
		// 한명의 사원 정보 인사테이블에서  가져오기
		HrEmpMstCdEmpNmNameVO result  = hrService.getOneHrEmpData(cdEmp);
		System.out.println("가져온 1명의 정보 : " + result);
		
		
		//String result2 = "{cdEmp=" + result.getCdEmp();
		
		// 인사테이블에 등록되어있는 사원목록 리스트
		//List<HrEmpMstVO> result = hrService.getAllEmpList();
		//System.out.println(result);
	
		
		
		return new ResponseEntity<>(result,HttpStatus.OK);
	}
	
	
	
	@GetMapping("getConditionalEmpList")
	public ResponseEntity<?> getAllEmpList(@RequestParam("category") int category,@RequestParam("sort") int sort){
		System.out.println("getConditionalEmpList");
		
		System.out.println("category : " + category);
		System.out.println("sort : " + sort);
		
		List<HrEmpMstVO> result = hrService.getConditionalEmpList(category, sort); 
		
		return new ResponseEntity<>(result,HttpStatus.OK);
	}
	
	@PostMapping("/HrEmpDataDelete")
	public ResponseEntity<?> empDataDelete(@RequestBody String cdEmp){
		
		System.out.println(cdEmp);
		
		return new ResponseEntity<>(1,HttpStatus.OK);
	}
	
	@GetMapping("/getOneEmpBasicData")
	public ResponseEntity<?> getOneEmpBasicData(@RequestParam String cdEmp){
		System.out.println("getOneEmpBasicData");
		
		HrEmpMstJoinDtlVO result =hrService.getOneEmpBasicData(cdEmp);
		System.out.println(result);
		
		return new ResponseEntity<>(result,HttpStatus.OK);
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
	
	@GetMapping("/getCarrerDataList")
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
	
	@GetMapping("insertLienscData")
	public ResponseEntity<?> insertLienscData(@RequestParam Map<String, String> params){
		System.out.println("insertLienscData");
		String cdEmp = params.remove("cdEmp");
		Entry<String, String> entry = params.entrySet().iterator().next();
		String column = entry.getKey();
		String value = entry.getValue();
		System.out.println("cdEmp : " + cdEmp + ", column : " + column + ", value : " + value);
		System.out.println("인서트 경력 정보 *************************");
		
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
	
	
}
