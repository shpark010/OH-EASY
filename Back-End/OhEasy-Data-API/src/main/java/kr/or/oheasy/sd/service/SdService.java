package kr.or.oheasy.sd.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

import kr.or.oheasy.sd.dao.SdDao;
import kr.or.oheasy.vo.SdDeducationVO;
import kr.or.oheasy.vo.SdEmailInfoVO;
import kr.or.oheasy.vo.SdEmpInfoVO;
import kr.or.oheasy.vo.SdEmpMstVO;
import kr.or.oheasy.vo.SdPayDayListVO;
import kr.or.oheasy.vo.SdPdfInfoVO;
import kr.or.oheasy.vo.SdTaxAmountVO;
import kr.or.oheasy.vo.SdTaxRateVO;

@Service
public class SdService {

	@Autowired
	private SqlSession sqlSession;

	// 조건 조회(사원 리스트)
	public Map<String, Object> getAllEmpList(Map<String, String> empSearch) {
		SdDao dao = sqlSession.getMapper(SdDao.class);
		// 연도
		String yyAllowance = empSearch.get("belongingDate").substring(0, 4);
		// 귀속월
		String mmBelong = empSearch.get("belongingDate").substring(4, 6);
		// 지급일
		String dtAllowance = empSearch.get("payDay");
		// 조회 정렬
		String searchOrder = empSearch.get("searchOrder");
		// 조회 구분
		String searchTaxOrder = empSearch.get("searchTaxOrder");
		HashMap<String, String> empData = new HashMap<>();
		empData.put("yyAllowance", yyAllowance);
		empData.put("mmBelong", mmBelong);
		empData.put("dtAllowance", dtAllowance);
		empData.put("searchOrder", searchOrder);
		empData.put("searchTaxOrder", searchTaxOrder);
		SdTaxAmountVO taxInfo = new SdTaxAmountVO();
		Map<String, Object> resultData = new HashMap<>();
		try {
			List<Long> deducationList = dao.getTaxInfo(empData);
			taxInfo = new SdTaxAmountVO(deducationList.get(0), deducationList.get(1), deducationList.get(2),
					deducationList.get(4), deducationList.get(3), deducationList.get(5), deducationList.get(6));
		} catch (Exception e) {
			System.out.println(e.getMessage());
		}
		resultData.put("searchTaxInfo", taxInfo);
		List<SdEmpMstVO> empList = dao.getEmpList(empSearch);
		resultData.put("empSearch", empList);
		return resultData;
	}

	// 사원 상세 정보
	public Map<String, Object> getEmpDetailData(Map<String, String> empInfo) {
		SdDao dao = sqlSession.getMapper(SdDao.class);
		String cd_Emp = empInfo.get("code");
		
		// 연도
		String yyAllowance = empInfo.get("belongingDate").substring(0, 4);
		// 귀속월
		String mmBelong = empInfo.get("belongingDate").substring(4, 6);
		// 지급일
		String dtAllowance = empInfo.get("payDay");
		// 조회 구분
		String searchTaxOrder = empInfo.get("searchTaxOrder");
		HashMap<String, String> empData = new HashMap<>();
		empData.put("cdEmp", cd_Emp);
		empData.put("yyAllowance", yyAllowance);
		empData.put("mmBelong", mmBelong);
		empData.put("dtAllowance", dtAllowance);
		empData.put("searchTaxOrder", searchTaxOrder);
		Map<String, Object> resultData = new HashMap<>();
		SdEmpInfoVO searchInfo = dao.getEmpDetailData(cd_Emp);
		resultData.put("searchInfo", searchInfo);
		SdTaxAmountVO emptaxInfo = new SdTaxAmountVO();
		SdTaxAmountVO searchTaxInfo = new SdTaxAmountVO();
		try {
			List<SdDeducationVO> empTaxInfoList = dao.getEmpTax(empData);
			emptaxInfo = new SdTaxAmountVO(empTaxInfoList.get(0).getAmtAllowance(),
					empTaxInfoList.get(1).getAmtAllowance(), empTaxInfoList.get(2).getAmtAllowance(),
					empTaxInfoList.get(4).getAmtAllowance(), empTaxInfoList.get(3).getAmtAllowance(),
					empTaxInfoList.get(5).getAmtAllowance(), empTaxInfoList.get(6).getAmtAllowance());
		} catch (Exception e) {
			System.out.println("사원 급여 오류");
			System.out.println(e.getMessage());
		}
		try {
			List<Long> searchTaxInfoList = dao.getTaxInfo(empData);
			searchTaxInfo = new SdTaxAmountVO(searchTaxInfoList.get(0), searchTaxInfoList.get(1),
					searchTaxInfoList.get(2), searchTaxInfoList.get(4), searchTaxInfoList.get(3),
					searchTaxInfoList.get(5), searchTaxInfoList.get(6));
		} catch (Exception e) {
			System.out.println("조회구분 오류");
			System.out.println(e.getMessage());
		}
		resultData.put("empTaxInfo", emptaxInfo);
		resultData.put("searchTaxInfo", searchTaxInfo);
		return resultData;
	}

