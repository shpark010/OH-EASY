package kr.or.oheasy.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import kr.or.oheasy.service.AuthService;
import kr.or.oheasy.utils.JwtUtil;
import kr.or.oheasy.vo.LoginVO;

@RestController
@RequestMapping("/auth")
public class AuthController {

	@Autowired
	private AuthService authService;
	
	
	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody LoginVO loginVO) {
		System.out.println("로그인 진입");
		System.out.println(loginVO);
		
		int result = authService.login(loginVO);
		System.out.println("result : " + result);
		
		if (result == 1) {
			// 아이디 비번 맞을 경우 200
			// 맞으면 jwt 토큰 생성 후 뷰페이지로 리턴
			
			String token = JwtUtil.generateToken(loginVO.getUserId());
			System.out.println("생성된 jwt 토큰 : " + token);
			
			return new ResponseEntity<>(token, HttpStatus.OK);
		}else if(result == 0) {
			// 아이디 혹은 비밀 번호가 틀릴 경우 401 
			return new ResponseEntity<>(1, HttpStatus.UNAUTHORIZED);
		}else {
			// 알수 없는 오류 
			return new ResponseEntity<>(1, HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}

	@PostMapping("jwtCheck")
	public ResponseEntity<?> jwtCheck(@RequestBody Map<String, String> payload){
		 String token = payload.get("token");
		System.out.println("체크진입함********************************");
		System.out.println("넘어온 토큰 : " + token);
		boolean result = JwtUtil.validateToken(token);
		System.out.println("유효성검사 결과 : "+result);
		if(result == true) {
			return new ResponseEntity<>(result, HttpStatus.OK);
		}else {
			
			return new ResponseEntity<>(result, HttpStatus.UNAUTHORIZED);
		}
		
		
	}
	
}
