package kr.or.oheasy.vo;

import lombok.Data;
import lombok.NoArgsConstructor;

//급여자료입력 - 사원 상세 정보
@Data
@NoArgsConstructor
public class SdEmpInfoVO {
	private String hireDate;			//입사일
	private String gender;				//성별
	private String address;				//주소
	private String detailAddress;		//상세주소
	private String phone;				//휴대폰번호
	private String email;				//이메일
	private String leavingDate;			//퇴사일
	private String department;			//부서
	private String domesticForeign;		//내외국인
	private String family;				//가족수
	private String military;			//병역구분
	private String obstacle;			//장애구분
	private String certificate;			//자격증수
	
}
