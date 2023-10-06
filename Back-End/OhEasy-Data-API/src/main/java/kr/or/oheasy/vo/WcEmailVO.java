package kr.or.oheasy.vo;

import lombok.Data;

@Data
public class WcEmailVO {
	 private String cdEmp;
	    private String nmEmp;
	    private String nmEmail;  // 이메일 주소를 저장하기 위한 변수

	    // 급여 및 계약 관련 정보들
	    private String dtStartCont;
	    private String dtEndCont;
	    private String noWorkPost;
	    private String addrWork;
	    private String addrWorkDtl;
	    private String cntnJob;
	    private String tmStartRegularWork;
	    private String tmEndRegularWork;
	    private String tmStartBreak;
	    private String tmEndBreak;
	    private String ddWorking;
	    private String dotw;
	    private String tpSal;
	    private String amtSal;
	    private String tpPayDtSal;
	    private String ddPaySal;
	    private String methodPay;
	    private String ynEmpInsurance;
	    private String ynIndustrialAccidentInsurance;
	    private String ynNationalPension;
	    private String ynHealthInsurance;
	    private String stSign;
	    private String dtCreated;
}
