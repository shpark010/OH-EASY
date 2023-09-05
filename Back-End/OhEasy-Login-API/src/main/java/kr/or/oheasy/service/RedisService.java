package kr.or.oheasy.service;

import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
public class RedisService {

	private final RedisTemplate<String, String> redisTemplate;

	@Autowired
	public RedisService(RedisTemplate<String, String> redisTemplate) {
		this.redisTemplate = redisTemplate;
	}
	
//	key: Redis에 저장될 데이터의 키(key)
//	value: Redis에 저장될 데이터의 값(value)
//	expirationInSeconds: 데이터의 만료 시간을 초 단위로 지정
//	TimeUnit.SECONDS: 데이터의 만료 시간의 단위를 초(seconds)로 설정
	
//	주요 옵션:
//	setIfAbsent: 이 메서드는 키(key)가 이미 Redis에 존재하는 경우에는 데이터를 저장하지 않고 false를 반환. 
//	따라서 해당 키가 이미 존재하지 않을 때만 데이터를 저장하려면 setIfAbsent를 사용 -> NX (Not Exists) 옵션의 역할
//	expirationInSeconds: 데이터의 만료 시간을 초 단위로 지정하면 해당 시간이 지난 후에 Redis에서 데이터가 자동으로 삭제 -> EX (Expire) 옵션의 역할

	// 데이터 저장
	public void setData(String key, String value) {
		//데이터 리턴 타입 : Boolean
		Boolean result = redisTemplate.opsForValue().setIfAbsent(key, value, 8, TimeUnit.HOURS);
		System.out.println(result);
	}

	// 데이터 불러오기
	public String getData(String key) {
		return redisTemplate.opsForValue().get(key);
	}
	
	//데이터 삭제하기
	public Boolean delData(String key) {
		return redisTemplate.delete(key);
	}
}