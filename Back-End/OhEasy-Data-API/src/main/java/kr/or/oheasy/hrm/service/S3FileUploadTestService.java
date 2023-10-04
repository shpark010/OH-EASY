package kr.or.oheasy.hrm.service;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.AmazonServiceException;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.DeleteObjectsRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;

import kr.or.oheasy.hrm.dao.HrDao;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class S3FileUploadTestService {

    @Autowired
    private SqlSession sqlSession;
	
    private final AmazonS3 amazonS3;

    @Value("${cloud.aws.s3.bucket}")
    private String bucketName;

    private String dir = "profileImg";
    private String defaultUrl = "https://leefinal-bucket.s3.ap-northeast-2.amazonaws.com";

    public String uploadFile(MultipartFile file, String cdEmp) throws IOException {
        System.out.println(" uploadFile 1번");
        String dirUrl = defaultUrl +"/" +dir + "/";

        // UUID를 사용하여 파일 이름을 생성합니다.
        String fileName = generateFileNameUsingUUID(file);

        System.out.println(fileName);
        System.out.println(" uploadFile 2번");

        try {
            amazonS3.putObject(bucketName, dir + "/" + fileName, file.getInputStream(), getObjectMetadata(file));

        }catch (Exception e) {
            System.out.println("오류 **********************");
            e.printStackTrace();
        }
        System.out.println(" uploadFile 3번");
        System.out.println(dirUrl +"" +fileName);
        
        String result = amazonS3.getUrl(bucketName, dir +"/"+fileName).toString();
        System.out.println(result);
        HrDao dao = sqlSession.getMapper(HrDao.class);
        dao.updateHrEmpDtl(cdEmp, "PATH", result);
        
        return result;
    }
    
    public void deleteFileFromS3(String key) {
        try {
            amazonS3.deleteObject(bucketName, key);
            System.out.println(" 삭제 성공 :  " + key);
        } catch (AmazonServiceException e) {
            System.err.println("삭제 실패 " + key);
            e.printStackTrace();
        }
    }

    public void deleteFilesFromS3(List<String> fileNames) {
        DeleteObjectsRequest deleteObjectsRequest = new DeleteObjectsRequest(bucketName)
            .withKeys(fileNames.toArray(new String[0]));
        amazonS3.deleteObjects(deleteObjectsRequest);
    }
    

    // UUID를 사용하여 파일 이름을 생성하는 함수
    private String generateFileNameUsingUUID(MultipartFile file) {
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename.contains(".") 
            ? originalFilename.substring(originalFilename.lastIndexOf(".")) 
            : "";
        return UUID.randomUUID().toString() + extension;
    }



    private ObjectMetadata getObjectMetadata(MultipartFile file) {
        ObjectMetadata objectMetadata = new ObjectMetadata();
        objectMetadata.setContentType(file.getContentType());
        objectMetadata.setContentLength(file.getSize());
        return objectMetadata;
    }


}