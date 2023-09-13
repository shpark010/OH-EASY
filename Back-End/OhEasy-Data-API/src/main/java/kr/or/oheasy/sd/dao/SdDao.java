package kr.or.oheasy.sd.dao;

import java.util.List;
import java.util.Map;

import kr.or.oheasy.vo.HrEmpMstVO;
import kr.or.oheasy.vo.SdDeducationVO;
import kr.or.oheasy.vo.SdEmpInfoVO;
import kr.or.oheasy.vo.SdTaxAmountVO;

public interface SdDao {
	//조건 조회(사원 리스트)
	public List<HrEmpMstVO> getEmpList(Map<String, String> empSearch);
	
	//사원 상세 정보
	public SdEmpInfoVO getEmpDetailData(String cd_Emp);
	
	//사원 세금 정보
	public List<SdDeducationVO> getEmpTax(Map<String, String> empData);
	
	//신규 급여 입력
	public int setEmpPay(List<SdDeducationVO> taxList);
	
	

}
