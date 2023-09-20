package kr.or.oheasy.wc.dao;

import java.util.List;

import kr.or.oheasy.vo.WcGetEmpListVO;
import kr.or.oheasy.vo.WcVO;

public interface WcDao {



		public List<WcGetEmpListVO> getOptionEmpList(String creDate,String orderValue);
		public List<WcGetEmpListVO> getOptionEmpList2(String creDate,String creDate2, String orderValue); 
		public WcVO getCodeParam(String code);
		public int updateEmpList(String cdEmp, String colum, String data);
	

	
}
