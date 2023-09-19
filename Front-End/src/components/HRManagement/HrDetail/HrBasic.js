import React, { useRef, useState, useEffect } from "react";
import CustomButton from "../../Contents/CustomButton";
import CustomInput from "../../Contents/CustomInput";
import Input from "../../Contents/Input";
import CustomCalender from "../../Contents/CustomCalendar";
import CustomSelect from "../../Contents/CustomSelect";

import CustomRadio from "../../Contents/CustomRadio";
import useApiRequest from "../../Services/ApiRequest";
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
};
const HrBasic = ({ cdEmp }) => {
  const apiRequest = useApiRequest();
  const [empBasicData, setEmpBasicData] = useState({ ...defaultEmpBasicData });
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
    if (cdEmp === undefined) {
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
      } catch (error) {
        console.error("Failed to fetch emp data:", error);
      }
    };

    handleGetEmpBasicData(cdEmp);
  }, [cdEmp]);

  return (
    <div className="hrInfoBaseWrap">
      <ul className="pageTab">
        <li className="on">기초정보</li>
      </ul>
      <div className="hrInfoBase borderTopBold borderbottomBold">
        <div className="hrInfoBaseProfileImg">
          <img
            src="https://picsum.photos/180/180"
            alt="이미지 샘플"
            width="180px"
            height="180px"
          />
          <div className="hrInfoBaseProfileImgBtnBox">
            <CustomButton
              text="등록"
              color="black"
              backgroundColor="white"
              className="hrInfoBaseProfileImgBtn"
            />
            <CustomButton
              text="삭제"
              color="black"
              backgroundColor="white"
              className="hrInfoBaseProfileImgBtn"
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
                    { value: "000", label: "부서미선택" },
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
                  readOnly={true}
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
                  readOnly={true}
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
                <CustomInput
                  width={322}
                  name={"noPositionUnique"}
                  value={empBasicData.noPositionUnique || ""}
                  onBlur={handleInputChange}
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
                  readOnly={true}
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
