import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { setCookie, getCookie } from "../containers/Cookie";
import { useLoading } from "../containers/LoadingContext";
import "../styles/css/pages/LoginPage.css";
import SweetAlert from "../components/Contents/SweetAlert";

function LoginPage() {
  const [isChecked, setIsChecked] = useState(false);
  const [userId, setUserId] = useState("");
  const [userPwd, setUserPwd] = useState("");
  const { setLoading } = useLoading();

  const [showAlert, setShowAlert] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [alertType, setAlertType] = useState("");
  const handleShowAlert = () => {
    setShowAlert(true); // 알림창 표시 상태를 false로 설정
  };
  const handleCloseAlert = () => {
    setShowAlert(false); // 알림창 표시 상태를 false로 설정
  };

  const navigate = useNavigate();
  useEffect(() => {
    const token = getCookie("loginInfo");
    if (token) {
      navigate("/main", { replace: true });
    }
  }, []);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      login(event);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "userId") setUserId(value.replace(/\s+/g, ""));
    if (name === "userPwd") setUserPwd(value.replace(/\s+/g, ""));
  };

  const login = async (event) => {
    console.log("로그인이벤트 실행 ~~~~~~~");
    console.log(userId);
    console.log(userPwd);

    event.preventDefault();
    if (!userId) {
      setAlertText("아이디를 입력해주세요.");
      setAlertType("error");
      setShowAlert(true);
      return;
    }

    if (!userPwd) {
      setAlertText("비밀번호를 입력해주세요.");
      setAlertType("error");
      setShowAlert(true);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("/api1/auth/login", {
        userId,
        userPwd,
      });
      console.log(response.status);
      if (response.status === 200 || response.data === "1") {
        console.log(response.data);
        setCookie("loginInfo", response.data.idToken, {
          path: "/",
          maxAge: 28800,
        });
        setCookie("companyName", response.data.companyName, {
          path: "/",
          maxAge: 28800,
        });
        setCookie("name", response.data.name, {
          path: "/",
          maxAge: 28800,
        });
        console.log("로그인 성공!");
        console.log("저장된 쿠키값 가져오기 : " + getCookie("loginInfo"));
        console.log("저장된 쿠키값 가져오기 : " + getCookie("companyName"));
        console.log("저장된 쿠키값 가져오기 : " + getCookie("name"));

        navigate("/main");
      } else if (response.status === 401) {
        console.log("아이디 or 비밀번호 틀림");
        setAlertText("아이디 및 비밀번호를 다시 확인해주세요");
        setAlertType("error");
        setShowAlert(true);
      } else {
        console.log(response.status);
        console.log("서버오류");
      }
    } catch (error) {
      console.error("오류 : ", error);
      console.log(error.response.status);
      if (error.response.status === 401) {
        setAlertText("아이디 및 비밀번호를 다시 확인해주세요");
        setAlertType("error");
        setShowAlert(true);
      } else if (error.response.status === 409) {
        setAlertText("현재 접속중인 아이디 입니다.");
        setAlertType("error");
        setShowAlert(true);
      }
    }
    setLoading(false);
  };
  return (
    <div className="loginMainDiv">
      {showAlert && (
        <SweetAlert
          text={alertText}
          //showCancel={true}
          type={alertType}
          onConfirm={() => {
            handleCloseAlert();
            setAlertText();
            setAlertType();
          }}
        />
      )}
      <div className="loginBox">
        <p className="loginTxt">로그인</p>
        <p className="loginInfoTxt">
          Oh easy 에서 제공하는 다양한 서비스로
          <br /> 더 스마트해진 업무환경을 경험하세요
        </p>
        <div className="loginForm">
          <div className="inputWithLabel">
            <input
              type="text"
              className="signupInput"
              id="userId"
              name="userId"
              value={userId}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              required
            />
            <label htmlFor="userId" className="floatingLabel">
              아이디
            </label>
          </div>
          <div className="inputWithLabel">
            <input
              type="password"
              className="signupInput"
              id="userPwd"
              name="userPwd"
              value={userPwd}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              required
            />
            <label htmlFor="userPwd" className="floatingLabel">
              비밀번호
            </label>
          </div>

          <button className="btn loginBtn" onClick={login}>
            로그인
          </button>
          <Link to="/signup">
            <button className="btn signupBtn">회원가입</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
