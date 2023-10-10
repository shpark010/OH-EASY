package kr.or.oheasy.dao;

import kr.or.oheasy.vo.LoginVO;
import kr.or.oheasy.vo.UsersVO;

public interface AuthDao {
	
	public int idCheck(String id);
	
	public int signup(UsersVO usersVO);
	
	public int login(LoginVO loginVO);
	
    public LoginVO userData(String userId);
    
    public UsersVO getOneMemberData(String userId);
	
    public int updateMemberData(UsersVO usersVO);
	
}
