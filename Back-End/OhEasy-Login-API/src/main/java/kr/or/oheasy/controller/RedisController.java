package kr.or.oheasy.controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import kr.or.oheasy.service.RedisService;

@RestController
@RequestMapping("/redis")
public class RedisController {

    private final RedisService redisService;

    public RedisController(RedisService redisService) {
        this.redisService = redisService;
    }

    @PostMapping("/set")
    public void saveData(@RequestParam String key, @RequestParam String value) {
    	System.out.println(key + value);
        redisService.setData(key, value);
    }

    @GetMapping("/get")
    public String getData(@RequestParam String key) {
        String result = redisService.getData(key);
        System.out.println(result);
        return result;
    }
}
