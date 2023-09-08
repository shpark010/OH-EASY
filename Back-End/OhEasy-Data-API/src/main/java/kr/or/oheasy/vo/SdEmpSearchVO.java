package kr.or.oheasy.vo;

import java.sql.Date;

import lombok.Data;

@Data
public class SdEmpSearchVO {
	private String belongingDate;
    private String payDay;
    private Date searchOrder;
}
