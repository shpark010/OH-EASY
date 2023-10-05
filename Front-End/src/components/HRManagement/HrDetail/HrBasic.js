import React, { useRef, useState, useEffect } from "react";
import CustomButton from "../../Contents/CustomButton";
import CustomInput from "../../Contents/CustomInput";
import Input from "../../Contents/Input";
import CustomCalender from "../../Contents/CustomCalendar";
import CustomSelect from "../../Contents/CustomSelect";

import noImage from "../../../images/noimage.jpg";
import CustomRadio from "../../Contents/CustomRadio";
import useApiRequest from "../../Services/ApiRequest";
import SweetAlert from "../../Contents/SweetAlert";

const defaultEmpBasicData = {
  cdEmp: "", // 사원코드
  nmEngEmp: "", // 영문명
  nmHanjaEmp: "", // 한자명
  noResident: "", //  주민번호
  dtBirth: "", // 생년월일
  fgMarriage: "", // 결혼여부
  noDepartment: "", // 부서번호
  noPositionUnique: "", // 직급고유번호
  fgWorkcontract: "", // 근로계약서작성여부
  dtHire: "", // 입사일
  dtResign: "", // 퇴사일
  path: "", // 이미지 경로
};

const HrBasic = ({ cdEmp }) => {
  const apiRequest = useApiRequest();
  const [empBasicData, setEmpBasicData] = useState({ ...defaultEmpBasicData });

  const [showAlert, setShowAlert] = useState(false);
  const [alertText, setAlertText] = useState("");
  const openAlertWithText = (text) => {
    setAlertText(text);
    setShowAlert(true);
  };

  const handleInputBlur = async (e) => {
    console.log("블러이벤 ****************************");
    const { name, value } = e.target;
    if (cdEmp == null || cdEmp === "" || cdEmp === undefined || value === "") {
      return;
    }

    try {
      const responseData = await apiRequest({
        method: "GET",
        url: `/api2/hr/updateBasicEmpData?cdEmp=${cdEmp}&${name}=${value}`,
      });
      console.log("API Response:", responseData);
    } catch (error) {
      console.error("Failed to fetch emp data:", error);
    }
    setEmpBasicData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSelectChange = async (e, columns) => {
    if (cdEmp === undefined || cdEmp == null || cdEmp === "") {
      return;
    }
    console.log("handleSelectChange 이벤 ***********");
    const { name, value } = e.target;
    console.log(name);
    console.log(value);
    try {
      const responseData = await apiRequest({
        method: "GET",
        url: `/api2/hr/updateBasicEmpData?cdEmp=${cdEmp}&${columns}=${value}`,
      });
    } catch (error) {
      console.error("Failed to fetch emp data:", error);
    }
    setEmpBasicData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDateChange = async (value, name) => {
    if (cdEmp === undefined || cdEmp === null) {
      return;
    }
    value = value.replace(/-/g, "");
    try {
      const responseData = await apiRequest({
        method: "GET",
        url: `/api2/hr/updateBasicEmpData?cdEmp=${cdEmp}&${name}=${value}`,
      });
    } catch (error) {
      console.error("Failed to fetch emp data:", error);
    }
    setEmpBasicData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log("인풋값변경~~~~~~~~~~~~~~~~~");
    console.log(value);
    setEmpBasicData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const determineGenderFromResident = (noResident) => {
    if (!noResident || noResident.length < 8) return "";

    const genderIndicator = noResident[7];
    if (genderIndicator === "1" || genderIndicator === "3") {
      return "0"; // 남
    } else if (genderIndicator === "2" || genderIndicator === "4") {
      return "1"; // 여
    }
    return ""; // 불명확한 경우
  };

  useEffect(() => {
    if (cdEmp === undefined || cdEmp === null || cdEmp === "") {
      setEmpBasicData(defaultEmpBasicData);
      return;
    }

    const handleGetEmpBasicData = async (cdEmp) => {
      try {
        const responseData = await apiRequest({
          method: "GET",
          url: `/api2/hr/getOneEmpBasicData?cdEmp=${cdEmp}`,
        });
        setEmpBasicData({
          ...defaultEmpBasicData,
          ...responseData,
        });
        console.log(responseData.path);
      } catch (error) {
        console.error("Failed to fetch emp data:", error);
      }
    };

    handleGetEmpBasicData(cdEmp);
  }, [cdEmp]);

  // 위에서 파일을 참조하기 위한 ref 생성
  const fileInputRef = useRef(null);

  const handleFileUploadClick = () => {
    fileInputRef.current.click();
  };
  //const [profileImage, setProfileImage] = useState(noImage);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    console.log("handleFileChange *****************");
    if (!file) {
      //file = null;
      return;
    }
    console.log("handleFileChange *****************");
    if (!cdEmp) {
      openAlertWithText("사원 선택 후 업로드가 가능합니다.");
      return;
    }

    // 이미지 파일 유효성 검사 및 용량 제한
    if (file.size > 5 * 1024 * 1024) {
      openAlertWithText("파일의 크기는 5MB를 초과할 수 없습니다.");
      return;
    }
    if (!file.type.startsWith("image/")) {
      openAlertWithText("이미지 파일만 업로드 가능합니다.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("cdEmp", cdEmp);

    try {
      const response = await apiRequest({
        method: "POST",
        url: "/api2/hr/uploadImg",
        data: formData,
      });
      console.log("File Upload Response:", response);
      //setProfileImage(response); // 이미지 URL로 변경
      setEmpBasicData({ path: response });
    } catch (error) {
      console.error("Failed to upload file:", error);
    }
  };

  const imgDelete = async () => {
    if (!empBasicData.path) {
      return;
    }

    const data = {
      cdEmp: cdEmp,
      path: empBasicData.path,
    };
    console.log(data);
    try {
      const response = await apiRequest({
        method: "POST",
        url: "/api2/hr/deleteImg",
        data: data,
      });
      setEmpBasicData({ path: null });
    } catch (error) {
      console.error("Failed to upload file:", error);
    }
  };
  return (
    <div className="hrInfoBaseWrap">
      {showAlert && (
        <SweetAlert
          text={alertText}
          type="error"
          onConfirm={() => setShowAlert(false)}
        />
      )}
      <ul className="pageTab">
        <li className="on">기초정보</li>
      </ul>
      <div className="hrInfoBase borderTopBold borderbottomBold">
        <div className="hrInfoBaseProfileImg">
          <img
            src={empBasicData.path || noImage}
            alt="프로필 이미지"
            width="180px"
            height="180px"
          />
          <div className="hrInfoBaseProfileImgBtnBox">
            <CustomButton
              text="등록"
              color="white"
              backgroundColor="#92c5ff"
              className="hrInfoBaseProfileImgBtn"
              onClick={handleFileUploadClick} // 이벤트 핸들러 추가
            />
            <input
              type="file"
              accept="image/*" // 이미지만 허용
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <CustomButton
              text="삭제"
              color="white"
              backgroundColor="#707070"
              className="hrInfoBaseProfileImgBtn"
              //onClick={fileDelete}
              onClick={imgDelete}
            />
          </div>
        </div>
        <table className="table">
          <tbody>
            <tr>
              <th>영문성명</th>
              <td>
                <CustomInput
                  value={empBasicData.nmEngEmp || ""}
                  width={322}
                  name={"nmEngEmp"}
                  onBlur={handleInputBlur}
                  onChange={handleInputChange}
                  // backgroundColor={"gray"}
                  // readOnly={true}
                />
              </td>
            </tr>
            <tr>
              <th>주민등록번호</th>
              <td>
                <CustomInput
                  type="resident"
                  width={322}
                  name={"noResident"}
                  value={empBasicData.noResident || ""}
                  readOnly={true}
                />
              </td>
            </tr>
            <tr>
              <th>생년월일</th>
              <td>
                {/* <CustomInput
                  className="hrInfoBaseInput"
                  width={322}
                  value={extractBirthDate(empBasicData.noResident)}
                /> */}
                <CustomCalender
                  className="hrInfoBaseInput"
                  value={empBasicData.dtBirth}
                  name="dtBirth"
                  readOnly={true}
                  onChange={(e) => handleDateChange(e, "dtBirth")}
                />
              </td>
            </tr>
            <tr>
              <th>부서</th>
              <td>
                {/* <CustomInput
                  width={322}
                  name={"noDepartment"}
                  value={empBasicData.noDepartment || ""}
                  onblur={handleInputBlur}
                  onChange={handleInputChange}
                /> */}
                <CustomSelect
                  options={[
                    { value: "000", label: "미선택" },
                    { value: "001", label: "인사부" },
                    { value: "002", label: "재무부" },
                    { value: "003", label: "영업부" },
                    { value: "004", label: "개발부" },
                    { value: "005", label: "마케팅부" },
                    { value: "006", label: "고객지원부" },
                    { value: "007", label: "생산부" },
                    { value: "008", label: "구매부" },
                  ]}
                  placeholder="선택"
                  disabled={true}
                  value={empBasicData.noDepartment || "000"}
                  onChange={(e) => handleSelectChange(e, "noDepartment")}
                />
              </td>
            </tr>
            <tr>
              <th>재직구분</th>
              <td>
                <CustomRadio
                  name="fgEmp"
                  classNameBox="hrInfoBaseBox"
                  classNameRadio="classNameRadio"
                  options={[
                    ["재직", "0"],
                    ["퇴사", "1"],
                  ]}
                  // dtResign 값이 있으면 "1" (퇴사), 없으면 "0" (재직)
                  value={empBasicData.dtResign ? "1" : "0"}
                />
              </td>
            </tr>
            <tr>
              <th>입사연월일</th>
              <td>
                <CustomCalender
                  className="hrInfoBaseInput"
                  value={empBasicData.dtHire}
                  name="dtHire"
                  disabled={true}
                  onChange={(e) => handleDateChange(e, "dtHire")}
                />
              </td>
            </tr>
          </tbody>
          <tbody>
            <tr>
              <th>한자성명</th>
              <td>
                <CustomInput
                  value={empBasicData.nmHanjaEmp || ""}
                  width={322}
                  name={"nmHanjaEmp"}
                  onBlur={handleInputBlur}
                  onChange={handleInputChange}
                />
              </td>
            </tr>
            <tr>
              <th>성별</th>
              <td>
                <CustomRadio
                  name="fgGender"
                  classNameBox="hrInfoBaseBox"
                  classNameRadio="classNameRadio"
                  options={[
                    ["남성", "0"],
                    ["여성", "1"],
                  ]}
                  value={determineGenderFromResident(empBasicData.noResident)}
                  readOnly={true}
                />
              </td>
            </tr>
            <tr>
              <th>결혼여부</th>
              <td>
                <CustomRadio
                  name="fgMarriage"
                  classNameBox="hrInfoBaseBox"
                  classNameRadio="classNameRadio"
                  options={[
                    ["미혼", "0"],
                    ["기혼", "1"],
                  ]}
                  value={empBasicData.fgMarriage}
                  onChange={handleInputBlur}
                />
              </td>
            </tr>
            <tr>
              <th>직급</th>
              <td>
                <CustomSelect
                  options={[
                    { value: "0", label: "미선택" },
                    { value: "1", label: "회장" },
                    { value: "2", label: "사장" },
                    { value: "3", label: "부사장" },
                    { value: "4", label: "전무" },
                    { value: "5", label: "상무" },
                    { value: "6", label: "이사" },
                    { value: "7", label: "부장" },
                    { value: "8", label: "수석" },
                    { value: "9", label: "차장" },
                    { value: "10", label: "책임" },
                    { value: "11", label: "과장" },
                    { value: "12", label: "선임" },
                    { value: "13", label: "대리" },
                    { value: "14", label: "주임" },
                    { value: "15", label: "사원" },
                    { value: "16", label: "직급없음" },
                  ]}
                  value={empBasicData.noPositionUnique || "0"}
                  placeholder="선택"
                  disabled={true}
                />
              </td>
            </tr>
            <tr>
              <th>근로계약서</th>
              <td>
                <CustomRadio
                  name="fgWorkcontract"
                  classNameBox="hrInfoBaseBox"
                  classNameRadio="classNameRadio"
                  options={[
                    ["작성", "1"],
                    ["미작성", "0"],
                  ]}
                  value={empBasicData.fgWorkcontract}
                  onChange={handleInputBlur}
                />
              </td>
            </tr>
            <tr>
              <th>퇴사년연월일</th>
              <td>
                <CustomCalender
                  className="hrInfoBaseInput"
                  value={empBasicData.dtResign}
                  name="dtResign"
                  disabled={true}
                  onChange={(e) => handleDateChange(e, "dtResign")}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HrBasic;
