package kr.or.oheasy.vo;

import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Data;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class HrEmpMstVO {

    private String cdEmp;           // 사원번호 PK
    private String nmEmp;           // 사원명
    private int fgForeign;          // 내외국인구분
    private String noResident;      // 주민번호
    private String dtHire;          // 입사일
    private String noPost;          // 우편번호
    private String nmAddress;       // 주소
    private String dcAddress;       // 상세주소
    private String noPhone;         // 전화번호
    private String noMobilePhone;   // 핸드폰
    private String nmEmail;         // 이메일
    private String dtResign;        // 퇴사일
    private String noAccount;       // 계좌번호
    private String nmAccountHolder; // 예금주명

    // 은행정보
    private String cdBank;  // 은행코드 fk
    private String nmBank;  // 기관명
    private String tpBank;  // 종류

    // 부서정보
    private String noDepartment;    // 부서번호 fk
    private String nmDepartment;    // 부서명

    // 직급정보
    private String noPositionUnique;    // 직급고유번호 fk
    private String noPositionCategory;  // 직급카테고리
    private String nmPositionCategory;  // 직급카테고리명
    private String nmPosition;          // 직급명
    private String sqPosition;          // 직급순서

    // 년도
    private String year;		// 년도
}
