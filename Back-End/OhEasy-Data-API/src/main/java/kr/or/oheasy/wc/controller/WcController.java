package kr.or.oheasy.wc.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import ch.qos.logback.core.recovery.ResilientSyslogOutputStream;
import kr.or.oheasy.vo.WcGetEmpListVO;
import kr.or.oheasy.vo.WcVO;
import kr.or.oheasy.wc.service.WcService;

@RestController
@RequestMapping("/api2/wc")
public class WcController {

	@Autowired
	private WcService wcService;
	
	@GetMapping("/getEmpList")
//	public ResponseEntity<?> getOptionEmpList(@RequestParam String creDate,@RequestParam String creDate2, @RequestParam String orderValue) {
	public ResponseEntity<?> getOptionEmpList(@RequestParam Map<String,String> data) {
		
		System.out.println("getEmpList 진입");
		System.out.println(data);		 
		int dataSize = data.size();
		List<WcGetEmpListVO> result;
		switch(dataSize) {
		case 2:{
			String param1 = data.get("creDate");
			String param2 = data.get("orderValue");
			result = wcService.getOptionEmpList(param1,param2);
			break;

		    
		}
		
		case 3: {
			String param1 = data.get("creDate");
			String param2 = data.get("creDate2");
			String param3 = data.get("orderValue");
			result = wcService.getOptionEmpList2(param1,param2,param3);
			break;
		}
		
		default :{
			return null;
		}
	}
		
		System.out.println(result);
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




