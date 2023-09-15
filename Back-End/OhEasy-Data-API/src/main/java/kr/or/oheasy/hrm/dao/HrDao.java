package kr.or.oheasy.hrm.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.springframework.web.bind.annotation.RequestParam;

import kr.or.oheasy.vo.HrEmpMstVO;
import kr.or.oheasy.vo.HrFamilyDtlVO;

public interface HrDao {
	
	// 사원 전체 리스트
	public List<HrEmpMstVO> getAllEmpList();	
	// 조건 검색 사원 리스트 category = 0 재직자
	public List<HrEmpMstVO> getConditionalEmpListCategory0(@Param("category") int category,@Param("sort") int sort);
	// 조건 검색 사원 리스트 category = 1 퇴직자
	public List<HrEmpMstVO> getConditionalEmpListCategory1(@Param("category") int category,@Param("sort") int sort);
	// 조건 검색 사원 리스트 category = 2 재직자 + 당해년도 퇴사자
	public List<HrEmpMstVO> getConditionalEmpListCategory2(@Param("category") int category,@Param("sort") int sort);
	// 조건 검색 사원 리스트 category = 3 작년 퇴사자 + 당해년도 퇴사자 
	public List<HrEmpMstVO> getConditionalEmpListCategory3(@Param("category") int category,@Param("sort") int sort);
	
	public HrEmpMstVO getOneEmpBasicData(String cdEmp); 
	
	public int updateEmpBasicData(@Param("cdEmp") String cdEmp, @Param("column") String column, @Param("value") String value);
	
	public List<HrFamilyDtlVO> getFamilyDataList(String cdEmp);
	
	public int insertFamilyData(@Param("cdEmp") String cdEmp, @Param("column") String column, @Param("value") String value);
	
	public int updateFamilyData(@Param("seqFamily") String seqFamily, @Param("column") String column, @Param("value") String value);
	

}
