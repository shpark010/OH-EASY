package kr.or.oheasy.vo;

import lombok.Data;

@Data
public class SdEmailInfoVO {
	private String nmEmp;
	private String nmEmail;
	private String yyAllowance;
	private String mmBelong;
	private String amtAllowance;
	private String nationalPension;
	private String healthInsurance;
	private String longtermNursingInsurance;
	private String employmentInsurance;
	private String incomeTax;
	private String localIncomeTax;
	private String totalDeduct;
	private String netPay;
}
