package kr.or.oheasy.hrm.dao;

import java.util.List;

import kr.or.oheasy.vo.HrEmpMstVO;
import kr.or.oheasy.vo.HrFamilyDtlVO;

public interface HrDao {
	
	public List<HrEmpMstVO> getAllEmpList();
	
	public List<HrFamilyDtlVO> getFamilyDataList(String cdEmp);

}
