package kr.or.oheasy.vo;

import lombok.Data;

@Data
public class HrMilitaryInfoDtlVO {

    private String cdEmp;
    private String fgMilitaryDischarge; // 만기제대
    private String fgMilitaryService;   // 현역
    private String dcExemption;
    private String dtMilitaryStart;
    private String dtMilitaryEnd;
    private String yyMilitary;          // (년/개월/일)
    private String mmMilitary;
    private String ddMilitary;
    private String fgMilitaryType;      // 육군/해군
    private String dcClassMilitary;     // 자유기재
    private String fgMilitaryRank;      // 하사/병장

}