	// 조회 구분
	public Map<String, Object> searchTaxInfo(Map<String, String> searchTax) {
		SdDao dao = sqlSession.getMapper(SdDao.class);
		String cd_Emp = searchTax.get("code");
		// 연도
		String yyAllowance = searchTax.get("belongingDate").substring(0, 4);
		// 귀속월
		String mmBelong = searchTax.get("belongingDate").substring(4, 6);
		// 지급일
		String dtAllowance = searchTax.get("payDay");
		// 조회 구분
		String searchTaxOrder = searchTax.get("searchTaxOrder");
		HashMap<String, String> empData = new HashMap<>();
		empData.put("cdEmp", cd_Emp);
		empData.put("yyAllowance", yyAllowance);
		empData.put("mmBelong", mmBelong);
		empData.put("dtAllowance", dtAllowance);
		empData.put("searchTaxOrder", searchTaxOrder);
		Map<String, Object> resultData = new HashMap<>();
		SdTaxAmountVO searchTaxInfo = new SdTaxAmountVO();
		try {
			List<Long> searchTaxInfoList = dao.getTaxInfo(empData);
			searchTaxInfo = new SdTaxAmountVO(searchTaxInfoList.get(0), searchTaxInfoList.get(1),
					searchTaxInfoList.get(2), searchTaxInfoList.get(4), searchTaxInfoList.get(3),
					searchTaxInfoList.get(5), searchTaxInfoList.get(6));
		} catch (Exception e) {
			System.out.println("조회구분 오류");
			System.out.println(e.getMessage());
		}
		resultData.put("searchTaxInfo", searchTaxInfo);
		return resultData;
	}

	// 신규 급여 입력
	public Map<String, Object> setEmpPay(Map<String, String> insertPay) {
		SdDao dao = sqlSession.getMapper(SdDao.class);
		// 사원코드
		String cd_Emp = insertPay.get("code");
		// 입력 급여
		long pay = Long.parseLong(insertPay.get("pay").replaceAll(",", ""));
		// 연도
		String yyAllowance = insertPay.get("belongingDate").substring(0, 4);
		// 귀속월
		String mmBelong = insertPay.get("belongingDate").substring(4, 6);
		// 지급일
		String dtAllowance = insertPay.get("payDay");
		// 조회 구분
		String searchTaxOrder = insertPay.get("searchTaxOrder");
		HashMap<String, String> empData = new HashMap<>();
		empData.put("cdEmp", cd_Emp);
		empData.put("yyAllowance", yyAllowance);
		empData.put("mmBelong", mmBelong);
		empData.put("dtAllowance", dtAllowance);
		empData.put("searchTaxOrder", searchTaxOrder);
		Map<String, Object> resultData = new HashMap<>();
		List<SdTaxRateVO> taxRateList = new ArrayList<>();
		try {
			taxRateList = dao.getAllTaxList(empData);
		} catch (Exception e) {
			System.out.println("과세 리스트 오류");
			System.out.println(e.getMessage());
		}
		Map<String, Object> searchData = new HashMap<>();
		searchData.put("taxRateList", taxRateList);
		searchData.put("cdEmp", cd_Emp);
		searchData.put("amtAllowance", pay);
		searchData.put("yyAllowance", yyAllowance);
		searchData.put("mmBelong", mmBelong);
		searchData.put("dtAllowance", dtAllowance);
		searchData.put("searchTaxOrder", searchTaxOrder);
		// 삽입
		int insertResult = dao.setEmpPay(searchData);
		// 계산 결과 조회
		SdTaxAmountVO emptaxInfo = new SdTaxAmountVO();
		try {
			List<SdDeducationVO> empTaxInfoList = dao.getEmpTax(empData);
			emptaxInfo = new SdTaxAmountVO(empTaxInfoList.get(0).getAmtAllowance(),
					empTaxInfoList.get(1).getAmtAllowance(), empTaxInfoList.get(2).getAmtAllowance(),
					empTaxInfoList.get(3).getAmtAllowance(), empTaxInfoList.get(4).getAmtAllowance(),
					empTaxInfoList.get(5).getAmtAllowance(), empTaxInfoList.get(6).getAmtAllowance());
		} catch (Exception e) {
			System.out.println("사원 급여 오류");
			System.out.println(e.getMessage());
		}
		SdTaxAmountVO searchTaxInfo = new SdTaxAmountVO();
		try {
			List<Long> searchTaxInfoList = dao.getTaxInfo(empData);
			searchTaxInfo = new SdTaxAmountVO(searchTaxInfoList.get(0), searchTaxInfoList.get(1),
					searchTaxInfoList.get(2), searchTaxInfoList.get(3), searchTaxInfoList.get(4),
					searchTaxInfoList.get(5), searchTaxInfoList.get(6));
		} catch (Exception e) {
			System.out.println("조회구분 오류");
			System.out.println(e.getMessage());
		}
		resultData.put("empTaxInfo", emptaxInfo);
		resultData.put("searchTaxInfo", searchTaxInfo);
		return resultData;
	}

