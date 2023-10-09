package kr.or.oheasy.hrm.utils;

import java.util.HashMap;
import java.util.Map;

public class DepartmentUtil {

    private static final Map<String, String> DEPARTMENT_MAP = new HashMap<>();

    static {
        DEPARTMENT_MAP.put("001", "인사부");
        DEPARTMENT_MAP.put("002", "재무부");
        DEPARTMENT_MAP.put("003", "영업부");
        DEPARTMENT_MAP.put("004", "개발부");
        DEPARTMENT_MAP.put("005", "마케팅부");
        DEPARTMENT_MAP.put("006", "고객지원부");
        DEPARTMENT_MAP.put("007", "생산부");
        DEPARTMENT_MAP.put("008", "구매부");
    }

    public static String getDepartmentName(String deptNo) {
        return DEPARTMENT_MAP.getOrDefault(deptNo, "");
    }
}
