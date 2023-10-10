package kr.or.oheasy.service;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.or.oheasy.dao.AuthDao;
import kr.or.oheasy.vo.LoginVO;
import kr.or.oheasy.vo.LogoutVO;
import kr.or.oheasy.vo.UsersVO;

@Service
public class AuthService {

    @Autowired
    private SqlSession sqlSession;
    
    public int idCheck(String id) {
    	AuthDao dao = sqlSession.getMapper(AuthDao.class);
    	
    	return dao.idCheck(id);
    }
    
    public int signup(UsersVO usersVO) {
    	AuthDao dao = sqlSession.getMapper(AuthDao.class);
    	
    	return dao.signup(usersVO);
    }
    
    
    public int login(LoginVO loginVO) {
    	AuthDao dao = sqlSession.getMapper(AuthDao.class);

    	
    	return dao.login(loginVO);
    }
    
    public LoginVO userData(String userId) {
    	AuthDao dao = sqlSession.getMapper(AuthDao.class);
    	
    	return dao.userData(userId);
    }
    public UsersVO getOneMemberData(String userId) {
    	AuthDao dao = sqlSession.getMapper(AuthDao.class);
    	
    	return dao.getOneMemberData(userId);
    }
      
    
    public int updateMemberData(UsersVO usersVO) {
    	AuthDao dao = sqlSession.getMapper(AuthDao.class);
    	
    	return dao.updateMemberData(usersVO);
    }
    
}
