package kr.or.oheasy.vo;

import lombok.Data;

@Data
public class HrEmpDtlVO {

    private String cdEmp;				// 사원번호
    private String nmEngEmp;			// 사원 영문명
    private String nmHanjaEmp;			// 사원 한자명
    private Integer fgWorkcontract;		// 근로계약서 작성여부
    private Integer fgMarriage;			// 결혼 여부 
    private String dtBirth;				// 생년월일


}
