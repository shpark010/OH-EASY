package kr.or.oheasy.hrm.service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.or.oheasy.hrm.dao.HrDao;
import kr.or.oheasy.hrm.vo.HrEmpMstCdEmpNmNameVO;
import kr.or.oheasy.hrm.vo.HrEmpMstJoinDtlVO;
import kr.or.oheasy.hrm.vo.HrPdfVO;
import kr.or.oheasy.utils.Camel;
import kr.or.oheasy.vo.HrBodyDataDtlVO;
import kr.or.oheasy.vo.HrCareerDtlVO;
import kr.or.oheasy.vo.HrEducationDtlVO;
import kr.or.oheasy.vo.HrEmpMstVO;
import kr.or.oheasy.vo.HrFamilyDtlVO;
import kr.or.oheasy.vo.HrLicenseDtlVO;
import kr.or.oheasy.vo.HrLicenseSdtlVO;
import kr.or.oheasy.vo.HrMilitaryInfoDtlVO;

@Service
public class HrService {

	@Autowired
	private SqlSession sqlSession;

	@Autowired
	private S3FileUploadTestService s3FileUploadTestService;

	public List<HrEmpMstVO> getAllEmpList() {
		HrDao dao = sqlSession.getMapper(HrDao.class);

		return dao.getAllEmpList();
	}

	public List<HrEmpMstVO> getAllModalEmpList() {
		HrDao dao = sqlSession.getMapper(HrDao.class);

		return dao.getAllModalEmpList();
	}

	@Transactional(rollbackFor = Exception.class)
	public List<HrEmpMstVO> insertAllHrEmpData() {
		HrDao dao = sqlSession.getMapper(HrDao.class);
		dao.insertIntoHrEmpDtl();
		dao.insertIntoHrFamilyDtl();
		dao.insertIntoHrMilitaryInfoDtl();
		dao.insertIntoHrBodyDataDtl();
		return dao.getAllEmpList();
	}

	// 사원들의 이미지 경로들 가져오기
	public List<String> getEmpImagePaths(List<String> cdEmpList) {
		HrDao dao = sqlSession.getMapper(HrDao.class);
		return dao.getEmpImagePaths(cdEmpList);
	}

	// 인사테이블 삭제
	@Transactional(rollbackFor = Exception.class)
	public void deleteHrEmpDtlList(List<String> cdEmpList) {
		HrDao dao = sqlSession.getMapper(HrDao.class);
		
		try {

			List<String> validImagePaths = getEmpImagePaths(cdEmpList).stream().filter(Objects::nonNull)
					.collect(Collectors.toList());

			if (!validImagePaths.isEmpty()) { // 검사 추가
				List<String> fileNames = validImagePaths.stream()
						.map(path -> "profileImg/" + path.substring(path.lastIndexOf("/") + 1))
						.collect(Collectors.toList());
				System.out.println(fileNames);
				s3FileUploadTestService.deleteFilesFromS3(fileNames);
			}
		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException("Failed to delete images from S3.");
		}

		try {
			// 이제 데이터베이스에서 사원들의 정보를 삭제합니다.
			for (String cdEmp : cdEmpList) {
				dao.deleteHrEmpDtl(cdEmp);
			}
		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException("Failed to delete employee records.");
		}

	}

	public List<HrLicenseSdtlVO> getLicenseList() {
		HrDao dao = sqlSession.getMapper(HrDao.class);

		return dao.getLicenseList();
	}

	@Transactional(rollbackFor = Exception.class)
	public int insertHrEmpData(String cdEmp) {
		HrDao dao = sqlSession.getMapper(HrDao.class);
		//dao.insertOneHrFamilyDtl(cdEmp);

		return dao.insertHrEmpData(cdEmp);
	}

	public HrEmpMstCdEmpNmNameVO getOneHrEmpData(String cdEmp) {
		HrDao dao = sqlSession.getMapper(HrDao.class);

		return dao.getOneHrEmpData(cdEmp);
	}

