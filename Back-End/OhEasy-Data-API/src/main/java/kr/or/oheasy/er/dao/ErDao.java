package kr.or.oheasy.er.dao;

import kr.or.oheasy.vo.HrEmpMstVO;
import java.util.List;

public interface ErDao {

    public int postEmp(HrEmpMstVO hrEmpMstVO); // 사원등록

    public int patchEmp(HrEmpMstVO hrEmpMstVO); // 사원수정

    public int checkCdEmpExistence(String cdEmp); // 사원코드 존재여부검사

    public List<HrEmpMstVO> getAllEmpList(); // 사원전체조회

    public HrEmpMstVO getCdEmp(String cdEmp); // 사원조회

    public int deleteEmp(String cdEmp); // 사원삭제
}
