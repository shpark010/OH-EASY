package kr.or.oheasy.vo;

import java.sql.Date;

import lombok.Data;

//급여자료입력 - 사원 조회 조건
@Data
public class SdEmpSearchVO {
	private String belongingDate;
    private String payDay;
    private Date searchOrder;
}
