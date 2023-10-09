package kr.or.oheasy.utils;

import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Component;

@Component
@PropertySource("classpath:static/secret.properties")
public class SecretProperties {
}

