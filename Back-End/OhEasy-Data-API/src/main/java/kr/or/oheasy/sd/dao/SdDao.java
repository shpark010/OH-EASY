package kr.or.oheasy.sd.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

import kr.or.oheasy.vo.HrEmpMstVO;
import kr.or.oheasy.vo.SdDeducationVO;
import kr.or.oheasy.vo.SdEmailInfoVO;
import kr.or.oheasy.vo.SdEmpInfoVO;
import kr.or.oheasy.vo.SdEmpMstVO;
import kr.or.oheasy.vo.SdPayDayListVO;
import kr.or.oheasy.vo.SdPdfInfoVO;
import kr.or.oheasy.vo.SdTaxAmountVO;
import kr.or.oheasy.vo.SdTaxRateVO;

public interface SdDao {
	//조건 조회(사원 리스트)
	public List<SdEmpMstVO> getEmpList(Map<String, String> empSearch);
	
	//사원 상세 정보
	public SdEmpInfoVO getEmpDetailData(String cd_Emp);
	
	//사원 세금 정보
	public List<SdDeducationVO> getEmpTax(Map<String, String> empData);
	
	//신규 급여 입력
	public int setEmpPay(Map<String, Object> searchData);
	
	//급여 정보 수정
	public int updateEmpPay(Map<String, Object> searchData);
	
	//세액 조건 조회
	public List<Long> getTaxInfo(Map<String, String> empSearch);
	
	//급여 자료 삭제
	public int deletePayData(Map<String, Object> paramMap);

	//지급일자 조회
	public List<SdPayDayListVO> getPayDayList();
	
	//과세 리스트 조회
	public List<SdTaxRateVO> getTaxList(Map<String, String> listData);
	
	//과세 리스트 조회
	public List<SdTaxRateVO> getAllTaxList(Map<String, String> searchData);
	
	//과세 리스트 수정
	public int updateTaxList(SdTaxRateVO updateTaxRate);
	
	//전체 사원 정보 수정을 위한 급여 및 일자 조회 
	public List<SdDeducationVO> getAllPayListForEdit(Map<String, Object> searchData);
	
	//이매일 발송을 위한 사원 급여 정보
	public List<SdEmailInfoVO> selectForMail(Map<String, Object> emailData);
	
	//PDF 출력을 위한 사원 급여 정보
	public SdPdfInfoVO selectForPdf(Map<String, String> pdfData);
	
	//각 공제 항목 별 업데이트
	public int updateEachDeduction(Map<String, Object> updateEachDeductionData);
}
