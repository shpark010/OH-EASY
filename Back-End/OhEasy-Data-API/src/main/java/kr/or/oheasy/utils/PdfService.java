package kr.or.oheasy.utils;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.GetObjectRequest;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.util.IOUtils;
import com.itextpdf.io.font.PdfEncodings;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfReader;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Image;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Text;

import kr.or.oheasy.vo.SdPdfInfoVO;

@Service
public class PdfService {

    public ByteArrayInputStream generatePdf(SdPdfInfoVO pdfInfo) throws IOException {
        File file = new ClassPathResource("static/SWSA0101_12_62.pdf").getFile(); // 기본 양식 파일
        PdfReader reader = new PdfReader(file);
		ByteArrayOutputStream out = new ByteArrayOutputStream();

		PdfWriter writer = new PdfWriter(out);
		PdfDocument pdf = new PdfDocument(reader, writer);
		Document document = new Document(pdf);

		// Windows 환경의 시스템 폰트 경로
		String fontPath = "C:\\Windows\\Fonts\\malgun.ttf"; // 예: Windows에 설치된 맑은 고딕 폰트
		PdfFont font = PdfFontFactory.createFont(fontPath, "Identity-H", true); // 한글 폰트 로드

		FormatPrice formatPrice = new FormatPrice();

		Map<String, String> dataMap = new HashMap<>();

		dataMap.put("195,747,1", pdfInfo.getYyAllowance()); // 년도
		dataMap.put("262,747,1", pdfInfo.getMmBelong()); // 지급월
		dataMap.put("467,692,1", pdfInfo.getDtAllowance()); // 지급일

		dataMap.put("94,669,1", pdfInfo.getCdEmp()); // 사원코드
		dataMap.put("237,669,1", pdfInfo.getNmEmp()); // 사원명
		dataMap.put("400,669,1", pdfInfo.getDtBirth()); // 생년월일
		dataMap.put("87,653,1", pdfInfo.getNmDept()); // 부서명
		dataMap.put("235,653,1", pdfInfo.getNmPosition()); // 직급명
		dataMap.put("395,653,1", pdfInfo.getDtHire()); // 입사일

		dataMap.put("210,560,1", formatPrice.formatMoney(pdfInfo.getAmtAllowance())); // 기본급
		dataMap.put("210,235,1", formatPrice.formatMoney(pdfInfo.getAmtAllowance())); // 지급액 계

		dataMap.put("463,560,1", formatPrice.formatMoney(pdfInfo.getNationalPension())); // 국민연금
		dataMap.put("463,535,1", formatPrice.formatMoney(pdfInfo.getHealthInsurance())); // 건강보험
		dataMap.put("466,511,1", formatPrice.formatMoney(pdfInfo.getLongtermNursingInsurance())); // 장기요양보험
		dataMap.put("466,484,1", formatPrice.formatMoney(pdfInfo.getEmploymentInsurance())); // 고용보험
		dataMap.put("463,459,1", formatPrice.formatMoney(pdfInfo.getIncomeTax())); // 소득세
		dataMap.put("466,432,1", formatPrice.formatMoney(pdfInfo.getLocalIncomeTax())); // 지방소득세
		dataMap.put("463,253,1", formatPrice.formatMoney(pdfInfo.getTotalDeduct())); // 공제액 계
		dataMap.put("460,235,1", formatPrice.formatMoney(pdfInfo.getNetPay())); // 차인지급액(실수령액)
		dataMap.put("460,144,1", formatPrice.formatMoney(pdfInfo.getNetPay())); // 지급액

        dataMap.forEach((position, data) -> {
            String[] coordinates = position.split(",");
            float x = Float.parseFloat(coordinates[0]);
            float y = Float.parseFloat(coordinates[1]);
            int page = Integer.parseInt(coordinates[2]);
            
            Text text = new Text(data).setFont(font); // 폰트 설정
            float fontSize = 11;
            if (position.equals("195,747,1") || position.equals("262,747,1")) {
            	fontSize = 19;
            }
            text.setFontSize(fontSize);

            document.add(new Paragraph(text).setFixedPosition(page, x, y, 500));
        });

        document.close();

        return new ByteArrayInputStream(out.toByteArray());
    }
    
    public ByteArrayInputStream generatePdfHr(Map<String, String> dataMap) throws IOException {
        File file = new ClassPathResource("static/SWPM0102_01_10.pdf").getFile(); // 기본 양식 파일
        PdfReader reader = new PdfReader(file);
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PdfFont font = PdfFontFactory.createFont("static/SpoqaHanSansNeo-Light.ttf", PdfEncodings.IDENTITY_H, true);
        
        PdfWriter writer = new PdfWriter(out);
        PdfDocument pdf = new PdfDocument(reader, writer);
        Document document = new Document(pdf);
        
        String imagePath = dataMap.get("imagePath");
        System.out.println("***********************");
        System.out.println(imagePath);
        System.out.println("***********************");
        
        if (imagePath != null && !imagePath.isEmpty()) { // 이미지 경로가 있을 경우
            AmazonS3 s3Client = AmazonS3ClientBuilder.standard()
                                  .withRegion(Regions.AP_NORTHEAST_2) // 지역을 AP_NORTHEAST_2 (아시아 태평양 서울)로 설정
                                  .build();

            String bucketName = "leefinal";
            String key = imagePath.replace("https://leefinal.s3.ap-northeast-2.amazonaws.com/", "");
            S3Object s3Object = s3Client.getObject(new GetObjectRequest(bucketName, key));
            InputStream objectData = s3Object.getObjectContent();

            Image img = new Image(ImageDataFactory.create(IOUtils.toByteArray(objectData)));
            img.scaleAbsolute(85, 85); // 이미지 크기 설정
            img.setFixedPosition(30, 670); // 이미지의 위치를 최상단 왼쪽으로 설정
            document.add(img);

            // 메모리 해제
            objectData.close();
            s3Object.close();
        }
        
        dataMap.remove("imagePath"); // 이미지 경로 정보 삭제
        dataMap.forEach((position, data) -> {
            String[] coordinates = position.split(",");
            float x = Float.parseFloat(coordinates[0]);
            float y = Float.parseFloat(coordinates[1]);
            int page = Integer.parseInt(coordinates[2]);
            
            // Text 객체를 생성하고 폰트 크기를 설정
            Text text = new Text(data).setFont(font);
            if (position.equals("130,543,1") || position.equals("146,543,1")|| position.equals("238,543,1") ||position.equals("95,430,1")) {
                text.setFontSize(7);  // 원하는 폰트 크기로 설정
            }
            
            document.add(new Paragraph(text).setFixedPosition(page, x, y, 500)); // 데이터를 원하는 위치에 추가
        });
        
        document.close();
        
        return new ByteArrayInputStream(out.toByteArray());
    }
}


