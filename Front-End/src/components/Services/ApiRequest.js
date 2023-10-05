import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useLoading } from "../../containers/LoadingContext";

const useApiRequest = () => {
  const { setLoading } = useLoading();
  // React Router의 navigate 함수를 사용하여 페이지 이동을 수행
  const navigate = useNavigate();

  // 주어진 쿠키 이름(cname)을 기반으로 해당 쿠키의 값을 반환
  const getCookie = (cname) => {
    const name = cname + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") {
        c = c.substring(1);
      }
      // 해당 이름의 쿠키를 찾았다면 값을 반환
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    // 쿠키를 찾지 못한 경우 빈 문자열을 반환
    return "";
  };

  // API 요청을 수행하는 함수
  const apiRequest = async (props) => {
    setLoading(true);
    const { method, url, data } = props;

    // "loginInfo"라는 이름의 쿠키 값
    const loginInfo = getCookie("loginInfo");

    // loginInfo 쿠키가 없는 경우 사용자를 로그인 페이지로 리디렉션
    if (!loginInfo) {
      alert("유효하지 않은 요청입니다");
      setLoading(false);
      navigate("/login");
      return;
    }

    // loginInfo 쿠키에서 토큰 정보를 추출
    const tokenParts = loginInfo.split(".");
    const token = `${tokenParts[1]}.${tokenParts[2]}.${tokenParts[3]}`;
    console.log("토큰 추출~~~~~~~~");
    console.log(token);
    const headers = {
      "Content-Type": "application/json",
    };

    // 토큰이 있을 경우, 헤더에 추가
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    console.log("헤더 ********************");
    console.log(headers);
    let requestData = data;
    if (data instanceof FormData) {
      // FormData를 사용하는 경우, Content-Type 헤더를 삭제하여 브라우저가 자동으로 설정하게 합니다.
      delete headers["Content-Type"];
    } else {
      requestData = JSON.stringify(data);
    }

    // 실제로 API를 호출하는 부분
    try {
      const response = await axios({
        method,
        url,
        headers,
        data: requestData,
      });
      setLoading(false);
      return response.data;
    } 
    // catch (error) {
    //   // API 요청 중 오류가 발생
    //   console.error("API 요청 실패 :", error);
    //   // "loginInfo" 쿠키 삭제
    //   document.cookie =
    //     "loginInfo=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    //   setLoading(false);
    //   navigate("/login");
      
    //   if (error.response && error.response.status === 409) {
    //     throw error; // 409 에러일 때만 에러를 다시 발생
    //   } else {
    //       return null; // 그 외의 경우에는 null을 반환
    //   }

    // }
    catch (error) {
      setLoading(false);
      console.error("API 요청 실패 :", error);
  
      if (error.response && error.response.status === 409) {
          throw error; // 409 에러일 때만 에러를 다시 발생
      } else {
          // "loginInfo" 쿠키 삭제
          document.cookie = "loginInfo=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          navigate("/login"); // 그 외의 경우에는 로그인 페이지로 리디렉션
          return null;
      }
    }
  };

  // apiRequest 함수를 반환
  return apiRequest;
};

export default useApiRequest;
