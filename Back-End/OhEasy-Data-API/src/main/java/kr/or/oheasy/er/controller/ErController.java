package kr.or.oheasy.er.controller;

import kr.or.oheasy.er.service.ErService;
import kr.or.oheasy.vo.HrEmpMstVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api2/er")
public class ErController {

    @Autowired
    private ErService erService;

    @PostMapping("/postEmp")
    public ResponseEntity<Integer> postEmp(@RequestBody HrEmpMstVO hrEmpMstVO) {
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

    @PatchMapping("/patchEmpData")
    public ResponseEntity<Integer> patchEmp(@RequestParam("cdEmp") String cdEmp,
                                            @RequestBody HrEmpMstVO hrEmpMstVO) {
        try {
            if (erService.isCdEmpValid(cdEmp)) {
                int result = erService.patchEmp(hrEmpMstVO);
                if (result > 0) {
                    return new ResponseEntity<>(result, HttpStatus.OK);
                } else {
                    return new ResponseEntity<>(result, HttpStatus.BAD_REQUEST);
                }
            } else {
                return new ResponseEntity<>(0, HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(-1, HttpStatus.INTERNAL_SERVER_ERROR);
        }
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
