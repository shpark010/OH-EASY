package kr.or.oheasy.wc.service;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.or.oheasy.vo.WcGetEmpListVO;
import kr.or.oheasy.vo.WcVO;
import kr.or.oheasy.wc.dao.WcDao;

@Service
public class WcService {
	
	@Autowired
	private SqlSession sqlSession; //mybatis
	
	public List<WcGetEmpListVO> getOptionEmpList(String creDate,String orderValue) {
		
		switch(orderValue) {
		case "1":
			orderValue = "cd_emp";
			break;
		case "2" : 
			orderValue ="nm_emp";
			break;
		}
		System.out.println(orderValue);
	
		WcDao wcdao = sqlSession.getMapper(WcDao.class);
		return wcdao.getOptionEmpList(creDate,orderValue);
		
	}
	
public List<WcGetEmpListVO> getOptionEmpList2(String creDate,String creDate2, String orderValue) {
		
		switch(orderValue) {
		case "1":
			orderValue = "cd_emp";
			break;
		case "2" : 
			orderValue ="nm_emp";
			break;
		}
		
		System.out.println(orderValue);
	
		WcDao wcdao = sqlSession.getMapper(WcDao.class);
		return wcdao.getOptionEmpList2(creDate,creDate2,orderValue);
		
	}
	


	
	public int updateEmp0to1(){
		WcDao wcdao = sqlSession.getMapper(WcDao.class);
		return wcdao.updateEmp0to1();
	}
	
	public WcVO getWcData(String code){
		WcDao wcdao = sqlSession.getMapper(WcDao.class);
		return wcdao.getWcData(code);
	}
	

}
