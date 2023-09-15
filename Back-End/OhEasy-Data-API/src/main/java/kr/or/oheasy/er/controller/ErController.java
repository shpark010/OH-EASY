package kr.or.oheasy.er.controller;

import kr.or.oheasy.er.service.ErService;
import kr.or.oheasy.vo.HrEmpMstVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api2/er")
public class ErController {

    @Autowired
    private ErService erService;

    @PostMapping("/postEmpData")
    public ResponseEntity<Integer> postEmp(@RequestBody HrEmpMstVO hrEmpMstVO) {

        System.out.println("postEmpData 진입 ***********************************");

        try {
            int result = erService.postEmp(hrEmpMstVO);
            if (result > 0) {
                return new ResponseEntity<>(result, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(result, HttpStatus.OK);

            }
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(-1, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/checkCdEmpExists")
    public ResponseEntity<Boolean> checkCdEmpExists(@RequestParam("cdEmp") String cdEmp) {
        try {
            boolean result = erService.isCdEmpValid(cdEmp);
            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(false, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

//    @PostMapping("/updateEmpData")
//    public ResponseEntity<Integer> patchEmp(@RequestBody HrEmpMstVO hrEmpMstVO) {
//
//        System.out.println("updateEmpData 진입 ***********************************");
//        System.out.println(hrEmpMstVO.getCdEmp());
//
//        try {
//            if (erService.isCdEmpValid(hrEmpMstVO.getCdEmp())) {
//                int result = erService.patchEmp(hrEmpMstVO);
//                if (result > 0) {
//                    return new ResponseEntity<>(result, HttpStatus.OK);
//                } else {
//                    return new ResponseEntity<>(result, HttpStatus.BAD_REQUEST);
//                }
//            } else {
//                return new ResponseEntity<>(0, HttpStatus.NOT_FOUND);
//            }
//        } catch (Exception e) {
//            e.printStackTrace();
//            return new ResponseEntity<>(-1, HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }

    @PostMapping("updateEmpData")
    public ResponseEntity<?> updateEmp(@RequestBody Map<String, String> params){

        System.out.println("updateEmpData 진입***************************");
        System.out.println(params);

        String cdEmp = params.remove("cdEmp");

        System.out.println(cdEmp);
        if(params.isEmpty()) {
            // 여기에서 적절한 에러 응답을 반환할 수 있습니다.
            return new ResponseEntity<>("No column to update specified", HttpStatus.BAD_REQUEST);
        }

        Map.Entry<String, String> entry = params.entrySet().iterator().next();
        String column = entry.getKey();
        String value = entry.getValue();

        System.out.println("column******************" + column);
        System.out.println("value*******************" + value);

        System.out.println("cdEmp : " + cdEmp + ", column : " + column + ", value : " + value);

        int result = erService.updateEmp(cdEmp, column, value);

        return new ResponseEntity<>(result,HttpStatus.OK);
    }

    @GetMapping("/getAllEmpList")
    public ResponseEntity<?> getAllEmpList() {
        List<HrEmpMstVO> result = erService.getAllEmpList();

        System.out.println("getAllEmpList 메서드진입");
        System.out.println(result);

        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/getEmpData")
    public ResponseEntity<?> getCdEmp(@RequestParam("cdEmp") String cdEmp) {
        System.out.println("사원코드 한명 가져오기 ***********************************");
        System.out.println(cdEmp);
        HrEmpMstVO result = erService.getCdEmp(cdEmp);

        if (result == null) {
            return new ResponseEntity<>("Employee not found", HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(result, HttpStatus.OK);
    }


    @DeleteMapping("/deleteEmpData")
    public ResponseEntity<Integer> deleteEmp(@RequestParam("cdEmp") String cdEmp) {
        try {
            int result = erService.deleteEmp(cdEmp);
            System.out.println("사원코드 deleteEmpData ******************************");
            System.out.println(cdEmp);
            if (result > 0) {
                return new ResponseEntity<>(result, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(result, HttpStatus.NO_CONTENT);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(-1, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
