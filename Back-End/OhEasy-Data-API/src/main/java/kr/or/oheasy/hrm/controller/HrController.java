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
import kr.or.oheasy.vo.HrEmpMstVO;
import kr.or.oheasy.vo.HrFamilyDtlVO;

@RestController
@RequestMapping("/api2/hr")
public class HrController {
	
	@Autowired
	private HrService hrService;

	@GetMapping("/getAllEmpList")
	public ResponseEntity<?> getAllEmpList(){
		
		List<HrEmpMstVO> result = hrService.getAllEmpList();
		
		return new ResponseEntity<>(result,HttpStatus.OK);
	}
	
	@PostMapping("/HrEmpDataDelete")
	public ResponseEntity<?> empDataDelete(@RequestBody String cdEmp){
		
		System.out.println(cdEmp);
		
		return new ResponseEntity<>(1,HttpStatus.OK);
	}
	
	@GetMapping("/getOneEmpBasicData")
	public ResponseEntity<?> getOneEmpBasicData(@RequestParam String cdEmp){
		
		HrEmpMstVO result =hrService.getOneEmpBasicData(cdEmp);
		System.out.println(result);
		
		return new ResponseEntity<>(result,HttpStatus.OK);
	}
	
	@GetMapping("/updateBasicEmpdata")
	public ResponseEntity<?> updateEmpBasicData(@RequestParam Map<String, String> params){
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
		
		System.out.println(cdEmp);
		List<HrFamilyDtlVO> result = hrService.getFamilyDataList(cdEmp);
		System.out.println(result);
		
		return new ResponseEntity<>(result,HttpStatus.OK);
	}
	
	@GetMapping("insertFamilyData")
	public ResponseEntity<?> insertFamilyData(@RequestParam Map<String, String> params){
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
	    String seqFamily = params.remove("seqFamily");
	    Entry<String, String> entry = params.entrySet().iterator().next();
	    String column = entry.getKey();
	    String value = entry.getValue();
	    System.out.println("seqFamily : " + seqFamily + ", column : " + column + ", value : " + value);
	    
	    int result = hrService.updateFamilyData(seqFamily, column, value);
	    
		return new ResponseEntity<>(result,HttpStatus.OK);
	}
	
}
