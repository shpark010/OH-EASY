package kr.or.oheasy.vo;

import lombok.Data;
import java.util.Date;

@Data
public class HrLicenseDtlVO {

    private int seqLicense;
    private String cdEmp;
    private String cdLicense;        // 해당값을 선택안하면 나머지값 입력불가
    private String fgLicense;       // 1.자격증 2.외국어
    private String noRating;
    private String dtCertified;
    private String noLicense;
    private String nmIssuing;

}
