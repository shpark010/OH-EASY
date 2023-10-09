package kr.or.oheasy.hrm.utils;

import java.util.HashMap;
import java.util.Map;

public class FgMilitaryDischargeTypeUtil {
	
	private static final Map<String,String> FgMilitaryDischargeType_MAP = new HashMap<>();
	
	static {
		FgMilitaryDischargeType_MAP.put("10100", "만기제대");
		FgMilitaryDischargeType_MAP.put("10200", "의병제대");
		FgMilitaryDischargeType_MAP.put("10300", "의가사제대");
		FgMilitaryDischargeType_MAP.put("10400", "소집해제");
	}

	public static String getFgMilitaryDischargeType(String FgMilitaryDischargeTypeCode) {
		return FgMilitaryDischargeType_MAP.getOrDefault(FgMilitaryDischargeTypeCode, "");
	}
}
