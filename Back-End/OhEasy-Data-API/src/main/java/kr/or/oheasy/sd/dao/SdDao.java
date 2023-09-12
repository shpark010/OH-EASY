package kr.or.oheasy.sd.dao;

import java.util.List;
import java.util.Map;

import kr.or.oheasy.vo.HrEmpMstVO;
import kr.or.oheasy.vo.SdEmpInfoVO;

public interface SdDao {
	//조건 조회(사원 리스트)
	public List<HrEmpMstVO> getEmpList(Map<String, String> empSearch);
	
	//사원 상세 정보
	public SdEmpInfoVO getEmpDetailData(String cd_Emp);

}
