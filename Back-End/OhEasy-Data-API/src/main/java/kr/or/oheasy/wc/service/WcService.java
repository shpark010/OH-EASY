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
	
	public List<WcGetEmpListVO> getAllEmpList(String tabState) {
		WcDao wcdao = sqlSession.getMapper(WcDao.class);
		return wcdao.getAllEmpList(tabState);
		
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
