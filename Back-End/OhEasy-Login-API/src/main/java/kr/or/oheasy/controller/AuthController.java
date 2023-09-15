package kr.or.oheasy.controller;

import java.net.URLEncoder;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.or.oheasy.service.AuthService;
import kr.or.oheasy.service.RedisService;
import kr.or.oheasy.utils.JwtUtil;
import kr.or.oheasy.vo.LoginVO;
import kr.or.oheasy.vo.LogoutVO;

@RestController
@RequestMapping("/api1/auth")
public class AuthController {

	@Autowired
	private AuthService authService;

	@Autowired
	private RedisService redisService;

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

			// Redis에 데이터(아이디, 토큰) 저장
			//redisService.setData(loginVO.getUserId(), token);

			String idToken = loginVO.getUserId() + "." + token;
			System.out.println(idToken);

			return new ResponseEntity<>(idToken, HttpStatus.OK);
		} else if (result == 0) {
			// 아이디 혹은 비밀 번호가 틀릴 경우 401
			return new ResponseEntity<>(1, HttpStatus.UNAUTHORIZED);
		} else {
			// 알수 없는 오류
			return new ResponseEntity<>(1, HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}

	@PostMapping("/logout")
	public ResponseEntity<?> logout(@RequestBody LogoutVO logoutVO) {
		System.out.println("로그아웃 진입");
		System.out.println(logoutVO);
		// Redis에 데이터(아이디, 토큰) 저장
		Boolean redisResult = redisService.delData(logoutVO.getLogoutId());
		return new ResponseEntity<>(redisResult, HttpStatus.OK);

	}

	@PostMapping("jwtCheck")
	public ResponseEntity<?> jwtCheck(@RequestBody Map<String, String> payload) {
		String token = payload.get("token");
		System.out.println("체크진입함********************************");
		System.out.println("넘어온 토큰 : " + token);
		boolean result = JwtUtil.validateToken(token);
		System.out.println("유효성검사 결과 : " + result);
		if (result == true) {
			return new ResponseEntity<>(result, HttpStatus.OK);
		} else {

			return new ResponseEntity<>(result, HttpStatus.UNAUTHORIZED);
		}

	}

}
