package kr.or.oheasy.wc.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import kr.or.oheasy.vo.WcGetEmpListVO;
import kr.or.oheasy.vo.WcVO;
import kr.or.oheasy.wc.service.WcService;

@RestController
@RequestMapping("/api2/wc")
public class WcController {

	@Autowired
	private WcService wcService;
	
	@GetMapping("/getEmpList")
	public ResponseEntity<?> getAllEmpList() {

	    List<WcGetEmpListVO> result = wcService.getAllEmpList();

	    System.out.println("getEmpList 진입");

	    return new ResponseEntity<>(result, HttpStatus.OK);
	}
	
	@PutMapping("/updateEmpList")
	public int updateEmp0to1() {
		System.out.println("updataeEmpList 진입");
		
	    int result = wcService.updateEmp0to1();


	    return result;
	} // 작성 Tab에서 작성완료 눌렀을 경우
	
	
	@GetMapping("/getWcData")
	public ResponseEntity<?> getWcData(@RequestParam String code) {
		System.out.println("getWcData진입");
	    WcVO result = wcService.getWcData(code);
	    System.out.println(result);
	    
	    return new ResponseEntity<>(result, HttpStatus.OK);
	} //조회 Tab에서 왼쪽 Grid Table 눌렀을 경우.
	
	
}