	// 급여 수정
	public Map<String, Object> updateEmpPay(Map<String, String> updatePay) {
		SdDao dao = sqlSession.getMapper(SdDao.class);
		// 사원코드
		String cd_Emp = updatePay.get("code");
		// 입력 급여
		long pay = Long.parseLong(updatePay.get("pay").replaceAll(",", ""));
		// 연도
		String yyAllowance = updatePay.get("belongingDate").substring(0, 4);
		// 귀속월
		String mmBelong = updatePay.get("belongingDate").substring(4, 6);
		// 지급일
		String dtAllowance = updatePay.get("payDay");
		// 조회 구분
		String searchTaxOrder = updatePay.get("searchTaxOrder");
		HashMap<String, String> empData = new HashMap<>();
		empData.put("cdEmp", cd_Emp);
		empData.put("yyAllowance", yyAllowance);
		empData.put("mmBelong", mmBelong);
		empData.put("dtAllowance", dtAllowance);
		empData.put("searchTaxOrder", searchTaxOrder);
		Map<String, Object> resultData = new HashMap<>();
		List<SdTaxRateVO> taxRateList = new ArrayList<>();
		try {
			taxRateList = dao.getAllTaxList(empData);
			System.out.println(taxRateList);
		} catch (Exception e) {
			System.out.println("과세 리스트 오류");
			System.out.println(e.getMessage());
		}
		for (SdTaxRateVO sdTaxRateVO : taxRateList) {
			Map<String, Object> searchData = new HashMap<>();
			searchData.put("taxRateList", sdTaxRateVO);
			searchData.put("cdEmp", cd_Emp);
			searchData.put("amtAllowance", pay);
			searchData.put("yyAllowance", yyAllowance);
			searchData.put("mmBelong", mmBelong);
			searchData.put("dtAllowance", dtAllowance);
			// 수정
			int updateResult = dao.updateEmpPay(searchData);			
		}
		
		// 계산 결과 조회
		SdTaxAmountVO emptaxInfo = new SdTaxAmountVO();
		SdTaxAmountVO searchTaxInfo = new SdTaxAmountVO();
		try {
			List<SdDeducationVO> empTaxInfoList = dao.getEmpTax(empData);
			emptaxInfo = new SdTaxAmountVO(empTaxInfoList.get(0).getAmtAllowance(),
					empTaxInfoList.get(1).getAmtAllowance(), empTaxInfoList.get(2).getAmtAllowance(),
					empTaxInfoList.get(3).getAmtAllowance(), empTaxInfoList.get(4).getAmtAllowance(),
					empTaxInfoList.get(5).getAmtAllowance(), empTaxInfoList.get(6).getAmtAllowance());
		} catch (Exception e) {
			System.out.println("사원 급여 오류");
			System.out.println(e.getMessage());
		}
		try {
			List<Long> searchTaxInfoList = dao.getTaxInfo(empData);
			searchTaxInfo = new SdTaxAmountVO(searchTaxInfoList.get(0), searchTaxInfoList.get(1),
					searchTaxInfoList.get(2), searchTaxInfoList.get(3), searchTaxInfoList.get(4),
					searchTaxInfoList.get(5), searchTaxInfoList.get(6));
		} catch (Exception e) {
			System.out.println("조회구분 오류");
			System.out.println(e.getMessage());
		}
		resultData.put("empTaxInfo", emptaxInfo);
		resultData.put("searchTaxInfo", searchTaxInfo);
		return resultData;
	}

