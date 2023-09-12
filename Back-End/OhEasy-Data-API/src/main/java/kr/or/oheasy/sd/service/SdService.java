package kr.or.oheasy.sd.service;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.or.oheasy.sd.dao.SdDao;
import kr.or.oheasy.vo.HrEmpMstVO;
import kr.or.oheasy.vo.SdEmpInfoVO;

@Service
public class SdService {

    @Autowired
    private SqlSession sqlSession;
    
  //조건 조회(사원 리스트)
    public List<HrEmpMstVO> getAllEmpList(Map<String, String> empSearch){
    	SdDao dao = sqlSession.getMapper(SdDao.class);
    	
    	return dao.getEmpList(empSearch);
    }
    
    //사원 상세 정보
    public SdEmpInfoVO getEmpDetailData(String cd_Emp){
    	SdDao dao = sqlSession.getMapper(SdDao.class);
    	
    	return dao.getEmpDetailData(cd_Emp);
    }
    
}
