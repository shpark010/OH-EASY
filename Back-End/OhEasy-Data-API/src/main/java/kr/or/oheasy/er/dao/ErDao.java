package kr.or.oheasy.er.dao;

import kr.or.oheasy.vo.HrEmpMstVO;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

public interface ErDao {

    public int postEmp(HrEmpMstVO hrEmpMstVO); // 사원등록

    public int updateEmp(@Param("cdEmp") String cdEmp,
                         @Param("column") String column,
                         @Param("value") String value); // 사원수정

    public int checkCdEmpExistence(String cdEmp); // 사원코드 존재여부검사

    public List<HrEmpMstVO> getAllEmpList(); // 사원전체조회

    public HrEmpMstVO getCdEmp(String cdEmp); // 사원조회

    public int deleteEmp(String cdEmp); // 사원삭제

    public Map<String, Object> checkReferences(String cdEmp); // FK 참조하는 테이블 확인

    public List<HrEmpMstVO> getDeptList(); // 부서전체조회

    public List<HrEmpMstVO> getBankList(); // 은행전체조회

}
