import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../styles/css/pages/LoginPage.css";

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isChecked: false,
    };
  }

  handleCheckboxChange = (event) => {
    this.setState({ isChecked: event.target.checked });
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
            <input
              type="text"
              className="loginInput"
              placeholder="  아이디를 입력해주세요"
            />
            <input
              type="password"
              className="loginInput"
              placeholder="  비밀번호를 입력해주세요"
            />
            <div className="checkboxContainer">
              <input
                type="checkbox"
                className="loginCheckBox"
                checked={this.state.isChecked}
                onChange={this.handleCheckboxChange}
              />
              <p className="loginCheckBoxTxt">아이디저장</p>
            </div>
            <button className="btn loginBtn">로그인</button>
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
