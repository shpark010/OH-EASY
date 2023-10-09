package kr.or.oheasy.hrm.utils;

import java.util.HashMap;
import java.util.Map;

public class FgMilitaryServiceUtil {
	
	private static final Map<String,String> FgMilitaryService_MAP = new HashMap<>();
	
	static {
		FgMilitaryService_MAP.put("20100", "현역");
		FgMilitaryService_MAP.put("20200", "공익근무");
		FgMilitaryService_MAP.put("20300", "방위산업체");
		FgMilitaryService_MAP.put("20400", "기간산업체");
		FgMilitaryService_MAP.put("20500", "산업기능");
		FgMilitaryService_MAP.put("20600", "미필");
		FgMilitaryService_MAP.put("20700", "면제");
	}

	public static String getFgMilitaryService(String FgMilitaryServiceCode) {
		return FgMilitaryService_MAP.getOrDefault(FgMilitaryServiceCode, "");
	}
}
