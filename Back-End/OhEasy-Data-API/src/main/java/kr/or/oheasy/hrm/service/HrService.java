package kr.or.oheasy.hrm.service;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.or.oheasy.hrm.dao.HrDao;
import kr.or.oheasy.vo.HrEmpMstVO;
import kr.or.oheasy.vo.HrFamilyDtlVO;

@Service
public class HrService {

    @Autowired
    private SqlSession sqlSession;
    
    public List<HrEmpMstVO> getAllEmpList(){
    	HrDao dao = sqlSession.getMapper(HrDao.class);
    	
    	return dao.getAllEmpList();
    }
    
    
    public List<HrFamilyDtlVO> getFamilyDataList(String cdEmp){
    	HrDao dao = sqlSession.getMapper(HrDao.class);
    	
    	return dao.getFamilyDataList(cdEmp);
    }
    
}
