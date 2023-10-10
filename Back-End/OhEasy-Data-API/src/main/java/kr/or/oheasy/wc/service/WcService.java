package kr.or.oheasy.wc.service;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.or.oheasy.vo.WcGetEmpVO;
import kr.or.oheasy.vo.WcVO;
import kr.or.oheasy.wc.dao.WcDao;

@Service
public class WcService {
	
	@Autowired
	private SqlSession sqlSession; //mybatis
	
	public List<WcGetEmpVO> getOptionEmpList(String param1,String param2,String orderValue) {
		
		switch(orderValue) {
		case "1":
			orderValue = "e.cd_emp";
			break;
		case "2" : 
			orderValue ="e.nm_emp";
			break;
		}
		System.out.println(orderValue);
		System.out.println(param1+param2);
		WcDao wcdao = sqlSession.getMapper(WcDao.class);
		return wcdao.getOptionEmpList(param1,param2,orderValue);
		
	}
	
	
public List<WcGetEmpVO> getOptionEmpList2(String creDate,String creDate2, String orderValue) {
		
		switch(orderValue) {
		case "1":
			orderValue = "e.cd_emp";
			break;
		case "2" : 
			orderValue ="e.nm_emp";
			break;
		case "3" : 
			orderValue ="c.dt_created";
			break;
		}
		
		System.out.println(orderValue);
	
		WcDao wcdao = sqlSession.getMapper(WcDao.class);
		return wcdao.getOptionEmpList2(creDate,creDate2,orderValue);
		
	}
	

	public WcVO getCodeParam(String code){
		WcDao wcdao = sqlSession.getMapper(WcDao.class);
		return wcdao.getCodeParam(code);
	}

	
	
	public List<WcGetEmpVO> getAllModalEmpList(){
		WcDao wcdao = sqlSession.getMapper(WcDao.class);
		return wcdao.getModalEmpList();
	}
	
	
	public List<WcGetEmpVO> getModalEmpListByName(Map<String, Object> params){
		System.out.println(params);
		 Map.Entry<String, Object> entry = params.entrySet().iterator().next();
		    String key = entry.getKey();
		    String value = String.valueOf(entry.getValue());
		System.out.println(key);
		System.out.println(value);
		WcDao wcdao = sqlSession.getMapper(WcDao.class);
		return wcdao.getModalEmpListByName(key,value);
	} //모달 조건검색
	
	/*
	  
	    public List<WcGetEmpVO> getModalEmpListByName(Map<String, Object> params) {
        return empDAO.getModalEmpListByName(params);
    }
	  
	 */
	
	public WcGetEmpVO getModalData(String cdEmp) {
		WcDao wcdao = sqlSession.getMapper(WcDao.class);
		return wcdao.getModalData(cdEmp);
	}
	
	public int insertEmpData(String cdEmp) {
		// 사원코드는 insert 됐는데 작성일자를 넣지 못한 사람들을 위한 validation
		
		LocalDate date = LocalDate.now();
		 String dateString = date.toString(); // LocalDate를 문자열로 변환
	     String formattedDate = dateString.replace("-", ""); // 하이픈 제거
		System.out.println(formattedDate);
		
		WcDao wcdao = sqlSession.getMapper(WcDao.class);
		return wcdao.insertEmpData(cdEmp,formattedDate);
	}
	
	
	
	public int updateEmpList(String cdEmp, String colum, String data){
		WcDao wcdao = sqlSession.getMapper(WcDao.class);
		return wcdao.updateEmpList(cdEmp,colum,data);
	}
	
	
	public int deleteEmpList(String cdEmp) {
		WcDao wcdao = sqlSession.getMapper(WcDao.class);
		return wcdao.deleteEmp(cdEmp);
	}
	
	
}
