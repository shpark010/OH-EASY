package kr.or.oheasy.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SdDeducationVO {
	private String cdEmp;			//사원코드
	private String cdTaxRate;		//세율 항목 코드
	private long amtAllowance;		//금액
	private int fgTax;				//과세여부
	private String yyAllowance;		//연도
	private String mmBelong;		//귀속월
	private String dtAllowance;		//지급일
}
