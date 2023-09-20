package kr.or.oheasy.hrm.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.springframework.web.bind.annotation.RequestParam;

import kr.or.oheasy.hrm.vo.HrEmpMstCdEmpNmNameVO;
import kr.or.oheasy.hrm.vo.HrEmpMstJoinDtlVO;
import kr.or.oheasy.vo.HrBodyDataDtlVO;
import kr.or.oheasy.vo.HrCareerDtlVO;
import kr.or.oheasy.vo.HrEducationDtlVO;
import kr.or.oheasy.vo.HrEmpDtlVO;
import kr.or.oheasy.vo.HrEmpMstVO;
import kr.or.oheasy.vo.HrFamilyDtlVO;
import kr.or.oheasy.vo.HrLicenseDtlVO;
import kr.or.oheasy.vo.HrLicenseSdtlVO;
import kr.or.oheasy.vo.HrMilitaryInfoDtlVO;

public interface HrDao {
	
	// 사원 전체 리스트
	public List<HrEmpMstVO> getAllEmpList();	
	// 사원테이블에서 사원코드,이름 만 한명꺼  가져오기
	public HrEmpMstCdEmpNmNameVO getOneHrEmpData(String cdEmp);
	// 사원테이블엔 존재하지만 인사테이블엔 존재하지 않는 사원 리스트
	public List<HrEmpMstVO> getAllModalEmpList();
	// 자격증 리스트
	public List<HrLicenseSdtlVO> getLicenseList();
	// 조건 검색 사원 리스트 category = 0 재직자
	public List<HrEmpMstVO> getConditionalEmpListCategory0(@Param("category") int category,@Param("sort") int sort);
	// 조건 검색 사원 리스트 category = 1 퇴직자
	public List<HrEmpMstVO> getConditionalEmpListCategory1(@Param("category") int category,@Param("sort") int sort);
	// 조건 검색 사원 리스트 category = 2 재직자 + 당해년도 퇴사자
	public List<HrEmpMstVO> getConditionalEmpListCategory2(@Param("category") int category,@Param("sort") int sort);
	// 조건 검색 사원 리스트 category = 3 작년 퇴사자 + 당해년도 퇴사자 
	public List<HrEmpMstVO> getConditionalEmpListCategory3(@Param("category") int category,@Param("sort") int sort);
	
	// 기초정보 (mst + dtl)
	public HrEmpMstJoinDtlVO getOneEmpBasicData(String cdEmp); 
	
	// 사원 테이블 업데이트 (mst)
	public int updateHrEmpMst(@Param("cdEmp") String cdEmp, @Param("column") String column, @Param("value") String value);
	
	// 인사테이블에 insert 한명
	public int insertHrEmpData(String cdEmp);
	
	// 인사 테이블 업데이트 (dtl)
	public int updateHrEmpDtl(@Param("cdEmp") String cdEmp, @Param("column") String column, @Param("value") String value);
	
	
	// 가족 테이블
	public List<HrFamilyDtlVO> getFamilyDataList(String cdEmp);
	
	public int insertFamilyData(@Param("cdEmp") String cdEmp, @Param("column") String column, @Param("value") String value);
	
	public int updateFamilyData(@Param("seqFamily") String seqFamily, @Param("column") String column, @Param("value") String value);
	
	// 학력 테이블
	public List<HrEducationDtlVO> getEduDataList(String cdEmp);
	
	public int insertEduData(@Param("cdEmp") String cdEmp, @Param("column") String column, @Param("value") String value);
	
	public int updateEduData(@Param("seqEducation") String seqFamily, @Param("column") String column, @Param("value") String value);
	
	// 경력 테이블 
	public List<HrCareerDtlVO> getCareerDataList(String cdEmp);
	
	public int insertCareerData(@Param("cdEmp") String cdEmp, @Param("column") String column, @Param("value") String value);
	
	public int updateCareerData(@Param("seqCareer") String seqFamily, @Param("column") String column, @Param("value") String value);
	
	// 신체 테이블
	public HrBodyDataDtlVO getBodyData(String cdEmp);
	
	public int insertBodyData(String cdEmp);
	
	public int updateBodyData(@Param("cdEmp") String cdEmp, @Param("column") String column, @Param("value") String value);
	
	// 병역 테이블
	public int insertMilitaryData(String cdEmp);
	
	public HrMilitaryInfoDtlVO getMilitaryData(String cdEmp);
	
	public int updateMilitaryData(@Param("cdEmp") String cdEmp, @Param("column") String column, @Param("value") String value);
	
	
    // 자격 테이블 
    public List<HrLicenseDtlVO> getLicenseDataList(String cdEmp);
	
    public int insertLicenseData(@Param("cdEmp") String cdEmp, @Param("column") String column, @Param("value") String value);
    
    public int updateLicenseData(@Param("seqLicense") String seqLicense, @Param("column") String column, @Param("value") String value);
	
}
