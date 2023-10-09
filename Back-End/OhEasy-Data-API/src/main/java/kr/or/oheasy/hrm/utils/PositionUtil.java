package kr.or.oheasy.hrm.utils;

import java.util.HashMap;
import java.util.Map;

public class PositionUtil {

    private static final Map<String, String> POSITION_MAP = new HashMap<>();

    static {
        POSITION_MAP.put("1", "회장");
        POSITION_MAP.put("2", "사장");
        POSITION_MAP.put("3", "부사장");
        POSITION_MAP.put("4", "전무");
        POSITION_MAP.put("5", "상무");
        POSITION_MAP.put("6", "이사");
        POSITION_MAP.put("7", "부장");
        POSITION_MAP.put("8", "수석");
        POSITION_MAP.put("9", "차장");
        POSITION_MAP.put("10", "책임");
        POSITION_MAP.put("11", "과장");
        POSITION_MAP.put("12", "선임");
        POSITION_MAP.put("13", "대리");
        POSITION_MAP.put("14", "주임");
        POSITION_MAP.put("15", "사원");
        POSITION_MAP.put("16", "직급없음");
    }

    public static String getPositionName(String positionCode) {
        return POSITION_MAP.getOrDefault(positionCode, "알 수 없는 직급");
    }
}
