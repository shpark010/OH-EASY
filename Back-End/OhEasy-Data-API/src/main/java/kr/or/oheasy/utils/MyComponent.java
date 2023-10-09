package kr.or.oheasy.utils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class MyComponent {

    @Value("${aws.s3.access-key}")
    private String awsS3AccessKey;

    @Value("${aws.s3.secret-key}")
    private String awsS3SecretKey;

    @Value("${smtp.email.username}")
    private String smtpEmailUsername;

    @Value("${smtp.email.password}")
    private String smtpEmailPassword;
}
