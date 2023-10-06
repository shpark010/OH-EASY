package kr.or.oheasy.sd.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.or.oheasy.sd.service.SdService;
import kr.or.oheasy.utils.Camel;
import kr.or.oheasy.vo.HrEmpMstVO;
import kr.or.oheasy.vo.SdTaxAmountVO;

@RestController
@RequestMapping("/api2/sd")
public class SdController {

	@Autowired
	private SdService sdService;

	// 사원 리스트 조회
	@PostMapping("/getEmpList")
	public ResponseEntity<?> getEmpList(@RequestBody Map<String, String> empSearch) {
		System.out.println("조회 컨트롤러 진입");
		System.out.println(empSearch);
		Map<String, Object> result = sdService.getAllEmpList(empSearch);
		System.out.println(result);
		return new ResponseEntity<>(result, HttpStatus.OK);
	}

	// 사원 상세 조회
	@PostMapping("/getOneEmpDetailData")
	public ResponseEntity<?> getOneEmpDetailData(@RequestBody Map<String, String> empInfo) {
		System.out.println("선택 컨트롤러 진입");
		System.out.println("사원코드 : " + empInfo.get("code"));
		System.out.println("귀속년월 : " + empInfo.get("belongingDate"));
		System.out.println("지급일 : " + empInfo.get("payDay"));
		Map<String, Object> result = sdService.getEmpDetailData(empInfo);
		return new ResponseEntity<>(result, HttpStatus.OK);
	}

	// 기본급 입력 후 전체 계산
	@PostMapping("/setEmpPay")
	public ResponseEntity<?> setEmpPay(@RequestBody Map<String, String> insertPay) {
		System.out.println("삽입 컨트롤러 진입");
		Map<String, Object> result = sdService.setEmpPay(insertPay);
		System.out.println(result);
		return new ResponseEntity<>(result, HttpStatus.OK);
	}
	
	// 기본급 입력 후 전체 계산
	@PostMapping("/updateEmpPay")
	public ResponseEntity<?> updateEmpPay(@RequestBody Map<String, String> updatePay) {
		System.out.println("수정 컨트롤러 진입");
		Map<String, Object> result = sdService.updateEmpPay(updatePay);
		return new ResponseEntity<>(result, HttpStatus.OK);
	}
	
	//조회 구분에 따른 세금 정보
	@PostMapping("/searchTaxInfo")
	public ResponseEntity<?> searchTaxInfo(@RequestBody Map<String, String> searchTax) {
		System.out.println("조회 구분 컨트롤러 진입");
		System.out.println(searchTax.get("code"));
		Map<String, Object> result = sdService.searchTaxInfo(searchTax);
		System.out.println(result);
		return new ResponseEntity<>(result, HttpStatus.OK);
	}
	
	// 급여 삭제
	@PostMapping("/deletePayData")
	public ResponseEntity<?> deletePayData(@RequestBody Map<String, Object> deleteData) {
		System.out.println("삭제 컨트롤러 진입");
		System.out.println(deleteData.get("code"));
		Map<String, Object> result = sdService.deletePayData(deleteData);
		return new ResponseEntity<>(result, HttpStatus.OK);
	}
	
	//지급일자 조회
	@PostMapping("/getPayDayList")
	public ResponseEntity<?> getPayDayList(@RequestBody Map<String, String> payDayData) {
		System.out.println("지급일자 조회 컨트롤러 진입");
		Map<String, Object> result = sdService.getPayDayList(payDayData);
		return new ResponseEntity<>(result, HttpStatus.OK);
	}
	
	//과세 리스트 조회
	@PostMapping("/getTaxList")
	public ResponseEntity<?> getTaxList(@RequestBody Map<String, String> taxListData) {
		System.out.println("세율확인/변경 조회 컨트롤러 진입");
		Map<String, Object> result = sdService.getTaxList(taxListData);
		return new ResponseEntity<>(result, HttpStatus.OK);
	}
	
	//과세 리스트 수정
	@PostMapping("/updateTaxList")
	public ResponseEntity<?> updateTaxList(@RequestBody Map<String, Object> updateTaxListData) {
		System.out.println("세율확인/변경 수정 컨트롤러 진입");
		Map<String, Object> result = sdService.updateTaxList(updateTaxListData);
		return new ResponseEntity<>(null, HttpStatus.OK);
	}
	
	//각 과세 항목 별 수정
	@PostMapping("/updateEachDeduction")
	public ResponseEntity<?> updateEachDeduction(@RequestBody Map<String, String> updateEachDeductionData) {
		System.out.println("각 항목 정보 수정 컨트롤러 진입");
		System.out.println(updateEachDeductionData);
		Map<String, Object> result = sdService.updateEachDeduction(updateEachDeductionData);
		return new ResponseEntity<>(result, HttpStatus.OK);
	}
}
