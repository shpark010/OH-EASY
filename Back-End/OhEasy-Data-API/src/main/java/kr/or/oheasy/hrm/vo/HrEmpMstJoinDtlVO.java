package kr.or.oheasy.hrm.vo;

import lombok.Data;

@Data
public class HrEmpMstJoinDtlVO {

	private String cdEmp; // 사원번호
	// dtl
	private String nmEngEmp; // 영문성명
	private String nmHanjaEmp; // 한자성명
	private Integer fgWorkcontract; // 근로계약서작성여부
	private Integer fgMarriage; // 결혼여부
	private String dtBirth; // 생년월일

	// mst
	private String noResident; // 주민번호 읽기전용
	private String noDepartment; // 부서번호 읽기전용
	private String noPositionUnique; // 직급 읽기전용
	private String dtHire;// 입사년원일 읽기전용
	// 퇴사년월일 읽기전용
	private String dtResign;
}
