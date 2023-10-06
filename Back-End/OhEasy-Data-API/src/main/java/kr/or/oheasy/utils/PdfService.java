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

@Service
public class PdfService {

    public ByteArrayInputStream generatePdf(Map<String, String> dataMap) throws IOException {
        File file = new ClassPathResource("static/SWSA0101_12_62.pdf").getFile(); // 기본 양식 파일
        PdfReader reader = new PdfReader(file);
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        PdfWriter writer = new PdfWriter(out);
        PdfDocument pdf = new PdfDocument(reader, writer);
        Document document = new Document(pdf);

        dataMap.forEach((position, data) -> {
            String[] coordinates = position.split(",");
            float x = Float.parseFloat(coordinates[0]);
            float y = Float.parseFloat(coordinates[1]);
            int page = Integer.parseInt(coordinates[2]);
            
         // Text 객체를 생성하고 폰트 크기를 설정
            Text text = new Text(data);
            if (position.equals("195,748,1") || position.equals("262,748,1")) {
                text.setFontSize(19);  // 원하는 폰트 크기로 설정
            }

            document.add(new Paragraph(text).setFixedPosition(page, x, y, 500)); // 데이터를 원하는 위치에 추가
        });

        document.close();

        return new ByteArrayInputStream(out.toByteArray());
    }
}


