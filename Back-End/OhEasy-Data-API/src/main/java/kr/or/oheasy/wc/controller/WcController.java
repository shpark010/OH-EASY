package kr.or.oheasy.wc.controller;

import java.text.DecimalFormat;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import kr.or.oheasy.vo.WcGetEmpVO;
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
		List<WcGetEmpVO> result;
		switch(dataSize) {
		case 2:{
			
			String month = data.get("creDate");
			String day = "01"; // 20230901
			String day2 = "31"; // 20230931
			String param1 = month+day;
			String param2 = month+day2;
			String param3 = data.get("orderValue");
			result = wcService.getOptionEmpList(param1,param2,param3);
			break;
		}
		
		case 3: {
			String param1 = data.get("creDate");
			String param2 = data.get("creDate2")+"31";
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
	
	
	@GetMapping("/getCodeParamEmpList")
	public ResponseEntity<?> getCodeParam(@RequestParam String code) {
		System.out.println("getCodeParam진입");
		System.out.println(code);
		WcVO result = wcService.getCodeParam(code);
		System.out.println("codeParamEmpList진입");
		System.out.println(code);
		System.out.println(result);
		
		// 금액 , 찍어주기
		String amount = result.getAmtSal();
		if(amount !=null) {
		System.out.println(amount);
		
		 int number = Integer.parseInt(amount);
	      DecimalFormat decimalFormat = new DecimalFormat("#,###");
	      String formattedNumber = decimalFormat.format(number);	      
	      result.setAmtSal(formattedNumber);
		}
		
		return new ResponseEntity<>(result, HttpStatus.OK);
	} //조회 Tab에서 왼쪽 Grid Table 눌렀을 경우.code로 wctable에서 가져오는 사원 data
	
	
	@GetMapping("/getModalEmpList")
	public ResponseEntity<?> getModalEmpList(){
		System.out.println("getModalEmpList진입");
		List<WcGetEmpVO> result = wcService.getAllModalEmpList();
		System.out.println(result);
		return new ResponseEntity<>(result, HttpStatus.OK);
	}
	
	@PostMapping("/getModalEmpListByName") //객체 보낼거라. 이름만 Name
	public ResponseEntity<?> getModalEmpListByName(@RequestBody Map<String, Object> params){
		System.out.println("getModalEmpListByName진입");
		System.out.println(params);
		List<WcGetEmpVO> result = wcService.getModalEmpListByName(params);
		System.out.println(result);
		return new ResponseEntity<>(result, HttpStatus.OK);
	}
	
	/*
	 *   @GetMapping("/search")
    public ResponseEntity<List<WcGetEmpVO>> getModalEmpListByName(@RequestParam Map<String, Object> params) {
        List<WcGetEmpVO> empList = empService.getModalEmpListByName(params);
        return new ResponseEntity<>(empList, HttpStatus.OK);
    }*/
	
	
	@GetMapping("/getModalData") //모달에서 클릭하거나 더블클릭시 
	public WcGetEmpVO getModalData(@RequestParam String cdEmp){
		System.out.println("getModalData진입");
		System.out.println(cdEmp);
		// modal 에띄워진 data db에서 가져오면서 code insert
		wcService.insertEmpData(cdEmp);
		WcGetEmpVO result = wcService.getModalData(cdEmp);
		return result;
	}
	
	
	@PutMapping("/updateEmpList")
	public int updateEmpList(@RequestParam String cdEmp,@RequestParam String colum,@RequestParam String data ) {
		System.out.println("updataeEmpList 진입");
		String modifyData =null;
		System.out.println(cdEmp + colum+ data);
		
		//공백 값에 대한 validation
		if (data.equals("")) {
		    data = null;
		}
		if (data != null) {
			modifyData = data.replace(",", ""); // ,를 ""로 대체
		}
	    int result = wcService.updateEmpList(cdEmp,colum,modifyData);
	    return result;
	} // 작성 Tab에서 작성완료 눌렀을 경우
	
	
	
	@DeleteMapping("/deleteEmpList")
	public int deleteEmpList(@RequestBody List<String> checkColumn ) {
		System.out.println("deleteEmpList 진입");
		System.out.println(checkColumn);
		int result = -1;
	    for (String cdEmp : checkColumn) {
            result = wcService.deleteEmpList(cdEmp);
            if(result==0) {
            	break;
            	}
        }
		System.out.println(result);
	    return result;
	} // 작성 Tab에서 작성완료 눌렀을 경우
	
	
	
}




