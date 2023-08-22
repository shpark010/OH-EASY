import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/css/pages/LoginPage.css";

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isChecked: false,
      userId: "",
      userPwd: "",
    };
  }

  handleCheckboxChange = (event) => {
    this.setState({ isChecked: event.target.checked });
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };
  login = async (event) => {
    event.preventDefault();
    try {
      const { userId, userPwd } = this.state;
      const response = await axios.post("/auth/login", {
        userId,
        userPwd,
      });
      if (response.status === 200) {
        // 로그인 성공 시 처리
        console.log(response.data);
        const token = response.data; // 여기서 token 값을 어떻게 가져오는지는 서버의 응답 형태에 따라 다를 수 있습니다.
        localStorage.setItem("token", token); // 여기에서 localStorage에 토큰 값을 저장
        console.log("로그인 성공!");
        window.location.href = "/main";
        // ...
      } else if (response.status === 401) {
        // 로그인 실패 시 처리
        console.log("아이디 or 비밀번호 틀림");
      } else {
        console.log(response.status);
        console.log("서버오류");
      }
    } catch (error) {
      console.error("오류 : ", error);
    }
  };
  render() {
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
                value={this.state.userId}
                onChange={this.handleChange}
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
                value={this.state.userPwd}
                onChange={this.handleChange}
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
                checked={this.state.isChecked}
                onChange={this.handleCheckboxChange}
              />
              <p className="loginCheckBoxTxt">아이디저장</p>
            </div>
            <button className="btn loginBtn" onClick={this.login}>
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
}
export default LoginPage;
