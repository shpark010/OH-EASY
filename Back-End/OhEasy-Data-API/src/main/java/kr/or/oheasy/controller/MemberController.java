package kr.or.oheasy.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/member")
public class MemberController {
	
	@PostMapping("signup")
	public ResponseEntity<?> signup(){
		System.out.println("회원가입 진입");
		
		// 회원가입 성공시 1리턴 실패시 2리턴
		int result = 0;
		
		return new ResponseEntity<>(result, HttpStatus.OK);
	}

}
