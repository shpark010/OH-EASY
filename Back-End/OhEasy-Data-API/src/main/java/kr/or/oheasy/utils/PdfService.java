package kr.or.oheasy.utils;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.util.Map;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfReader;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Text;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;

@Service
public class PdfService {

    public ByteArrayInputStream generatePdf(Map<String, String> dataMap) throws IOException {
        File file = new ClassPathResource("static/SWSA0101_12_62.pdf").getFile(); // 기본 양식 파일
        PdfReader reader = new PdfReader(file);
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        PdfWriter writer = new PdfWriter(out);
        PdfDocument pdf = new PdfDocument(reader, writer);
        Document document = new Document(pdf);

        // Windows 환경의 시스템 폰트 경로
        String fontPath = "C:\\Windows\\Fonts\\malgun.ttf"; // 예: Windows에 설치된 맑은 고딕 폰트
        PdfFont font = PdfFontFactory.createFont(fontPath, "Identity-H", true); // 한글 폰트 로드

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
}


