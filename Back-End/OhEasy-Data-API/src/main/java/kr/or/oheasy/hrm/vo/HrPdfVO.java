package kr.or.oheasy.hrm.vo;

import lombok.Data;

@Data
public class HrPdfVO {
    // hr_emp_mst table columns
    private String cdEmp;
    private String nmEmp;
    private Integer fgForeign;
    private String noResident;
    private String dtHire;
    private String noPost;
    private String nmAddress;
    private String dcAddress;
    private String noPhone;
    private String noMobilePhone;
    private String nmEmail;
    private String dtResign;
    private String noAccount;
    private String nmAccountHolder;
    private String cdBank;
    private String noPositionUnique;
    private String noDepartment;

    // hr_emp_dtl table column
    private String nmEngEmp;
    private String nmHanjaEmp;
    private Integer fgWorkcontract;
    private Integer fgMarriage;
    private String dtBirth;
    private String path;

    // hr_body_data_dtl table columns
    private String lenBody;
    private String wgtBody;
    private String nclBloodMin;
    private String nclBloodMax;
    private String lenBust;
    private String dcCaseHistory;
    private String fgBloodType;
    private String fgEye;
    private String leftEyesight;
    private String rightEyesight;
    private String apilityHearing;
    private String fgObstacle;
    private String fgVerterans;
    private String lvObstacle;
    private String lvVerterans;
    private String relationVerterans;
    
    // hr_military_info_dtl table columns
    private String fgMilitaryDischarge;
    private String fgMilitaryService;
    private String dcExemption;
    private String dtMilitaryStart;
    private String dtMilitaryEnd;
    private String yyMilitary;
    private String mmMilitary;
    private String ddMilitary;
    private String fgMilitaryType;
    private String dcClassMilitary;
    private String fgMilitaryRank;
    
    
}
