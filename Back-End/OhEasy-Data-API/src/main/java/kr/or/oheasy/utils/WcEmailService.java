package kr.or.oheasy.utils;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import kr.or.oheasy.vo.WcEmailVO;
import kr.or.oheasy.wc.dao.WcDao;

@Service
public class WcEmailService {
    @Autowired
    private SqlSession sqlSession; // mybatis

    @Autowired
    private JavaMailSender javaMailSender;

    
//    public String sendEmailToEmployees(Map<String, Object> emailData) throws Exception {
//        WcDao wcdao = sqlSession.getMapper(WcDao.class);
//        List<WcEmailVO> employees = wcdao.getEmployeeEmailData(emailData);
//
//        // 누락된 이메일 주소를 추적하는 List
//        List<String> missingEmailEmployees = new ArrayList<>();
//
//        // 성공적으로 이메일을 보낸 사람들을 추적하는 List
//        List<String> successfulEmailEmployees = new ArrayList<>();
//
//        for (WcEmailVO emp : employees) {
//            if (emp.getNmEmail() == null || emp.getNmEmail().isEmpty()) {
//                System.out.println("Email address is null or empty for employee: " + emp.getNmEmp());
//                missingEmailEmployees.add(emp.getNmEmp());
//                continue;  // 이메일이 없는 경우 다음 직원으로 건너뜁니다.
//            }
//
//            try {
//                MimeMessage mail = javaMailSender.createMimeMessage();
//                MimeMessageHelper helper = new MimeMessageHelper(mail, true);
//                String htmlContent = buildEmailContent(emp);
//                helper.setTo(emp.getNmEmail());
//                helper.setSubject("근로계약서 교부 양식입니다.");
//                helper.setText(htmlContent, true);
//                javaMailSender.send(mail);
//                
//                successfulEmailEmployees.add(emp.getNmEmp());  // 메일 전송 성공한 직원 이름을 리스트에 추가합니다.
//
//            } catch (MailException e) {
//                throw new Exception("Failed to send email due to messaging exception.", e);
//            }
//        }
//
//        StringBuilder resultMessage = new StringBuilder();
//
//        if (!successfulEmailEmployees.isEmpty()) {
//            resultMessage.append(successfulEmailEmployees.size())
//                         .append("명에게 메일을 성공적으로 보냈습니다: ")
//                         .append(String.join(", ", successfulEmailEmployees))
//                         .append(". ");
//        }
//
//        if (!missingEmailEmployees.isEmpty()) {
//            resultMessage.append(missingEmailEmployees.size())
//                         .append("명에게 메일을 보내지 못했습니다: ")
//                         .append(String.join(", ", missingEmailEmployees));
//        }
//
//        // 모든 사원이 메일 보내기에 성공했다면 "Emails sent successfully"를 반환
//        if (successfulEmailEmployees.size() == employees.size()) {
//            return "Emails sent successfully";
//        }
//
//        return resultMessage.toString();
//    }
    
//    @Async
//    public String sendEmailToEmployees(Map<String, Object> emailData) throws Exception {
//        WcDao wcdao = sqlSession.getMapper(WcDao.class);
//        List<WcEmailVO> employees = wcdao.getEmployeeEmailData(emailData);
//
//        // 누락된 이메일 주소를 추적하는 List
//        List<String> missingEmailEmployees = new ArrayList<>();
//
//        // 성공적으로 이메일을 보낸 사람들을 추적하는 List
//        List<String> successfulEmailEmployees = new ArrayList<>();
//
//        for (WcEmailVO emp : employees) {
//            if (emp.getNmEmail() == null || emp.getNmEmail().isEmpty()) {
//                System.out.println("Email address is null or empty for employee: " + emp.getNmEmp());
//                missingEmailEmployees.add(emp.getNmEmp());
//                continue;  // 이메일이 없는 경우 다음 직원으로 건너뜁니다.
//            }
//
//            try {
//                MimeMessage mail = javaMailSender.createMimeMessage();
//                MimeMessageHelper helper = new MimeMessageHelper(mail, true);
//                String htmlContent = buildEmailContent(emp);
//                helper.setTo(emp.getNmEmail());
//                helper.setSubject("근로계약서 교부 양식입니다.");
//                helper.setText(htmlContent, true);
//                javaMailSender.send(mail);
//                
//                successfulEmailEmployees.add(emp.getNmEmp());  // 메일 전송 성공한 직원 이름을 리스트에 추가합니다.
//
//            } catch (MailException e) {
//                throw new Exception("Failed to send email due to messaging exception.", e);
//            }
//        }
//
//        StringBuilder resultMessage = new StringBuilder();
//
//        if (!successfulEmailEmployees.isEmpty()) {
//            resultMessage.append(successfulEmailEmployees.size())
//                         .append("명에게 메일을 성공적으로 보냈습니다: ")
//                         .append(String.join(", ", successfulEmailEmployees))
//                         .append(". ");
//        }
//
//        if (!missingEmailEmployees.isEmpty()) {
//            resultMessage.append(missingEmailEmployees.size())
//                         .append("명에게 메일을 보내지 못했습니다: ")
//                         .append(String.join(", ", missingEmailEmployees));
//        }
//
//        // 모든 사원이 메일 보내기에 성공했다면 "Emails sent successfully"를 반환
//        if (successfulEmailEmployees.size() == employees.size()) {
//            return "Emails sent successfully";
//        }
//
//        // 모든 사원이 메일 보내기에 실패했다면 "Emails sent fail"를 반환
//        if (successfulEmailEmployees.isEmpty()) {
//            return "Emails sent fail";
//        }

//        return resultMessage.toString();
    
