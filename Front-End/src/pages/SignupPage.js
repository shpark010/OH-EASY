import React, { Component } from "react";
import { Link } from "react-router-dom";
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
            <div className="inputWithLabel">
              <input type="text" className="signupInput" id="userId" required />
              <label htmlFor="userId" className="floatingLabel">
                아이디
              </label>
            </div>
            <div className="inputWithLabel">
              <input
                type="password"
                className="signupInput"
                id="userPwd"
                required
              />
              <label htmlFor="userPwd" className="floatingLabel">
                비밀번호
              </label>
            </div>
            <select className="companySelectTag">
              <option key="한국소프트웨어협회" value="한국소프트웨어협회">
                &nbsp;&nbsp;한국소프트웨어협회
              </option>
            </select>
            <div className="inputWithLabel">
              <input
                type="text"
                className="signupInput"
                id="userName"
                required
              />
              <label htmlFor="userName" className="floatingLabel">
                이름
              </label>
            </div>
            <div className="inputWithLabel">
              <input
                type="txt"
                className="signupInput"
                id="userEmail"
                required
              />
              <label htmlFor="userEmail" className="floatingLabel">
                이메일
              </label>
            </div>
            <button className="signupOkBtn">
              <p className="signupBtnTxt">회원가입</p>
            </button>
            <Link to="/login">
              <button className="signupCancleBtn">
                <p className="signupCalcleBtnTxt">취소</p>
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default SignupPage;