	// 급여 자료 삭제
	public Map<String, Object> deletePayData(Map<String, Object> deleteData) {
		SdDao dao = sqlSession.getMapper(SdDao.class);
		// 삭제 사원 리스트
		List<String> cdEmpList = (List<String>) deleteData.get("code");
		// 클릭 사원 코드
		String cdEmp = deleteData.get("clickEmpCode").toString();
		System.out.println("클릭된 사원 : " + cdEmp);
		// 연도
		String yyAllowance = deleteData.get("belongingDate").toString().substring(0, 4);
		// 귀속월
		String mmBelong = deleteData.get("belongingDate").toString().substring(4, 6);
		// 지급일
		String dtAllowance = deleteData.get("payDay").toString();
		// 조회 구분
		String searchTaxOrder = deleteData.get("searchTaxOrder").toString();
		HashMap<String, String> empData = new HashMap<>();
		empData.put("yyAllowance", yyAllowance);
		empData.put("mmBelong", mmBelong);
		empData.put("dtAllowance", dtAllowance);
		empData.put("cdEmp", cdEmp);
		empData.put("searchTaxOrder", searchTaxOrder);
		Map<String, Object> paramMap = new HashMap<>();
		paramMap.put("cdEmpList", cdEmpList);
		paramMap.put("yyAllowance", yyAllowance);
		paramMap.put("mmBelong", mmBelong);
		paramMap.put("dtAllowance", dtAllowance);
		paramMap.put("searchTaxOrder", searchTaxOrder);
		Map<String, Object> resultData = new HashMap<>();
		// 계산 결과 조회
		SdTaxAmountVO emptaxInfo = new SdTaxAmountVO();
		SdTaxAmountVO searchTaxInfo = new SdTaxAmountVO();
		int deleteResult = 0;
		try {
			deleteResult = dao.deletePayData(paramMap);
		} catch (Exception e) {
			System.out.println("급여 삭제 오류");
			System.out.println(e.getMessage());
		}
		try {
			List<SdDeducationVO> empTaxInfoList = dao.getEmpTax(empData);
			emptaxInfo = new SdTaxAmountVO(empTaxInfoList.get(0).getAmtAllowance(),
					empTaxInfoList.get(1).getAmtAllowance(), empTaxInfoList.get(2).getAmtAllowance(),
					empTaxInfoList.get(3).getAmtAllowance(), empTaxInfoList.get(4).getAmtAllowance(),
					empTaxInfoList.get(5).getAmtAllowance(), empTaxInfoList.get(6).getAmtAllowance());
		} catch (Exception e) {
			System.out.println("사원 급여 오류");
			System.out.println(e.getMessage());
		}
		try {
			List<Long> searchTaxInfoList = dao.getTaxInfo(empData);
			searchTaxInfo = new SdTaxAmountVO(searchTaxInfoList.get(0), searchTaxInfoList.get(1),
					searchTaxInfoList.get(2), searchTaxInfoList.get(3), searchTaxInfoList.get(4),
					searchTaxInfoList.get(5), searchTaxInfoList.get(6));
		} catch (Exception e) {
			System.out.println("조회구분 오류");
			System.out.println(e.getMessage());
		}
		resultData.put("empTaxInfo", emptaxInfo);
		resultData.put("searchTaxInfo", searchTaxInfo);
		return resultData;
	}

