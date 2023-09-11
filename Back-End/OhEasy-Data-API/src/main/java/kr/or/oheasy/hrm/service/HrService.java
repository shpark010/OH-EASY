package kr.or.oheasy.hrm.service;

import java.util.List;
import java.util.Map.Entry;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.or.oheasy.hrm.dao.HrDao;
import kr.or.oheasy.utils.Camel;
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
    
    
    public int insertFamilyData(@Param("cdEmp") String cdEmp, @Param("column") String column, @Param("value") String value) {
    	HrDao dao = sqlSession.getMapper(HrDao.class);
    	column = Camel.camelToSnake(column);
    	return dao.insertFamilyData(cdEmp, column, value);
    }
    
    public int updateFamilyData(@Param("seqFamily") String seqFamily, @Param("column") String column, @Param("value") String value) {
        HrDao dao = sqlSession.getMapper(HrDao.class);
        column = Camel.camelToSnake(column);
        return dao.updateFamilyData(seqFamily, column, value);
    }
    
}