	public List<HrEmpMstVO> getConditionalEmpList(@Param("category") int category, @Param("sort") int sort) {
		HrDao dao = sqlSession.getMapper(HrDao.class);

		if (category == 0) {
			return dao.getConditionalEmpListCategory0(category, sort);
		} else if (category == 1) {
			return dao.getConditionalEmpListCategory1(category, sort);
		} else if (category == 2) {
			return dao.getConditionalEmpListCategory2(category, sort);
		} else if (category == 3) {
			return dao.getConditionalEmpListCategory3(category, sort);
		} else {
			return dao.getAllEmpList();
		}

	}

	public HrEmpMstJoinDtlVO getOneEmpBasicData(String cdEmp) {
		HrDao dao = sqlSession.getMapper(HrDao.class);

		return dao.getOneEmpBasicData(cdEmp);
	}

	public int updateEmpBasicData(@Param("cdEmp") String cdEmp, @Param("column") String column,
			@Param("value") String value) {
		HrDao dao = sqlSession.getMapper(HrDao.class);
		column = Camel.camelToSnake(column);
		// 영문명 한자명 근로계약서작성여부 결혼여부 생년월일 일경우
		if (column.equals("NM_ENG_EMP") || column.equals("NM_HANJA_EMP") || column.equals("FG_WORKCONTRACT")
				|| column.equals("FG_MARRIAGE") || column.equals("DT_BIRTH") || column.equals("PATH")) {
			System.out.println("value : " + value);
			System.out.println("column : " + column);
			return dao.updateHrEmpDtl(cdEmp, column, value);
		} else {
			return dao.updateHrEmpMst(cdEmp, column, value);
		}
	}

	// 가족 테이블
	public List<HrFamilyDtlVO> getFamilyDataList(String cdEmp) {
		HrDao dao = sqlSession.getMapper(HrDao.class);

		return dao.getFamilyDataList(cdEmp);
	}

	public int insertFamilyData(@Param("cdEmp") String cdEmp, @Param("column") String column,
			@Param("value") String value) {
		HrDao dao = sqlSession.getMapper(HrDao.class);
		column = Camel.camelToSnake(column);
		return dao.insertFamilyData(cdEmp, column, value);
	}

	public int updateFamilyData(@Param("seqFamily") String seqFamily, @Param("column") String column,
			@Param("value") String value) {
		HrDao dao = sqlSession.getMapper(HrDao.class);
		column = Camel.camelToSnake(column);
		return dao.updateFamilyData(seqFamily, column, value);
	}

	// 학력 테이블
	public List<HrEducationDtlVO> getEduDataList(String cdEmp) {
		HrDao dao = sqlSession.getMapper(HrDao.class);

		return dao.getEduDataList(cdEmp);
	}

	public int insertEduData(@Param("cdEmp") String cdEmp, @Param("column") String column,
			@Param("value") String value) {
		HrDao dao = sqlSession.getMapper(HrDao.class);
		column = Camel.camelToSnake(column);
		return dao.insertEduData(cdEmp, column, value);
	}

	public int updateEduData(@Param("seqEducation") String seqFamily, @Param("column") String column,
			@Param("value") String value) {
		HrDao dao = sqlSession.getMapper(HrDao.class);
		column = Camel.camelToSnake(column);
		return dao.updateEduData(seqFamily, column, value);
	}

	// 경력테이블
	public List<HrCareerDtlVO> getCareerDataList(String cdEmp) {
		HrDao dao = sqlSession.getMapper(HrDao.class);

		return dao.getCareerDataList(cdEmp);
	}

	public int insertCareerData(@Param("cdEmp") String cdEmp, @Param("column") String column,
			@Param("value") String value) {
		HrDao dao = sqlSession.getMapper(HrDao.class);
		column = Camel.camelToSnake(column);
		return dao.insertCareerData(cdEmp, column, value);
	}

	public int updateCareerData(@Param("seqCareer") String seqFamily, @Param("column") String column,
			@Param("value") String value) {
		HrDao dao = sqlSession.getMapper(HrDao.class);
		column = Camel.camelToSnake(column);
		return dao.updateCareerData(seqFamily, column, value);
	}

