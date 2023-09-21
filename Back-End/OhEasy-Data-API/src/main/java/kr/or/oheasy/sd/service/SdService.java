package kr.or.oheasy.sd.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.or.oheasy.sd.dao.SdDao;
import kr.or.oheasy.vo.HrEmpMstVO;
import kr.or.oheasy.vo.SdDeducationVO;
import kr.or.oheasy.vo.SdEmpInfoVO;
import kr.or.oheasy.vo.SdEmpMstVO;
import kr.or.oheasy.vo.SdTaxAmountVO;

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
		System.out.println(searchTaxOrder);
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
			taxInfo = new SdTaxAmountVO(deducationList.get(0), deducationList.get(1),
					deducationList.get(2), deducationList.get(4),
					deducationList.get(3), deducationList.get(5),
					deducationList.get(6));
			System.out.println(taxInfo);
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
		System.out.println("조회구분 : " + searchTaxOrder);
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
			emptaxInfo = new SdTaxAmountVO(empTaxInfoList.get(0).getAmtAllowance(), empTaxInfoList.get(1).getAmtAllowance(),
					empTaxInfoList.get(2).getAmtAllowance(), empTaxInfoList.get(4).getAmtAllowance(),
					empTaxInfoList.get(3).getAmtAllowance(), empTaxInfoList.get(5).getAmtAllowance(),
					empTaxInfoList.get(6).getAmtAllowance());
		} catch (Exception e) {
			System.out.println("사원 급여 오류");
			System.out.println(e.getMessage());
		}
		try {
			List<Long> searchTaxInfoList = dao.getTaxInfo(empData);
			searchTaxInfo = new SdTaxAmountVO(searchTaxInfoList.get(0), searchTaxInfoList.get(1),
					searchTaxInfoList.get(2), searchTaxInfoList.get(4),
					searchTaxInfoList.get(3), searchTaxInfoList.get(5),
					searchTaxInfoList.get(6));
		} catch (Exception e) {
			System.out.println("조회구분 오류");
			System.out.println(e.getMessage());
		}
		resultData.put("empTaxInfo", emptaxInfo);
		resultData.put("searchTaxInfo", searchTaxInfo);
		return resultData;
	}
	
	//조회 구분
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
		System.out.println("조회구분 : " + searchTaxOrder);
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
					searchTaxInfoList.get(2), searchTaxInfoList.get(4),
					searchTaxInfoList.get(3), searchTaxInfoList.get(5),
					searchTaxInfoList.get(6));
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
		List<SdDeducationVO> taxList = new ArrayList<>();
		//기본급 리스트 추가
		taxList.add(new SdDeducationVO(cd_Emp, "101", pay, 0, yyAllowance, mmBelong, dtAllowance));
		//501 리스트 추가
		taxList.add(new SdDeducationVO(cd_Emp, "501", pay, 0, yyAllowance, mmBelong, dtAllowance));
		//502 리스트 추가
		taxList.add(new SdDeducationVO(cd_Emp, "502", pay, 0, yyAllowance, mmBelong, dtAllowance));
		//503 리스트 추가
		taxList.add(new SdDeducationVO(cd_Emp, "503", pay, 0, yyAllowance, mmBelong, dtAllowance));
		//504 리스트 추가
		taxList.add(new SdDeducationVO(cd_Emp, "504", pay, 0, yyAllowance, mmBelong, dtAllowance));
		//505 리스트 추가
		taxList.add(new SdDeducationVO(cd_Emp, "505", pay, 0, yyAllowance, mmBelong, dtAllowance));
		//506 리스트 추가
		taxList.add(new SdDeducationVO(cd_Emp, "506", pay, 0, yyAllowance, mmBelong, dtAllowance));
		//삽입
		int insertResult = dao.setEmpPay(taxList);
		//계산 결과 조회
		SdTaxAmountVO emptaxInfo = new SdTaxAmountVO();
		SdTaxAmountVO searchTaxInfo = new SdTaxAmountVO();
		try {
			List<SdDeducationVO> empTaxInfoList = dao.getEmpTax(empData);
			emptaxInfo = new SdTaxAmountVO(empTaxInfoList.get(0).getAmtAllowance(), empTaxInfoList.get(1).getAmtAllowance(),
					empTaxInfoList.get(2).getAmtAllowance(), empTaxInfoList.get(4).getAmtAllowance(),
					empTaxInfoList.get(3).getAmtAllowance(), empTaxInfoList.get(5).getAmtAllowance(),
					empTaxInfoList.get(6).getAmtAllowance());
		} catch (Exception e) {
			System.out.println("사원 급여 오류");
			System.out.println(e.getMessage());
		}
		try {
			List<Long> searchTaxInfoList = dao.getTaxInfo(empData);
			searchTaxInfo = new SdTaxAmountVO(searchTaxInfoList.get(0), searchTaxInfoList.get(1),
					searchTaxInfoList.get(2), searchTaxInfoList.get(4),
					searchTaxInfoList.get(3), searchTaxInfoList.get(5),
					searchTaxInfoList.get(6));
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
		System.out.println("입력 급여 : " + pay);
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
		List<SdDeducationVO> taxList = new ArrayList<>();
		//기본급 리스트 추가
		taxList.add(new SdDeducationVO(cd_Emp, "101", pay, 0, yyAllowance, mmBelong, dtAllowance));
		//501 리스트 추가
		taxList.add(new SdDeducationVO(cd_Emp, "501", pay, 0, yyAllowance, mmBelong, dtAllowance));
		//502 리스트 추가
		taxList.add(new SdDeducationVO(cd_Emp, "502", pay, 0, yyAllowance, mmBelong, dtAllowance));
		//503 리스트 추가
		taxList.add(new SdDeducationVO(cd_Emp, "503", pay, 0, yyAllowance, mmBelong, dtAllowance));
		//504 리스트 추가
		taxList.add(new SdDeducationVO(cd_Emp, "504", pay, 0, yyAllowance, mmBelong, dtAllowance));
		//505 리스트 추가
		taxList.add(new SdDeducationVO(cd_Emp, "505", pay, 0, yyAllowance, mmBelong, dtAllowance));
		//506 리스트 추가
		taxList.add(new SdDeducationVO(cd_Emp, "506", pay, 0, yyAllowance, mmBelong, dtAllowance));
		//수정
		for (SdDeducationVO deducation : taxList) {
	       dao.updateEmpPay(deducation);
	    }
		//계산 결과 조회
		SdTaxAmountVO emptaxInfo = new SdTaxAmountVO();
		SdTaxAmountVO searchTaxInfo = new SdTaxAmountVO();
		try {
			List<SdDeducationVO> empTaxInfoList = dao.getEmpTax(empData);
			emptaxInfo = new SdTaxAmountVO(empTaxInfoList.get(0).getAmtAllowance(), empTaxInfoList.get(1).getAmtAllowance(),
					empTaxInfoList.get(2).getAmtAllowance(), empTaxInfoList.get(4).getAmtAllowance(),
					empTaxInfoList.get(3).getAmtAllowance(), empTaxInfoList.get(5).getAmtAllowance(),
					empTaxInfoList.get(6).getAmtAllowance());
		} catch (Exception e) {
			System.out.println("사원 급여 오류");
			System.out.println(e.getMessage());
		}
		try {
			List<Long> searchTaxInfoList = dao.getTaxInfo(empData);
			searchTaxInfo = new SdTaxAmountVO(searchTaxInfoList.get(0), searchTaxInfoList.get(1),
					searchTaxInfoList.get(2), searchTaxInfoList.get(4),
					searchTaxInfoList.get(3), searchTaxInfoList.get(5),
					searchTaxInfoList.get(6));
		} catch (Exception e) {
			System.out.println("조회구분 오류");
			System.out.println(e.getMessage());
		}
		resultData.put("empTaxInfo", emptaxInfo);
		resultData.put("searchTaxInfo", searchTaxInfo);
		return resultData;
	}
	
	//급여 자료 삭제
		public Map<String, Object> deletePayData(Map<String, Object> deleteData) {
			SdDao dao = sqlSession.getMapper(SdDao.class);
			// 사원코드
			List<String> cdEmpList = (List<String>)deleteData.get("code");
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
			empData.put("searchTaxOrder", searchTaxOrder);
			Map<String, Object> resultData = new HashMap<>();
			//계산 결과 조회
			SdTaxAmountVO emptaxInfo = new SdTaxAmountVO();
			SdTaxAmountVO searchTaxInfo = new SdTaxAmountVO();
			int deleteResult = 0;
			try {
				deleteResult = dao.deletePayData(empData, cdEmpList);
			} catch (Exception e) {
				System.out.println("급여 삭제 오류");
				System.out.println(e.getMessage());
			}
			try {
				List<SdDeducationVO> empTaxInfoList = dao.getEmpTax(empData);
				emptaxInfo = new SdTaxAmountVO(empTaxInfoList.get(0).getAmtAllowance(), empTaxInfoList.get(1).getAmtAllowance(),
						empTaxInfoList.get(2).getAmtAllowance(), empTaxInfoList.get(4).getAmtAllowance(),
						empTaxInfoList.get(3).getAmtAllowance(), empTaxInfoList.get(5).getAmtAllowance(),
						empTaxInfoList.get(6).getAmtAllowance());
			} catch (Exception e) {
				System.out.println("사원 급여 오류");
				System.out.println(e.getMessage());
			}
			try {
				List<Long> searchTaxInfoList = dao.getTaxInfo(empData);
				searchTaxInfo = new SdTaxAmountVO(searchTaxInfoList.get(0), searchTaxInfoList.get(1),
						searchTaxInfoList.get(2), searchTaxInfoList.get(4),
						searchTaxInfoList.get(3), searchTaxInfoList.get(5),
						searchTaxInfoList.get(6));
			} catch (Exception e) {
				System.out.println("조회구분 오류");
				System.out.println(e.getMessage());
			}
			resultData.put("empTaxInfo", emptaxInfo);
			resultData.put("searchTaxInfo", searchTaxInfo);
			return resultData;
		}
}