    @Async
    public CompletableFuture<Map<String, Object>> sendEmailToEmployees(Map<String, Object> emailData) throws Exception {
        WcDao wcdao = sqlSession.getMapper(WcDao.class);
        List<WcEmailVO> employees = wcdao.getEmployeeEmailData(emailData);

        List<String> missingEmailEmployees = new ArrayList<>();
        List<String> successfulEmailEmployees = new ArrayList<>();

        for (WcEmailVO emp : employees) {
            if (emp.getNmEmail() == null || emp.getNmEmail().isEmpty()) {
                System.out.println("Email address is null or empty for employee: " + emp.getNmEmp());
                missingEmailEmployees.add(emp.getNmEmp());
                continue;
            }

            try {
                MimeMessage mail = javaMailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(mail, true);
                String htmlContent = buildEmailContent(emp);
                helper.setTo(emp.getNmEmail());
                helper.setSubject("근로계약서 교부 양식입니다.");
                helper.setText(htmlContent, true);
                javaMailSender.send(mail);
                
                successfulEmailEmployees.add(emp.getNmEmp());

            } catch (MailException e) {
                throw new Exception("Failed to send email due to messaging exception.", e);
            }
        }

        StringBuilder resultMessage = new StringBuilder();

        if (!successfulEmailEmployees.isEmpty()) {
            resultMessage.append(successfulEmailEmployees.size())
                         .append("명에게 메일을 성공적으로 보냈습니다: ")
                         .append(String.join(", ", successfulEmailEmployees))
                         .append(". ");
        }

        if (!missingEmailEmployees.isEmpty()) {
            resultMessage.append(missingEmailEmployees.size())
                         .append("명에게 메일을 보내지 못했습니다: ")
                         .append(String.join(", ", missingEmailEmployees));
        }

        Map<String, Object> response = new HashMap<>();

        if (successfulEmailEmployees.size() == employees.size()) {
            response.put("status", "success");
            response.put("message", "Emails sent successfully");
        } else if (successfulEmailEmployees.isEmpty()) {
            response.put("status", "fail");
            response.put("message", "Emails sent fail");
        } else {
            response.put("status", "partial");
            response.put("message", resultMessage.toString());
        }
        
        return CompletableFuture.completedFuture(response);
    }

    


