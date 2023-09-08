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
public class SdEmpMstVO {

    private String cdEmp;			// 사원번호 PK
    private String nmEmp;			// 사원명 NOT NULL
    private String nmPosition;		// 직급명 
     
}
