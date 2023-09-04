package kr.or.oheasy.vo;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class HrEmpMstVO {

    private String cdEmp;			// 사원번호 PK
    private String nmEmp;			// 사원명 NOT NULL
    private int fgForeign;			// 내외국인구분 NOT NULL
    private String noResident;		// 주민번호 NOT NULL
    private int fgEmp;				// 재직구분 NOT NULL
    private String dtHire;			// 입사일 NOT NULL
    private Integer fgGender; 		// 성별 
    private String noPost;   		// 우편번호 
    private String nmAddress;		// 주소 
    private String dcAddress;		// 상세주소 
    private String noPhone;  		// 전화번호
    private String noMobilePhone; 	// 핸드폰
    private String nmEmail;  		// 이메일
    private String cdBank;   		// 은행코드 fk
    private String idJoin;   		// 가입ID
    private String dtResign; 		// 퇴사일 
    private String noAccount;		// 계좌번호 
    private String nmAccountHolder;	// 예금주명 
    private String noPositionUnique;// 직급고유번호 fk
    private String noDepartment; 	// 부서번호 fk
     
}
