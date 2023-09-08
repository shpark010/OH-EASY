package kr.or.oheasy.sd.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import kr.or.oheasy.sd.service.SdService;
import kr.or.oheasy.vo.HrEmpMstVO;
import kr.or.oheasy.vo.SdEmpSearchVO;

@RestController
@RequestMapping("/api2/sd")
public class SdController {
	
	@Autowired
	private SdService sdService;

	//사원 리스트 조회
	@PostMapping("/getEmpList")
	public ResponseEntity<?> getEmpList(@RequestBody Map<String,String> empSearchVO){
		System.out.println(empSearchVO.get("payDay"));
		List<HrEmpMstVO> result = sdService.getAllEmpList();
		return new ResponseEntity<>(result,HttpStatus.OK);
	}
	
	//기본급 입력 후 전체 계산
	@PostMapping("/setEmpPay")
	public ResponseEntity<?> setEmpPay(){
		
		List<HrEmpMstVO> result = sdService.getAllEmpList();
		return new ResponseEntity<>(result,HttpStatus.OK);
	}
	
}