	//지급일자 조회
	public Map<String, Object> getPayDayList(Map<String, String> payDayData) {
		SdDao dao = sqlSession.getMapper(SdDao.class);
		Map<String, Object> resultData = new HashMap<>();
		List<SdPayDayListVO> payDayList = new ArrayList<>();
		try {
			payDayList = dao.getPayDayList();
			System.out.println(payDayList);
		} catch (Exception e) {
			System.out.println("지급일자 오류");
			System.out.println(e.getMessage());
		}
		resultData.put("payDayList", payDayList);
		return resultData;
	}
	
	//과세 리스트 조회
	public Map<String, Object> getTaxList(Map<String, String> taxListData) {
		SdDao dao = sqlSession.getMapper(SdDao.class);
		Map<String, Object> resultData = new HashMap<>();
		List<SdTaxRateVO> taxList = new ArrayList<>();
		try {
			taxList = dao.getTaxList(taxListData);
		} catch (Exception e) {
			System.out.println("과세 리스트 오류");
			System.out.println(e.getMessage());
		}
		resultData.put("taxList", taxList);
		return resultData;
	}
	
	//과세 리스트 수정
	public Map<String, Object> updateTaxList(Map<String, Object> updateTaxListData) {
		SdDao dao = sqlSession.getMapper(SdDao.class);
	    Map<String, Object> resultData = new HashMap<>();
	    Map<String, Object> updateData = new HashMap<>();

	    List<Map<String, Object>> editTaxListData = (List<Map<String, Object>>) updateTaxListData.get("editTaxList");

	    ObjectMapper objectMapper = new ObjectMapper();
	    List<SdTaxRateVO> taxList = new ArrayList<>();
	    for (Map<String, Object> item : editTaxListData) {
	        SdTaxRateVO sdTaxRateVO = objectMapper.convertValue(item, SdTaxRateVO.class);
	        taxList.add(sdTaxRateVO);
	    }

	    for (SdTaxRateVO sdTaxRateVO : taxList) {
	        int updateResult = dao.updateTaxList(sdTaxRateVO);
	    }

		Map<String, String> yearData = new HashMap<>();
		List<SdTaxRateVO> taxRateList = new ArrayList<>();
		yearData.put("yyAllowance", (String)updateTaxListData.get("applyYear"));
		try {
			taxRateList = dao.getAllTaxList(yearData);
		} catch (Exception e) {
			System.out.println("과세 리스트 오류");
			System.out.println(e.getMessage());
		}
		Map<String, Object> payListData = new HashMap<>();
		payListData.put("yyAllowance", (String)updateTaxListData.get("applyYear"));
		payListData.put("checkList", (List<String>)updateTaxListData.get("checkList"));
		List<SdDeducationVO> payList = new ArrayList<>();
		try {
			payList = dao.getAllPayListForEdit(payListData);
		} catch (Exception e) {
			System.out.println("전체 사원 정보 수정을 위한 급여 및 일자 조회 오류");
			System.out.println(e.getMessage());
		}
		for (SdDeducationVO sdDeducationVO : payList) {
			for (SdTaxRateVO sdTaxRateVO : taxRateList) {
				Map<String, Object> searchData = new HashMap<>();
				searchData.put("taxRateList", sdTaxRateVO);
				searchData.put("cdEmp", sdDeducationVO.getCdEmp());
				searchData.put("amtAllowance", sdDeducationVO.getAmtAllowance());
				searchData.put("yyAllowance", updateTaxListData.get("applyYear"));
				searchData.put("mmBelong", sdDeducationVO.getMmBelong());
				searchData.put("dtAllowance", sdDeducationVO.getDtAllowance());
				// 수정
				int updateResult = dao.updateEmpPay(searchData);			
			}			
		}
		return resultData;
	}
	
	//이메일 발송을 위한 조회
	public List<SdEmailInfoVO> seletForMail(Map<String, Object> emailData) {
		SdDao dao = sqlSession.getMapper(SdDao.class);
		List<SdEmailInfoVO> emailInfoList = new ArrayList<>();
		try {
			emailInfoList = dao.selectForMail(emailData);
		} catch (Exception e) {
			e.getMessage();
		}
		return emailInfoList;
	}
	
