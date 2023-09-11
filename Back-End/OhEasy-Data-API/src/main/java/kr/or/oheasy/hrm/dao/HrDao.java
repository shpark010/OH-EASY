package kr.or.oheasy.hrm.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import kr.or.oheasy.vo.HrEmpMstVO;
import kr.or.oheasy.vo.HrFamilyDtlVO;

public interface HrDao {
	
	public List<HrEmpMstVO> getAllEmpList();
	
	public List<HrFamilyDtlVO> getFamilyDataList(String cdEmp);
	
	public int insertFamilyData(@Param("cdEmp") String cdEmp, @Param("column") String column, @Param("value") String value);
	
	public int updateFamilyData(@Param("seqFamily") String seqFamily, @Param("column") String column, @Param("value") String value);
	

}
