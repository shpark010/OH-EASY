package kr.or.oheasy.vo;

import lombok.Data;

@Data
public class WcVO {
	
    private String cdEmp; //코드
    private String dtStartCont; //근로계약 시작날짜
    private String dtEndCont; //근로계약 종료날짜
    private String noPost; // 우편번호
    private String addrWork; // 근무장소
    private String addrWorkDtl; // 상세주소
    private String cntnJob; // 업무내용
    private String tmStartRegularWork; //소정근로 시작시간
    private String tmEndRegularWork; // 소정근로 끝 시간
    private String tmStartBreak; // 휴게시간 시작
    private String tmEndBreak; //휴게시간 종료
    private String ddWorking; //근무일
    private String dotw; //주휴일
    private String tpSal; //임금유형
    private int amtSal; // 임금금액
    private String tpPayDtSal; //임금지급일 유형, 매월 매주 매일
    private String ddPaySal; //임금지급일
    private String methodPay; //임금지급 방법
    private String ynEmpInsurance; // 고용보험
    private String ynIndustrialAccidentInsurance; // 산재보험
    private String ynNationalPension; //국민연금
    private String ynHealthInsurance; //건강보험
    private String stSign; // 서명여부
    private String dtCreated; //작성일, 년 월 일
    
}
