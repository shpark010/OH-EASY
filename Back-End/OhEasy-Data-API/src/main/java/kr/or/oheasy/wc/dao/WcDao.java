package kr.or.oheasy.wc.dao;

import java.util.List;

import kr.or.oheasy.vo.WcGetEmpListVO;
import kr.or.oheasy.vo.WcVO;

public interface WcDao {



		public List<WcGetEmpListVO> getAllEmpList(String tabState); 
		public int updateEmp0to1();
		public WcVO getWcData(String code);
	

	
}
