package kr.or.oheasy.vo;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.ToString;

//급여자료입력 - 사원 리스트
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class SdEmpMstVO {

    private String cdEmp;			// 사원번호 PK
    private String nmEmp;			// 사원명 NOT NULL
    private String nmPosition;		// 직급명 
     
}