    private String buildEmailContent(WcEmailVO emp) {
        return "<!DOCTYPE html>"
            + "<html>"
            + "<head>"
                + "<link href='https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap' rel='stylesheet'>"
            + "</head>"
            + "<body style='font-family: Roboto, Arial, sans-serif;'>"
                + "<div style='width: 60%; margin: 0 auto; font-family: Roboto, Arial, sans-serif; border: 4px solid #000; padding: 24px 80px; position: relative;'>"
                    + "<h1 style='text-align: center; font-size: 40px;'>근로계약서 교부 양식</h1>"
                    + "<table style='width: 80%; border-collapse: collapse; text-align: center; margin-bottom: 20px; margin-top: 20px; margin-left: auto; margin-right: auto; font-size: 16px;'>"
                    + row("직원명", emp.getNmEmp())
                    + row("이메일", emp.getNmEmail())
                    + row("계약시작일", formatDate(emp.getDtStartCont()))
                    + row("계약종료일",formatDate(emp.getDtEndCont()))
                    + row("근무지 우편번호", emp.getNoWorkPost())
                    + row("근무지 주소", emp.getAddrWork())
                    + row("근무지 상세주소", emp.getAddrWorkDtl())
                    + row("업무내용", emp.getCntnJob())
                    + row("정규근무 시작시간", formatTime(emp.getTmStartRegularWork()))
                    + row("정규근무 종료시간", formatTime(emp.getTmEndRegularWork()))
                    + row("휴게시간 시작", formatTime(emp.getTmStartBreak()))
                    + row("휴게시간 종료", formatTime(emp.getTmEndBreak()))
                    + row("근무일수", formatWorkingDays(emp.getDdWorking()))
                    + row("근무요일", formatDotw(emp.getDotw()))
                    + row("급여유형", formatTpSal(emp.getTpSal()))
                    + row("급여액", formatAmtSal(emp.getAmtSal()))
                    + row("급여지급 방법", formatMethodPay(emp.getMethodPay()))
                    + row("직원보험", formatInsurance(emp.getYnEmpInsurance()))
                    + row("산재보험", formatInsurance(emp.getYnIndustrialAccidentInsurance()))
                    + row("국민연금", formatInsurance(emp.getYnNationalPension()))
                    + row("건강보험", formatInsurance(emp.getYnHealthInsurance()))
                    + row("계약서 서명", formatStSign(emp.getStSign()))
                    + row("생성일", formatDate(emp.getDtCreated()))
                    + "</table>"
                    + "<img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAX0AAACECAMAAABLTQsGAAAAsVBMVEX///8WFhUAqvAAAAB6enoMDAr19fVMTEwRERAAqPAApu/y8vLn5+dsbGvJycmAgH8qKim2trXh4eCVlZUfHx2jo6NbW1tFRURTU1MkJCMvLy46Ojm9vb3X19dYWFiIiIitra1FtvLl9v1ycnGRkZDFxcUArfA+Pj3W8Pybm5vR0dCv4PlQvfN4zPaZ2fj0/P7c9P1nw/SK0ve/6Ptuyval3fnM6vuEy/U5u/Ndv/Qjs/EO80R6AAAKO0lEQVR4nO2cCVfiOhSAW0pLN0B2EJEqsgoiqDyH///DXpLmZmlTxZnxPeTc78wZaUkb/JImNwtaFoIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgP477l8367u5utz/cf18ei/2O5LHePH5fHudCWaM+XiYrryjty24WBkGpVAqC8LhZKO90xB2WhnNjetgsFzG5Ue50vz+GLJMgDEvrR+Wd0SSfhyXOlTvkaDoxZkAp/KX+V1pOnm5i+qyH95CaB8JwJ+tmTVxb8fLnBvRwZciI8yDus91oeZBClv69nrigY/j4VXIU+YV5xH9T2t9j4thZqJAom26veWH+S1JNwu/i9r3cOf+aHq38XD6QnbB/mGXzKIW7LbwbteEWjnxa4OMz+9aoXZDLudo3fmDfGd5oqba7MOuF1s0nkWDg5+x7Ffdr9h8NWZTCtXjEOlBR3CshMx76in2rnK9LZ22/eWXU4jqJkmj7yySfqNlDiqGbs291v2bfKF/V3xBqnR7k4fVd1X79MuyTDyxbV+s11yKAGmh8hvm6/0X7C3MBU/38ftK+7dT5uUux77LeyZWSZOv6qIgJCWpZ8Ir5uX29F3QVM1P6/namtGg0EyVL3sAp9m14NIvs/5BeF+y73WWrNS732+JXdIe8670/Si93r0+P+53sHcNdmuZT+1FLZdkX+nnV3wvdwezX09vT5q4kC/mZJVHt++0VO1dgv11v6fn9Fyp/A7APDU1z6YjQopWeegqFl8c0ArnfS/0HduZT+zojWYlTbc+i6oeb1LX1chT5btgJ1b7tXrOczPb9qzOt61my9qkZXi99m/2CW6j64buM8Bdgi1f+r9kfDaDqO930jKj6wYtIJQOtGctYs287t/Rckf3mX9LzzeTtWysIQp0GPTxwB8Fxq1x3AP0zVlW/ZD8eCvk8vSjhkjq8tdb8EQvf6JFuP22yLs++NYYhTJkebaAGHrQLofFJw56v2PfmInC/5l3LAZ6kVy0lPGEBC3sy9llYcHEtD6mbMEod0iNeLYNf+oXQFwcs5v803lfoC/k2VFGIqoKFnvSVn5/Rg6x9d9As7HXLY4X66g8lfRsm+zBKtR1LhoLp06/AzQTv9OALdb8KEn1XWOHPV7aERas3o6XSkKUGj86JEef4DyV9Gyb7YsDuEJf3YD874Quh0JEenG5/LOSngT6DN/DhP5k87qE7UO1fdYXjyUmjLWUe78ww2n8A+6T5fC4V2H/8LfsdOV2QyLPcfrC3dKDoSzQS4vb9dlO0Xc7y9vLsi243OqHuszb5VPs3Ur7aHBTWfbBPe3ywb3tNMSaxB/bF2YemWWv3HzNX/qO2+/PTet2plF9X7wXt/i6Th5j8UVoe346U+8DtMvZdlZ9lH2bS/St6BLFNxgyE6CEbiPa4/Z5cGIC+252LUzU5RV/Wbgat2CzzgEG0O6NDDcW+7D0K7FduFfr6dPkZYbIP3ZszoUevatwheYMgkT0TvPklbbJIEF9DayTyupZDXH355gU6F73hF1Htu/KxmH2rq+vPxvsjy1P4c03fhMG+14OAM6GHL6B5rV4nWuS0UESU1BApploZUsT8gjvIrJ1t9bsBUPBpoWj2Y1GSRvs/dqzr3cJgy2eOxBRnoAxE74+BVibwuLhDUdHEoIEXiNczrE0Br2KK81me3OgnNfvWSPa8F2S/NhThHI9KxAxYuIbJhhcxx8xnxVaiWvfTau3JDnCUXiNHWYO8m0VJwOdRrYWYZOMzebp9sW58EfbrtVrtJhl3xcKHf81rqGhkSkHp19thcdivxQRzsE5didbKdubLVbxayukEvs1BBoPOQ01lymTKyh/e7V8Wh8fdTM74p4Wesa9tCMjYHyRaFrVznWoQa1u5RSfZhD/JhSa27KQsboXwNDwIFa5+H75K0FFVGXaUPCsLZkEmj3R6P2dfNmW5mCe3teRMZ91OWtd9L1xzFbsaIr0XFPBVENELGDJKo/GXojyCI88ia9+KB+Kz//R1XR1fG4pu7wr2NChjgBvjL+47tfTt/mf2lbXFjHzoh3P21cHbJdl37I6W6vnOtKtBn43PDoBS+XCfz+2b9YdHsayQt2+1RIRwMfZJw13NxgzbdU5NkBkakaY/N/6XM2kn2CcDuPxetjs5+jXYF4Oun2p/4GhTIoT5gylee5uFuvvjIZtkdKv0tj4tRPlLV7RsCmZhnte6/7CkFnADbqHYj+bpSWG/II8ztR93KyrVemdUMDC/398FXE5A9xdvDWmm1bnLowy7P1YLsdyrFNBLlGQvv0oij/C40aZ9pvwW6kyeNeqnN0mLsFOQS+9cJxs87+QZke1h/z4jHNdPC5N7SjSqJZ1Op1HLFqJXiJ5u8bY70kzeN7kvCZgv0M6dlsfPZftffKnhvqhwEQRBEARBLoJRo8G2+XixhjFh7aMbxY16tTppjb7nY14OI0HEvoXIVuETx5ekK5EeScHTR2xeg+1/vmloQDktYR67i/4/RM7CN4g1x63Qkwk7Qc2zn1Qq/Q4qT99gxURnF7yhPpHPty88OD4pxsqA/HB/yDrX/8TAt/P2R/QbJw/Xvnu7pK/oYHVFVNK32j51rNv3Yc0mtR+7vlOlz0uNvKgXZYxY1L5Tv6HQZgPsM6Khus5gtG/FzWYzntJ70FfNdE7hxvEHaRvUctJdSUgBxFwiDlT7cdWx/XYLJmnM9hnNKx++58Qg9vmqNOk/7O/76BdAgf1V2XFc9m+cdpxgf2CwT0pE3S7YdPiOjKbtK8mQPGC/uVqtRvXUfpxcU/GVpHNN/ffpCv+KPAlXg8FV+q0VzT57SNT9gmNSUlfVScUlvTYGPR8B9rt0acS3mf0ace72b2IvihP65zHoTlxin3WtOfvNCqnqxLO6FF23aemRgptPLeQDpH22EyVtefrOZEW3QdM4aNpnoQyt+1VC1n5ik4o+6ZH/bpVR2ahDFzPrN7m/94FogP3GstPpdN3Ufsz62i5fGWYKze1+1KUxfYOuKvqO9tclao4/t5BPyPe6XiclmZNKzV9PzTFPo03O9lmdZy8rnlXjV5RJsJnw1xezuPXXyduPYPjly41vE7P9MmmrINaMSQ9x5ZEeF5aW5Z62M11VPwPy9uPcX7lQ7WstTzSYKzHNAw1wxvmL0X4hA9+f3/YplYTH+3EcR1GkzXJGrNft9vu3eq+rz+LQDiLKX4zyC2k7sAuFjFdhtLUq17PfsiVRKEtI/s/G+1ke6uVz3bZ8blR6wLCjznFmZwhWc0hHY3hmH7pnheWKzg/p0Q9yItL+J7NjzH5s+CuES7rDzUX7v8MX7Rs62FZqv/Hh1YgRad+2uwLDdz7Tdj/K4zH7fk9cfDvB8e6JLPmCIV1ZVCp0kkvYcuSXIbNQ+668eIj2T6TVS5irxGkrGNqRh15x2xL1bOViu4f2EQRBEARBEARBEARBEARBEARBEARBEARBEARBEARBEARBkN/gX3CE3Ij0bhpJAAAAAElFTkSuQmCC' alt='Image Description' style='position: absolute; bottom: 16px; right: 16px; width: 100px; height: 100px;'>"
                    + "<p style='margin-top: 16px; text-align: center; font-size: 18px;'>계약기간동안 소지해주세요.</p>"
                    + "<p style='position: absolute; bottom: 16px; right: 16px; font-size: 16px;'>"
                        + "인사담당자: 조병국<br>"
                        + "tel) 010-xxxx-xxxx<br>"
                        + "email: rmarkddl9059@naver.com"
                    + "</p>"
                + "</div>"
            + "</body>"
            + "</html>";
    }
    

    
    private String row(String label, Object value) {
        System.out.println(value);
        return "<tr>"
            + "<td style='padding: 8px; width: 25%; border: 1px solid black; background-color: #92c5ff;'><strong>" + label + "</strong></td>"
            + "<td style='padding: 8px; width: 75%; border: 1px solid black;'>" + (value != null ? value : "정보 없음") + "</td>"
            + "</tr>";
    }

