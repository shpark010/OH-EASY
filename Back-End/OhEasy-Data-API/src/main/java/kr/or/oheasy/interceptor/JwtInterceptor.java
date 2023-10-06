package kr.or.oheasy.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import kr.or.oheasy.utils.JwtUtil;

@Component
public class JwtInterceptor implements HandlerInterceptor {
	
	 @Autowired
	    private RedisTemplate<String, String> redisTemplate;
	
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // 헤더에서 JWT 토큰 가져오기
        String token = request.getHeader("Authorization");
        
        System.out.println("인터셉터 토큰 검증 !!!!!!!!!!!!!!!!!!");
        System.out.println(token);

        // 토큰이 존재하는지 체크
        if (token == null || !token.startsWith("Bearer ")) {
        	System.out.println("토큰 없음 ***********");
            response.setStatus(HttpServletResponse.SC_FORBIDDEN); // 403 Forbidden
            return false;
        }

        // "Bearer " 제거
        token = token.substring(7);
        System.out.println("\"Bearer \" 제거");
        System.out.println(token);
        String[] parts = token.split("\\.", 2);
        String userId = parts[0];
        String jwtToken = parts[1];
        
        //redis 검증
//        String redisToken = redisTemplate.opsForValue().get(userId);
//        System.out.println(jwtToken);
//        System.out.println(redisToken);
//        if (redisToken == null || !jwtToken.equals(redisToken)) {
//            System.out.println("Redis에 저장된 token과 값이 다르거나 없습니다.");
//            return false;
//        } else {
//            System.out.println("동일합니다.");
//        }

        // JWT 검증
        if (!JwtUtil.validateToken(jwtToken)) {
        	System.out.println("토큰 올바르지 않음 ***********");
            response.setStatus(HttpServletResponse.SC_FORBIDDEN); // 403 Forbidden
            return false;
        }

        return true;
    }
}
