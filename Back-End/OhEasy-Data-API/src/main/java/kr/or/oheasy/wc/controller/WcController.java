package kr.or.oheasy.wc.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import kr.or.oheasy.vo.WcVO;
import kr.or.oheasy.wc.service.WcService;

@RestController
@RequestMapping("/api2/wc")
public class WcController {

	@Autowired
	private WcService wcService;
	
	@GetMapping("/getEmpList")
	public ResponseEntity<?> getAllEmpList(@RequestParam String tabState) {

	    List<WcVO> result = wcService.getAllEmpList(tabState);

	    System.out.println("EmpList 진입");
	    System.out.println(tabState);

	    return new ResponseEntity<>(result, HttpStatus.OK);
	}
	
	
	
	
	
	
}