    private String formatDate(String date) {
        if (date == null) {
        	
            return null;
        }
        return date.substring(0, 4) + "년 " + date.substring(4, 6) + "월 " + date.substring(6, 8) + "일";
    }
    
    
    private String formatTime(String time) {
    	System.out.println("*********"+"formatTime");
 
        if (time == null) {
        	
            return time;
        }
        return time.substring(0, 2) + "시 " + time.substring(2, 4) + "분";
    }
    
    private String formatWorkingDays(String days) {
    System.out.println("***********3"+days);
    
    if (days == null) { //switch는 null을 모름.
        System.out.println("***********10"+days);
        return null; // null을 반환하거나 다른 기본값 반환
    }
    	switch (days) {
    
            case "1":
            	System.out.println("***********4"+days);
                
            	return "1주에 1일";
                
            case "2":
            	System.out.println("***********6"+days);
                return "1주에 2일";
            case "3":
                return "1주에 3일";
            case "4":
                return "1주에 4일";
            case "5":
                return "1주에 5일";
            case "6":
                return "1주에 6일";
            case "7":
            	System.out.println("***********5"+days);
                return "1주에 7일";
            default:
            	System.out.println("***********7"+days);
            	return null;
        }
    }
    
    private String formatDotw(String day) {
    	  if (day == null) {
    	        System.out.println("***********days is null");
    	        return null; // null을 반환하거나 다른 기본값 반환
    	    }
        switch (day) {
       
            case "1":
                return "매주 월요일";
            case "2":
                return "매주 화요일";
            case "3":
                return "매주 수요일";
            case "4":
                return "매주 목요일";
            case "5":
                return "매주 금요일";
            case "6":
                return "매주 토요일";
            case "7":
                return "매주 일요일";
            default:
            	return null;
        }
    }
    
