import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/css/pages/SignupPage.css";

import SweetAlert from "../components/Contents/SweetAlert";
import axios from "axios";
import { useLoading } from "../containers/LoadingContext";
import { getCookie, removeCookie } from "../containers/Cookie";

const validateId = (id) => /^[a-z0-9]{4,}$/.test(id);
const validatePassword = (password) => /^[a-z0-9]{4,}$/.test(password);
const validateEmail = (email) => /^\S+@\S+\.\S+$/.test(email);

const MyPage = () => {
  console.log("MyPage 컴포넌트 렌더링"); // 이 로그가 얼마나 많이 찍히는지 확인
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

  const alertExit = () => {
    setShowAlert(false);
  };

  const handleChange = (event) => {
    const { id, value } = event.target;
    setMemberData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSignupBtn = async () => {
    console.log("정보수정 버튼클릭~~~~~~~~~~~~~~~~~~~~");

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
      setAlertMessage("암호는 4자리 이상의 영소문자, 숫자만 입력가능합니다.");
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
      const response = await axios.post(
        "/api1/auth/updateMemberData",
        memberData,
      );
      console.log(response.data);
      setLoading(false);

      if (response.data === 1) {
        setAlertMessage("수정성공");
        setAlertType("success");
        setShowAlert(true);
        //removeCookie("loginInfo");
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

  const getUsersData = async () => {
    const loginInfo = getCookie("loginInfo");
    const loginInfoParts = loginInfo.split(".");
    const id = loginInfoParts[0];

    try {
      const response = await axios.get(`/api1/auth/getOneMemberData?id=${id}`);
      if (response.status === 200 && response.data) {
        setMemberData(response.data);
      }
    } catch (error) {
      console.error("API 호출 중 오류 발생:", error);
    }
  };

  useEffect(() => {
    console.log("MyPage 컴포넌트가 마운트됨");
    getUsersData();
    return () => {
      console.log("MyPage 컴포넌트가 언마운트됨");
    };
  }, []);

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
            if (alertType === "success" && alertMessage === "수정성공") {
              navigate("/main");
            }
          }}
        />
      )}
      <div className="signupBox">
        <p className="signupTxt">회원정보수정</p>
        <p className="signupInfoTxt">
          {memberData.name} 님의 정보를 수정합니다.
          <br />
          <br />
          {/* Oh easy 에서 제공하는 다양한 서비스로
          <br /> 더 스마트해진 업무환경을 경험하세요 */}
        </p>
        <div className="signupForm">
          <div className="inputWithLabel">
            <input
              type="text"
              className="signupInput id"
              id="updateMemberId"
              onChange={handleChange}
              value={memberData.id || ""}
              readOnly
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
            />
            <label htmlFor="email" className="floatingLabel">
              이메일
            </label>
          </div>
          <button className="signupOkBtn" onClick={handleSignupBtn}>
            <p className="signupBtnTxt">정보수정</p>
          </button>
          <Link to="/main">
            <button className="signupCancleBtn">
              <p className="signupCalcleBtnTxt">메인으로</p>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
