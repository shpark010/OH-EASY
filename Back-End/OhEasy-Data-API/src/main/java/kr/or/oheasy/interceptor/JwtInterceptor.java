package kr.or.oheasy.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import kr.or.oheasy.utils.JwtUtil;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class JwtInterceptor implements HandlerInterceptor {

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

        // JWT 검증
        if (!JwtUtil.validateToken(token)) {
        	System.out.println("토큰 올바르지 않음 ***********");
            response.setStatus(HttpServletResponse.SC_FORBIDDEN); // 403 Forbidden
            return false;
        }

        return true;
    }
}
