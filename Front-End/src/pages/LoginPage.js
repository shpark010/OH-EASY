import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { setCookie, getCookie, removeCookie } from "../containers/Cookie";
import "../styles/css/pages/LoginPage.css";

function LoginPage() {
  const [isChecked, setIsChecked] = useState(false);
  const [userId, setUserId] = useState("");
  const [userPwd, setUserPwd] = useState("");

  const navigate = useNavigate();
  useEffect(() => {
    //const token = localStorage.getItem("token");
    const token = getCookie("loginInfo");
    if (token) {
      navigate("/main", { replace: true });
    }
  }, []);

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "userId") setUserId(value);
    if (name === "userPwd") setUserPwd(value);
  };

  const login = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("/api1/auth/login", {
        userId,
        userPwd,
      });
      if (response.status === 200) {
        console.log(response.data);
        const loginId = response.data.split("/")[0];
        const token = response.data.split("/")[1];
        console.log("로그인 아이디 : " + loginId);
        console.log("발급 토큰 : " + token);
        //localStorage.setItem("token", token);
        setCookie("loginInfo", response.data, { path: "/", maxAge: 28800 });
        console.log("로그인 성공!");
        console.log("저장된 쿠키값 가져오기 : " + getCookie("loginInfo"));
        navigate("/main");
      } else if (response.status === 401) {
        console.log("아이디 or 비밀번호 틀림");
      } else {
        console.log(response.status);
        console.log("서버오류");
      }
    } catch (error) {
      console.error("오류 : ", error);
    }
  };
  return (
    <div className="loginMainDiv">
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
              required
            />
            <label htmlFor="userPwd" className="floatingLabel">
              비밀번호
            </label>
          </div>
          <div className="checkboxContainer">
            <input
              type="checkbox"
              className="loginCheckBox"
              checked={isChecked}
              onChange={handleCheckboxChange}
            />
            <p className="loginCheckBoxTxt">아이디저장</p>
          </div>
          <button className="btn loginBtn" onClick={login}>
            로그인
          </button>
          <Link to="/signup">
            <button className="btn signupBtn">회원가입</button>
          </Link>
        </div>
        <div className="accountRecoveryContainer">
          <p className="lostAccountTxt">계정을 잃어버리셨나요?</p>
          <div className="recoveryOptions">
            <p className="recoveryOption">아이디 찾기</p>
            <span className="separator">|</span>
            <p className="recoveryOption">비밀번호 찾기</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
