package kr.or.oheasy.utils;

import java.util.Date;

import javax.crypto.SecretKey;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

public class JwtUtil {

    public static String generateToken(String userId) {
    	SecretKey key = Keys.hmacShaKeyFor(JwtProperties.getSecretKey());
    	System.out.println("진입*************************");
        return Jwts.builder()
                .setSubject(userId)
                .setExpiration(new Date(System.currentTimeMillis() + JwtProperties.EXPIRATION_TIME))  // 10일 유효
                .signWith(key)
                .compact();
    }
    
    
    public static boolean validateToken(String token) {
        try {
            SecretKey key = Keys.hmacShaKeyFor(JwtProperties.getSecretKey());
            Jws<Claims> claims = Jwts.parserBuilder()
                                     .setSigningKey(key)
                                     .build()
                                     .parseClaimsJws(token);
            return true;
        } catch (JwtException e) {
            // 유효하지 않은 서명, 만료된 토큰 등의 이유로 JwtException 발생
            return false;
        }
    }
    
    
}