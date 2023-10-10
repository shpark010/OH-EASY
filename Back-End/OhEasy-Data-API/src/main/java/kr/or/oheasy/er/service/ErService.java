package kr.or.oheasy.er.service;

import kr.or.oheasy.er.dao.ErDao;
import kr.or.oheasy.utils.Camel;
import kr.or.oheasy.vo.HrEmpMstVO;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ErService {

    @Autowired
    private SqlSession sqlSession;

    public int postEmp(HrEmpMstVO hrEmpMstVO) {
        ErDao dao = sqlSession.getMapper(ErDao.class);
        return dao.postEmp(hrEmpMstVO);
    }

    public int updateEmp(@Param("cdEmp") String cdEmp, @Param("column") String column, @Param("value") String value) {
        ErDao dao = sqlSession.getMapper(ErDao.class);
        column = Camel.camelToSnake(column);
        return dao.updateEmp(cdEmp, column, value);
    }

    public boolean isCdEmpValid(String cdEmp) {
        ErDao dao = sqlSession.getMapper(ErDao.class);
        int count = dao.checkCdEmpExistence(cdEmp);
        return count > 0;
    }

    public List<HrEmpMstVO> getAllEmpList() {
        ErDao dao = sqlSession.getMapper(ErDao.class);
        return dao.getAllEmpList();
    }

    public HrEmpMstVO getCdEmp(String cdEmp) {
        ErDao dao = sqlSession.getMapper(ErDao.class);
        return dao.getCdEmp(cdEmp);
    }

    // FK 참조하는 테이블 확인 후 사원삭제
    public Map<String, Object> deleteEmp(String cdEmp) {
        ErDao dao = sqlSession.getMapper(ErDao.class);

        Map<String, Object> references = dao.checkReferences(cdEmp);
        System.out.println("참조 테이블 확인: " + references);

        if (references == null) {
            references = new HashMap<>();
        }

        if (references.values().stream().anyMatch(Objects::nonNull)) {
            return references; // 참조하는 테이블이 존재하면 참조 정보 반환
        }

        int result = dao.deleteEmp(cdEmp);
        return Collections.singletonMap("deleted", result);
    }

    // 부서전체조회
    public List<HrEmpMstVO> getDeptList() {
        ErDao dao = sqlSession.getMapper(ErDao.class);
        return dao.getDeptList();
    }

    // 은행전체조회
    public List<HrEmpMstVO> getBankList() {
        ErDao dao = sqlSession.getMapper(ErDao.class);
        return dao.getBankList();
    }

}