	// PDF 출력을 위한 조회
	public SdPdfInfoVO seletForPdf(Map<String, String> pdfData) {
		SdDao dao = sqlSession.getMapper(SdDao.class);
		// 사원코드
		String code = pdfData.get("code");
		// 연도
		String yyAllowance = pdfData.get("belongingDate").toString().substring(0, 4);
		// 귀속월
		String mmBelong = pdfData.get("belongingDate").toString().substring(4, 6);
		// 지급일
		String dtAllowance = pdfData.get("dtAllowance").toString();
		Map<String, String> searchData = new HashMap<>();
		searchData.put("yyAllowance", yyAllowance);
		searchData.put("mmBelong", mmBelong);
		searchData.put("dtAllowance", dtAllowance);
		searchData.put("cdEmp", code);
		SdPdfInfoVO pdfInfo = new SdPdfInfoVO();
		try {
			pdfInfo = dao.selectForPdf(searchData);
		} catch (Exception e) {
			e.getMessage();

		}
		return pdfInfo;
	}
	
	// 각 공제 항목별 업데이트
	public Map<String, Object> updateEachDeduction(Map<String, String> updateEachDeductionData) {
		SdDao dao = sqlSession.getMapper(SdDao.class);
		// 사원코드
		String cdEmp = updateEachDeductionData.get("clickEmpCode");
		// 입력 급여
		long amtTax = Long.parseLong(updateEachDeductionData.get("amtTax").replaceAll(",", ""));
		// 공제 항목명
		String nmTax = updateEachDeductionData.get("nmTax");
		// 연도
		String yyAllowance = updateEachDeductionData.get("belongingDate").toString().substring(0, 4);
		// 귀속월
		String mmBelong = updateEachDeductionData.get("belongingDate").toString().substring(4, 6);
		// 지급일
		String dtAllowance = updateEachDeductionData.get("payDay").toString();
		// 조회 구분
		String searchTaxOrder = updateEachDeductionData.get("searchTaxOrder");
		Map<String, Object> resultData = new HashMap<>();
		Map<String, Object> updateData = new HashMap<>();
		updateData.put("cdEmp", cdEmp);
		updateData.put("amtTax", amtTax);
		updateData.put("nmTax", nmTax);
		updateData.put("yyAllowance", yyAllowance);
		updateData.put("mmBelong", mmBelong);
		updateData.put("dtAllowance", dtAllowance);
		updateData.put("searchTaxOrder", searchTaxOrder);
		try {
			int updateResult = dao.updateEachDeduction(updateData);
		} catch (Exception e) {
			e.getMessage();
		}
		Map<String, String> searchData = new HashMap<>();
		searchData.put("cdEmp", cdEmp);
		searchData.put("yyAllowance", yyAllowance);
		searchData.put("mmBelong", mmBelong);
		searchData.put("dtAllowance", dtAllowance);
		searchData.put("searchTaxOrder", searchTaxOrder);
		// 계산 결과 조회
		SdTaxAmountVO emptaxInfo = new SdTaxAmountVO();
		SdTaxAmountVO searchTaxInfo = new SdTaxAmountVO();
		try {
			List<SdDeducationVO> empTaxInfoList = dao.getEmpTax(searchData);
			emptaxInfo = new SdTaxAmountVO(empTaxInfoList.get(0).getAmtAllowance(),
					empTaxInfoList.get(1).getAmtAllowance(), empTaxInfoList.get(2).getAmtAllowance(),
					empTaxInfoList.get(3).getAmtAllowance(), empTaxInfoList.get(4).getAmtAllowance(),
					empTaxInfoList.get(5).getAmtAllowance(), empTaxInfoList.get(6).getAmtAllowance());
		} catch (Exception e) {
			System.out.println("사원 급여 오류");
			System.out.println(e.getMessage());
		}
		try {
			List<Long> searchTaxInfoList = dao.getTaxInfo(searchData);
			searchTaxInfo = new SdTaxAmountVO(searchTaxInfoList.get(0), searchTaxInfoList.get(1),
					searchTaxInfoList.get(2), searchTaxInfoList.get(3), searchTaxInfoList.get(4),
					searchTaxInfoList.get(5), searchTaxInfoList.get(6));
		} catch (Exception e) {
			System.out.println("조회구분 오류");
			System.out.println(e.getMessage());
		}
		resultData.put("empTaxInfo", emptaxInfo);
		resultData.put("searchTaxInfo", searchTaxInfo);
		return resultData;
	}
}
