package kr.or.oheasy.sd.service;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.or.oheasy.sd.dao.SdDao;
import kr.or.oheasy.vo.HrEmpMstVO;

@Service
public class SdService {

    @Autowired
    private SqlSession sqlSession;
    
    //사원 리스트 조회
    public List<HrEmpMstVO> getAllEmpList(){
    	SdDao dao = sqlSession.getMapper(SdDao.class);
    	
    	return dao.getEmpList();
    }
    
}
