package kr.or.oheasy.hrm.utils;

import java.util.HashMap;
import java.util.Map;

public class FgMilitaryRankUtil {
	
	private static final Map<String, String> FgMilitaryRank_MAP = new HashMap<>();
	
	static {
		FgMilitaryRank_MAP.put("30100", "이병");
		FgMilitaryRank_MAP.put("30200", "일병");
		FgMilitaryRank_MAP.put("30300", "상병");
		FgMilitaryRank_MAP.put("30400", "병장");
		FgMilitaryRank_MAP.put("30500", "하사");
		FgMilitaryRank_MAP.put("30600", "중사");
		FgMilitaryRank_MAP.put("30700", "상사");
		FgMilitaryRank_MAP.put("30800", "원사");
		FgMilitaryRank_MAP.put("30900", "준사관");
		FgMilitaryRank_MAP.put("30950", "장교");
	}

	public static String getFgMilitaryRank(String FgMilitaryRankCode) {
		return FgMilitaryRank_MAP.getOrDefault(FgMilitaryRankCode, "");
	}
}
