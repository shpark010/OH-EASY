import React, { Component } from "react";
import "../styles/css/pages/SignupPage.css";

class SignupPage extends Component {
  render() {
    return (
      <div className="signupMainDiv">
        <div className="signupBox">
          <p className="signupTxt">회원가입</p>
          <p className="signupInfoTxt">
            Oh easy 에서 제공하는 다양한 서비스로
            <br /> 더 스마트해진 업무환경을 경험하세요
          </p>
          <div className="signupForm">
            <input
              type="text"
              className="signupInput"
              placeholder="  아이디를 입력해주세요"
            ></input>
            <input
              type="password"
              className="signupInput"
              placeholder="  비밀번호를 입력해주세요"
            ></input>
            <select className="signupInput companySelectTag">
              <option key="한국소프트웨어협회" value="한국소프트웨어협회">
                &nbsp;&nbsp;한국소프트웨어협회
              </option>
            </select>
            <input
              type="text"
              className="signupInput"
              placeholder="  이름을 입력해주세요"
            ></input>
            <input
              type="text"
              className="signupInput"
              placeholder="  이메일을 입력해주세요"
            ></input>
          </div>
        </div>
      </div>
    );
  }
}

export default SignupPage;
