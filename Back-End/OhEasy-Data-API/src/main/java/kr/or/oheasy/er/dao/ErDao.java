package kr.or.oheasy.er.dao;

import kr.or.oheasy.vo.HrEmpMstVO;
import java.util.List;

public interface ErDao {

    public int postEmp(HrEmpMstVO hrEmpMstVO); // 사원등록

    public List<HrEmpMstVO> getAllEmpList(); // 사원전체조회

    public HrEmpMstVO getCdEmp(String cdEmp); // 사원조회

    public int deleteEmp(String cdEmp); // 사원삭제
}
