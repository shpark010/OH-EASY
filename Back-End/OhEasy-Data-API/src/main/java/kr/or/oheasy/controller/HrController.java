package kr.or.oheasy.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.or.oheasy.service.HrService;
import kr.or.oheasy.vo.HrEmpMstVO;

@RestController
@RequestMapping("/hr")
public class HrController {
	
	@Autowired
	private HrService hrService;

	@GetMapping("/getAllEmpList")
	public ResponseEntity<?> getAllEmpList(){
		
		List<HrEmpMstVO> result = hrService.getAllEmpList();
		
		return new ResponseEntity<>(result,HttpStatus.OK);
	}
	
}
