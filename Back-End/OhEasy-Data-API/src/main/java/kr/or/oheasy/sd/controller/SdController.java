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
import kr.or.oheasy.utils.Camel;
import kr.or.oheasy.vo.HrEmpMstVO;
import kr.or.oheasy.vo.SdEmpInfoVO;
import kr.or.oheasy.vo.SdEmpSearchVO;

@RestController
@RequestMapping("/api2/sd")
public class SdController {
	
	@Autowired
	private SdService sdService;

	//사원 리스트 조회
	@PostMapping("/getEmpList")
	public ResponseEntity<?> getEmpList(@RequestBody Map<String,String> empSearch){
		System.out.println(Camel.camelToSnake(empSearch.get("searchOrder")));
		List<HrEmpMstVO> result = sdService.getAllEmpList(empSearch);
		return new ResponseEntity<>(result,HttpStatus.OK);
	}
	
	//사원 상세 조회
	@GetMapping("/getOneEmpDetailData")
	public ResponseEntity<?> getOneEmpDetailData(@RequestParam("code") String cd_Emp){
		System.out.println("사원코드 : " + cd_Emp);
		SdEmpInfoVO result = sdService.getEmpDetailData(cd_Emp);
		System.out.println("코드로 조회한 사원 정보 : " + result);
		return new ResponseEntity<>(result,HttpStatus.OK);
	}
	
	//기본급 입력 후 전체 계산
	@PostMapping("/setEmpPay")
	public ResponseEntity<?> setEmpPay(@RequestBody Map<String,String> insertPay){
		String cd_Emp = insertPay.get("code");
		long pay = Long.parseLong(insertPay.get("pay").replaceAll(",", ""));
		System.out.println("사원코드 : " + cd_Emp);
		System.out.println("입력 급여 : " + pay);
//		List<HrEmpMstVO> result = sdService.getAllEmpList();
		int result = 1;
		return new ResponseEntity<>(result,HttpStatus.OK);
	}
	
}
