package kr.or.oheasy.utils;

public class Camel {
	
	public static String camelToSnake(String str) {
	    String regex = "([a-z])([A-Z]+)";
	    String replacement = "$1_$2";
	    str = str.replaceAll(regex, replacement).toUpperCase();
	    return str;
	}
}
