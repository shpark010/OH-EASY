package kr.or.oheasy.er.controller;

import kr.or.oheasy.er.service.ErService;
import kr.or.oheasy.vo.HrEmpMstVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api2/er")
public class ErController {

    @Autowired
    private ErService erService;

    // 사원등록
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

    // 사원코드 존재여부검사
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

    // 사원수정
    @PostMapping("updateEmpData")
    public ResponseEntity<?> updateEmp(@RequestBody Map<String, Object> params) {

        System.out.println("updateEmpData 진입***************************");
        System.out.println("params : " + params);

        String cdEmp = (String) params.remove("cdEmp");
        System.out.println(cdEmp);

        if (params.isEmpty() || !params.containsKey("updateField")) {
            return new ResponseEntity<>("No column to update specified", HttpStatus.BAD_REQUEST);
        }

        Map<String, String> updateFields = (Map<String, String>) params.get("updateField");

        if (updateFields == null || updateFields.isEmpty()) {
            return new ResponseEntity<>("No fields in updateField specified", HttpStatus.BAD_REQUEST);
        }

        Map.Entry<String, String> entry = updateFields.entrySet().iterator().next();
        String column = entry.getKey();
        String value = entry.getValue();

        System.out.println("cdEmp : " + cdEmp + ", column : " + column + ", value : " + value);

        int result = erService.updateEmp(cdEmp, column, value);

        return new ResponseEntity<>("1", HttpStatus.OK);
    }

    // 사원전체조회
    @GetMapping("/getAllEmpList")
    public ResponseEntity<?> getAllEmpList() {
        List<HrEmpMstVO> result = erService.getAllEmpList();

        System.out.println("getAllEmpList 메서드진입");
        System.out.println(result);

        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    // 사원조회
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

    // FK 참조하는 테이블 확인 후 사원삭제
    @PostMapping("/deleteEmpData")
    public ResponseEntity<?> deleteEmp(@RequestBody Map<String, List<String>> payload) {
        System.out.println("삭제 메소드 진입 ***********************************");

        List<String> empCodes = payload.get("selectedEmpCodes");
        Map<String, Object> response = new HashMap<>();

        for (String cdEmp : empCodes) {
            Map<String, Object> individualResponse = erService.deleteEmp(cdEmp);
            if (individualResponse.containsKey("deleted")) {
                if ((int) individualResponse.get("deleted") <= 0) {
                    response.put(cdEmp, "not_deleted");
                }
            } else {
                response.putAll(individualResponse);
            }
        }

        if (response.isEmpty() || response.values().stream().allMatch(val -> "not_deleted".equals(val))) {
            return new ResponseEntity<>(Collections.singletonMap("deleted", true), HttpStatus.OK);
        } else {
            System.out.println("Response Data: " + response);
            return new ResponseEntity<>(response, HttpStatus.CONFLICT);
        }
    }

    // 부서전체조회
    @GetMapping("/getDeptList")
    public ResponseEntity<?> getDeptList() {
        List<HrEmpMstVO> result = erService.getDeptList();

        System.out.println("getDeptList 메서드진입");
        System.out.println(result);

        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    // 은행전체조회
    @GetMapping("/getBankList")
    public ResponseEntity<?> getBankList() {
        List<HrEmpMstVO> result = erService.getBankList();

        System.out.println("getBankList 메서드진입");
        System.out.println(result);

        return new ResponseEntity<>(result, HttpStatus.OK);
    }

}
