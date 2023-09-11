package kr.or.oheasy.vo;

import lombok.Data;

@Data
public class PositionSdtlVO {

    private String noPositionUnique;    // 직급고유번호
    private String noPositionCategory;  // 직급카테고리
    private String nmPosition;          // 직급명
    private String sqPosition;          // 직급순서

}
