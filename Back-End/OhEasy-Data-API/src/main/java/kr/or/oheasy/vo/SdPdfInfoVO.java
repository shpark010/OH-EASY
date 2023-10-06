package kr.or.oheasy.vo;

import lombok.Data;

@Data
public class SdPdfInfoVO {
	private String cdEmp;						//사원코드
	private String nmEmp;						//사원명
	private String dtBirth;						//생년월일
	private String nmDept;						//부서명
	private String nmPosition;					//직급명
	private String dtHire;						//입사일
	private String yyAllowance;					//귀속년
	private String mmBelong;					//귀속월
	private String dtAllowance;					//지급일	
	private String amtAllowance;				//기본급
	private String nationalPension;				//국민연금
	private String healthInsurance;				//건강보험
	private String longtermNursingInsurance;	//장기요양보험
	private String employmentInsurance;			//고용보험
	private String incomeTax;					//소득세
	private String localIncomeTax;				//지방소득세
	private String totalDeduct;					//공제액계
	private String netPay;						//차인지급액(실수령액)
}

