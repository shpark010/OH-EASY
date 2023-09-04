package kr.or.oheasy.er.controller;

import kr.or.oheasy.er.service.ErService;
import kr.or.oheasy.vo.HrEmpMstVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/er")
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
            return new ResponseEntity<>(-1, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getAllEmpList")
    public ResponseEntity<?> getAllEmpList() {
        List<HrEmpMstVO> result = erService.getAllEmpList();
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/{cdEmp}")
    public ResponseEntity<?> getCdEmp(@PathVariable("cdEmp") String cdEmp) {
        HrEmpMstVO result = erService.getCdEmp(cdEmp);

        if (result == null) {
            return new ResponseEntity<>("Employee not found", HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @DeleteMapping("/{cdEmp}")
    public ResponseEntity<String> deleteEmp(@PathVariable("cdEmp") String cdEmp) {
        erService.deleteEmp(cdEmp);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}