	// 신체 테이블
	public HrBodyDataDtlVO getBodyData(String cdEmp) {
		HrDao dao = sqlSession.getMapper(HrDao.class);

		return dao.getBodyData(cdEmp);
	}

	public int insertBodyData(String cdEmp) {
		HrDao dao = sqlSession.getMapper(HrDao.class);

		return dao.insertBodyData(cdEmp);
	}

	public int updateBodyData(@Param("cdEmp") String cdEmp, @Param("column") String column,
			@Param("value") String value) {
		HrDao dao = sqlSession.getMapper(HrDao.class);
		column = Camel.camelToSnake(column);

		return dao.updateBodyData(cdEmp, column, value);
	}

	// 병역 테이블
	public int insertMilitaryData(String cdEmp) {
		HrDao dao = sqlSession.getMapper(HrDao.class);

		return dao.insertMilitaryData(cdEmp);
	}

	public HrMilitaryInfoDtlVO getMilitaryData(String cdEmp) {
		HrDao dao = sqlSession.getMapper(HrDao.class);

		return dao.getMilitaryData(cdEmp);
	}

	public int updateMilitaryData(@Param("cdEmp") String cdEmp, @Param("column") String column,
			@Param("value") String value) {
		HrDao dao = sqlSession.getMapper(HrDao.class);
		column = Camel.camelToSnake(column);

		return dao.updateMilitaryData(cdEmp, column, value);
	}

	// 자격 테이블
	public List<HrLicenseDtlVO> getLicenseDataList(String cdEmp) {
		HrDao dao = sqlSession.getMapper(HrDao.class);

		return dao.getLicenseDataList(cdEmp);
	}

	public int updateLicenseData(@Param("seqLicense") String seqLicense, @Param("column") String column,
			@Param("value") String value) {
		HrDao dao = sqlSession.getMapper(HrDao.class);
		column = Camel.camelToSnake(column);
		return dao.updateLicenseData(seqLicense, column, value);
	}

	public int insertLicenseData(@Param("cdEmp") String cdEmp, @Param("column") String column,
			@Param("value") String value) {
		HrDao dao = sqlSession.getMapper(HrDao.class);
		column = Camel.camelToSnake(column);
		return dao.insertLicenseData(cdEmp, column, value);
	}
	
	// 삭제 
	public int deleteFamilyData(String seqFamily) {
		HrDao dao = sqlSession.getMapper(HrDao.class);
		
		return dao.deleteFamilyData(seqFamily);
	}	
	
	public int deleteEduData(String seqEducation) {
		HrDao dao = sqlSession.getMapper(HrDao.class);
		
		return dao.deleteEduData(seqEducation);
	}	
	
	public int deleteCareerData(String seqCareer) {
		HrDao dao = sqlSession.getMapper(HrDao.class);
		
		return dao.deleteCareerData(seqCareer);
	}	
	public int deleteLicenseData(String seqLicense) {
		HrDao dao = sqlSession.getMapper(HrDao.class);
		
		return dao.deleteLicenseData(seqLicense);
	}	
	
	@Transactional(rollbackFor = Exception.class)
	public HrEmpMstCdEmpNmNameVO insertHrDtlAndGetHrMst(@Param("cdEmp") String cdEmp) {
		HrDao dao = sqlSession.getMapper(HrDao.class);
		
		// 인사테이블에 사원정보 insert 
		dao.insertHrEmpData(cdEmp);
		// 신체테이블에 신체정보 insert
		dao.insertBodyData(cdEmp);
		// 병역테이블에 병역정보 insert
		dao.insertMilitaryData(cdEmp);
		// 가족테이블에 가족정보 insert
		dao.insertFirstFamilyData(cdEmp);
	
		
		return dao.getOneHrEmpData(cdEmp);
	}
	

	public HrPdfVO getHrPdfData(String cdEmp) {
		HrDao dao = sqlSession.getMapper(HrDao.class);
		
		
		return dao.getHrPdfData(cdEmp);
	}
	
	
	
}
