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
import kr.or.oheasy.vo.SdTaxAmountVO;

@Service
public class SdService {

	@Autowired
	private SqlSession sqlSession;

	// 조건 조회(사원 리스트)
	public List<HrEmpMstVO> getAllEmpList(Map<String, String> empSearch) {
		SdDao dao = sqlSession.getMapper(SdDao.class);
		return dao.getEmpList(empSearch);
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
		HashMap<String, String> empData = new HashMap<>();
		empData.put("cdEmp", cd_Emp);
		empData.put("yyAllowance", yyAllowance);
		empData.put("mmBelong", mmBelong);
		empData.put("dtAllowance", dtAllowance);
		Map<String, Object> resultData = new HashMap<>();
		SdEmpInfoVO searchInfo = dao.getEmpDetailData(cd_Emp);
		resultData.put("searchInfo", searchInfo);
		try {
			List<SdDeducationVO> deducationList = dao.getEmpTax(empData);
			Long pay = deducationList.get(0).getAmtAllowance();
			SdTaxAmountVO taxInfo = new SdTaxAmountVO(deducationList.get(1).getAmtAllowance(),
					deducationList.get(2).getAmtAllowance(), deducationList.get(3).getAmtAllowance(),
					deducationList.get(4).getAmtAllowance(), deducationList.get(5).getAmtAllowance(),
					deducationList.get(6).getAmtAllowance());
			System.out.println(searchInfo);
			System.out.println(taxInfo);
			resultData.put("pay", pay);
			resultData.put("deducation", taxInfo);
		} catch (Exception e) {
			System.out.println(e.getMessage());
//			resultData.put("searchInfo", new SdEmpInfoVO());
			resultData.put("pay", 0);
			resultData.put("deducation", new SdTaxAmountVO());
			return resultData;
		}

		return resultData;
	}

	// 신규 급여 입력
	public int setEmpPay(Map<String, String> insertPay) {
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
		
		return dao.setEmpPay(taxList);
	}
}