    private String formatTpSal(String type) {
    	  if (type == null) {
    	        System.out.println("***********days is null");
    	        return null; // null을 반환하거나 다른 기본값 반환
    	    }
        switch (type) {
      
            case "1":
                return "월급";
            case "2":
                return "주급";
            case "3":
                return "시급";
            default:
            	return null;
        }
    }
    
    private String formatAmtSal(String amount) {
        if (amount == null) return null;
        try {
            int amt = Integer.parseInt(amount);
            DecimalFormat formatter = new DecimalFormat("#,###");
            return formatter.format(amt) + "원";
        } catch (NumberFormatException e) {
            return amount;
        }
    }
    
    private String formatMethodPay(String method) {
    	  if (method == null) {
    	        System.out.println("***********days is null");
    	        return null; // null을 반환하거나 다른 기본값 반환
    	    }
        switch (method) {
        
            case "1":
                return "예금통장에 지급";
            case "2":
                return "직접지급";
            default:
            	return null;
        }
    }
    
    private String formatInsurance(String value) {
    	  if (value == null) {
    	        System.out.println("***********days is null");
    	        return null; // null을 반환하거나 다른 기본값 반환
    	    }
        switch (value) {
       
            case "1":
                return "가입";
            case "2":
                return "미가입";
            default:
            	return null;
        }
    }
    
    private String formatStSign(String value) {
    	  if (value == null) {
    	        System.out.println("***********days is null");
    	        return null; // null을 반환하거나 다른 기본값 반환
    	    }
        switch (value) {
            case "1":
                return "서명완료";
            case "2":
                return "서명 미작성";
            default:
            	return null;
        }
    }
    
    }
    
    


