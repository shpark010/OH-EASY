package kr.or.oheasy.wc.dao;

import java.util.List;
import java.util.Map;

import kr.or.oheasy.vo.WcGetEmpVO;
import kr.or.oheasy.vo.WcVO;

public interface WcDao {



		public List<WcGetEmpVO> getOptionEmpList(String param1,String param2,String orderValue);
		public List<WcGetEmpVO> getOptionEmpList2(String creDate,String creDate2, String orderValue); 
		public WcVO getCodeParam(String code);
		public List<WcGetEmpVO> getModalEmpList(); // Modal에 보여줄 전체 List
		public List<WcGetEmpVO> getModalEmpListByName(String key,String value); //Modal에서 조건검색해서 보여줄 List
		public WcGetEmpVO getModalData(String cdEmp); //Modal에서 Click해서 가져올 Data
		public int insertEmpData(String cdEmp,String formattedDate ); // 모달에서 추가시 insert
		public int updateEmpList(String cdEmp, String colum, String data);
		public int deleteEmp(String cdEmp);

	
}
