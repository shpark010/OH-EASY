import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/css/pages/SignupPage.css";

import SweetAlert from "../components/Contents/SweetAlert";
import axios from "axios";
import { useLoading } from "../containers/LoadingContext";

const validateId = (id) => /^[a-z0-9]{4,10}$/.test(id);
const validatePassword = (password) => /^[a-z0-9]{4,10}$/.test(password);
const validateEmail = (email) => /^\S+@\S+\.\S+$/.test(email);

const SignupPage = () => {
  const { setLoading } = useLoading();
  const navigate = useNavigate();

  const [memberData, setMemberData] = useState({
    id: "",
    name: "",
    password: "",
    email: "",
    companyName: "한국소프트웨어협회", // 기본값 설정
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [nextInputTag, setNextInputTag] = useState();

  const alertExit = () => {
    setShowAlert(false);
  };

  const handleChange = (event) => {
    const { id, value } = event.target;
    setMemberData((prevData) => ({
      ...prevData,
      [id]: value.replace(/\s+/g, ""),
    }));
  };

  const handleKeyDown = (event) => {
    console.log(event.target.id);

    const idTag = event.target.id;
    if (idTag === "id" && event.key === "Enter") {
      console.log("아이디 태그 이면서 엔터누름");

      // 'Tab' 키가 눌린 것처럼 다음 입력 요소로 포커스 이동
      const nextInputElement = findNextInputElement(event.target);
      console.log(nextInputElement);
      setNextInputTag(nextInputElement);
      // if (nextInputElement && nextInputElement.focus) {
      //   nextInputElement.focus();
      // }

      handleIdCheck(event);
    }

    if (event.key === "Enter") {
      const nextInputElement = findNextInputElement(event.target);
      console.log(nextInputElement);
      if (nextInputElement && nextInputElement.focus) {
        nextInputElement.focus();
      }
    }
  };

  const findNextInputElement = (element) => {
    // 현재 요소의 부모인 .inputWithLabel div를 찾습니다.
    let parentDiv = element.parentElement;

    // 그 다음 형제 요소를 찾습니다.
    let nextDiv = parentDiv.nextSibling;

    // 다음 형제 요소가 없다면 (즉, 마지막 .inputWithLabel이면) 다음 div를 찾습니다.
    while (nextDiv && nextDiv.className !== "inputWithLabel") {
      nextDiv = nextDiv.nextSibling;
    }

    // 찾아진 다음 .inputWithLabel div의 첫번째 input 태그를 반환합니다.
    if (nextDiv) {
      return nextDiv.querySelector("input");
    }

    return null;
  };
  const handleSignupBtn = async () => {
    console.log("회원가입 버튼클릭~~~~~~~~~~~~~~~~~~~~");

    if (
      memberData.id === "" ||
      memberData.password === "" ||
      memberData.name === "" ||
      memberData.email === ""
    ) {
      setAlertMessage("입력하지않은 항목이 존재합니다.");
      setAlertType("warning");
      setShowAlert(true);
      return;
    }

    if (!validatePassword(memberData.password)) {
      setAlertMessage(
        "암호는 4자리 이상 10자리 이하의 영소문자, 숫자만 입력가능합니다.",
      );
      setAlertType("warning");
      setShowAlert(true);
      return;
    }
    if (memberData.name.trim() === "") {
      setAlertMessage("이름을 입력해주세요.");
      setAlertType("warning");
      setShowAlert(true);
      return;
    }
    if (!validateEmail(memberData.email)) {
      setAlertMessage("올바른 이메일 형식이 아닙니다.");
      setAlertType("warning");
      setShowAlert(true);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("/api1/auth/signup", memberData);
      console.log(response.data);
      setLoading(false);

      if (response.data === 1) {
        setAlertMessage("가입성공");
        setAlertType("success");
        setShowAlert(true);
      } else {
        setAlertMessage("알수없는 오류(담당자에게 문의해주세요.)");
        setAlertType("warning");
        setShowAlert(true);
      }
    } catch (error) {
      console.error("api 요청 실패:", error);
      setAlertMessage("알수없는 오류(담당자에게 문의해주세요.)");
      setAlertType("warning");
      setShowAlert(true);
    }
  };
  const handleIdCheck = async (event) => {
    //const idValue = event.target.value;
    console.log(memberData.id);
    console.log("아이디 중복체크 ~~~~~~~~~~~~~~~~~");
    console.log(validateId(memberData.id));
    // 1. 아이디 유효성 검사
    if (!validateId(memberData.id)) {
      event.target.focus(); // 포커스를 다시 아이디 입력창에 주기
      setAlertMessage(
        "아이디는 4자리이상 10자리이하의 영소문자, 숫자만 입력가능합니다.",
      );
      setAlertType("error");
      setShowAlert(true);
      return;
    }
    console.log("api 요청~~~~~~~~~~~~~~~~~~~~");
    try {
      const response = await axios.get("/api1/auth/idCheck", {
        params: {
          id: memberData.id,
        },
      });
      // 2. 서버 응답 처리
      if (response.data === 0) {
        setAlertMessage("가입가능한 아이디 입니다.");
        setAlertType("success");
        setShowAlert(true);
      } else if (response.data === 1) {
        setAlertMessage("중복된 아이디입니다.");
        setAlertType("warning");
        setShowAlert(true);
        event.target.focus(); // 포커스를 다시 아이디 입력창에 주기
      }
      setLoading(false);
    } catch (error) {
      console.error("api 요청 실패:", error);
    }
  };
  return (
    <div className="signupMainDiv">
      {showAlert && (
        <SweetAlert
          text={alertMessage}
          type={alertType}
          showCancel={false}
          confirmText="확인"
          onConfirm={() => {
            setShowAlert(false);
            setAlertMessage();
            setAlertType();
            if (alertType === "success" && alertMessage === "가입성공") {
              navigate("/login");
            }
          }}
        />
      )}
      <div className="signupBox">
        <p className="signupTxt">회원가입</p>
        <p className="signupInfoTxt">
          Oh easy 에서 제공하는 다양한 서비스로
          <br /> 더 스마트해진 업무환경을 경험하세요
        </p>
        <div className="signupForm">
          <div className="inputWithLabel">
            <input
              type="text"
              className="signupInput"
              id="id"
              value={memberData.id}
              onChange={handleChange}
              onBlur={(e) => {
                handleIdCheck(e);
              }} // onBlur 이벤트를 handleIdCheck로 변경
              onKeyDown={handleKeyDown}
            />
            <label htmlFor="id" className="floatingLabel">
              아이디
            </label>
          </div>
          <div className="inputWithLabel">
            <input
              type="password"
              className="signupInput"
              id="password"
              onChange={handleChange}
              value={memberData.password || ""}
              onKeyDown={handleKeyDown}
              required
            />
            <label htmlFor="password" className="floatingLabel">
              비밀번호
            </label>
          </div>
          <select
            className="companySelectTag"
            value={memberData.companyName || ""}
            onChange={(e) =>
              setMemberData({ ...memberData, companyName: e.target.value })
            }
            disabled
          >
            <option key="한국소프트웨어협회" value="한국소프트웨어협회">
              &nbsp;&nbsp;한국소프트웨어협회
            </option>
          </select>
          <div className="inputWithLabel">
            <input
              type="text"
              className="signupInput"
              id="name"
              onChange={handleChange}
              value={memberData.name || ""}
              onKeyDown={handleKeyDown}
              required
            />
            <label htmlFor="name" className="floatingLabel">
              이름
            </label>
          </div>
          <div className="inputWithLabel">
            <input
              type="text"
              className="signupInput"
              id="email"
              onChange={handleChange}
              value={memberData.email || ""}
              required
              onKeyDown={handleKeyDown}
            />
            <label htmlFor="email" className="floatingLabel">
              이메일
            </label>
          </div>
          <button className="signupOkBtn" onClick={handleSignupBtn}>
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
};

export default SignupPage;
