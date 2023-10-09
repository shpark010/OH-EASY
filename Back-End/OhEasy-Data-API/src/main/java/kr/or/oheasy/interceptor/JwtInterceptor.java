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
	
//	@Autowired
//	private RedisTemplate<String, String> redisTemplate;
	
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
        
//        //Redis 토큰 검증
//        String exsitToken = redisTemplate.opsForValue().get(userId);
//        if(!jwtToken.equals(exsitToken)) {
//            System.out.println("쿠키토큰 : " + jwtToken);
//            System.out.println("레디스토큰 : " + exsitToken);
//            System.out.println("달라");
//            return false;
//        }else {
//        	System.out.println("토큰 비교 결과 일치함");
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
