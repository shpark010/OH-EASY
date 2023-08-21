import React, { Component } from "react";
import "../styles/css/pages/LoginPage.css";

class LoginPage extends Component {
  render() {
    return (
      <div className="loginMainDiv">
        <div className="loginBox">
          <p className="loginTxt">로그인</p>
          <p className="loginInfoTxt">
            Oh easy 에서 제공하는 다양한 서비스로<br></br> 더 스마트해진
            업무환경을 경험하세요
          </p>
          <div className="loginForm">
            <input className="loginInput"></input>
            <input className="loginInput"></input>
            <input type="checkbox" className="loginCheckBox" value="1"></input>
            <p className="loginCheckBoxTxt">아이디저장</p>
          </div>
        </div>
      </div>
    );
  }
}

export default LoginPage;
