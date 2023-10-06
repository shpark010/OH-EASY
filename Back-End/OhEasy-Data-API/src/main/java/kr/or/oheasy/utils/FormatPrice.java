package kr.or.oheasy.utils;

import java.text.NumberFormat;
import java.util.Locale;

public class FormatPrice {
	public String formatPrice(String price) {

		// 문자열을 숫자로 변환
		double amount = Double.parseDouble(price);

		// NumberFormat 인스턴스 생성
		NumberFormat format = NumberFormat.getCurrencyInstance(Locale.KOREA);

		// 금액 표기 형식으로 변환
		String formattedAmt = format.format(amount);

		return formattedAmt;
	}
	
	public String formatMoney(String money) {
        long amount = Long.parseLong(money); // String을 long으로 변환합니다.
        NumberFormat format = NumberFormat.getInstance(Locale.KOREA); // 한국의 로캐일을 사용하여 NumberFormat 인스턴스를 생성합니다.
        return format.format(amount); // 금액 형식으로 문자열을 변환합니다.
    }

}
