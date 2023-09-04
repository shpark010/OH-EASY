package kr.or.oheasy.er.service;

import kr.or.oheasy.er.dao.ErDao;
import kr.or.oheasy.vo.HrEmpMstVO;
import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ErService {

    @Autowired
    private SqlSession sqlSession;
    
    public int postEmp(HrEmpMstVO hrEmpMstVO){
        ErDao dao = sqlSession.getMapper(ErDao.class);
        return dao.postEmp(hrEmpMstVO);
    }

    public List<HrEmpMstVO> getAllEmpList(){
    	ErDao dao = sqlSession.getMapper(ErDao.class);
        return dao.getAllEmpList();
    }

    public HrEmpMstVO getCdEmp(String cdEmp){
        ErDao dao = sqlSession.getMapper(ErDao.class);
        return dao.getCdEmp(cdEmp);
    }

    public int deleteEmp(String cdEmp) {
        ErDao dao = sqlSession.getMapper(ErDao.class);
        return dao.deleteEmp(cdEmp);
    }
    
}
