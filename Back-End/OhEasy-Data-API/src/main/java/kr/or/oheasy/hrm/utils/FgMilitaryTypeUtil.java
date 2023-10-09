package kr.or.oheasy.hrm.utils;

import java.util.HashMap;
import java.util.Map;

public class FgMilitaryTypeUtil {
	
	private static final Map<String,String> FgMilitaryType_MAP = new HashMap<>();
	
	static {
		FgMilitaryType_MAP.put("40100", "육군");
		FgMilitaryType_MAP.put("40200", "해군");
		FgMilitaryType_MAP.put("40300", "공군");
		FgMilitaryType_MAP.put("40400", "의무경찰");
	}

	public static String getFgMilitaryType(String FgMilitaryTypeCode) {
		return FgMilitaryType_MAP.getOrDefault(FgMilitaryTypeCode, "");
	}
}
