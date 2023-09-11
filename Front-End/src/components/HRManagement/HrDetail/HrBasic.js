import React, { useRef, useState, useEffect } from "react";
import CustomButton from "../../Contents/CustomButton";
import CustomInput from "../../Contents/CustomInput";
import CustomCalender from "../../Contents/CustomCalendar";
import CustomRadio from "../../Contents/CustomRadio";
import useApiRequest from "../../Services/ApiRequest";
const defaultEmpBasicData = {
  cdEmp: "", // 사원코드
  nmEmp: "", // 사원명
  nmEngEmp: "", // 영문명
  nmHanjaEmp: "", // 한자명
  fgForeign: "", // 내외국인 구분
  noResident: "", //  주민번호
  fgEmp: "", // 재직구분
  dtHire: "", // 입사일
  fgGender: "", // 성별
  noPost: "", // 우편번호
  nmAddress: "", // 주소
  dcAddress: "", // 상세 주소
  noPhone: "", // 전화번호
  noMobilePhone: "", // 핸드폰
  nmEmail: "", // 이메일
  cdBank: "", // 은팽코드
  idJoin: "", // 가입ID
  dtResign: "", // 퇴사일
  noAccount: "", // 계좌번호
  nmAccountHolder: "", // 예금주명
  noPositionUnique: "", // 직급고유번호
  noDepartment: "", // 부서번호
  fgWorkcontract: "", // 근로계약서작성여부
  fgMarriage: "", // 결혼여부
};
const HrBasic = ({ cdEmp }) => {
  const apiRequest = useApiRequest();
  const [empBasicData, setEmpBasicData] = useState({ ...defaultEmpBasicData });

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    console.log(name);
    console.log(value);
    try {
      const responseData = await apiRequest({
        method: "GET",
        url: `/api2/hr/updateBasicEmpdata?cdEmp=${cdEmp}&${name}=${value}`,
      });
    } catch (error) {
      console.error("Failed to fetch emp data:", error);
    }
    setEmpBasicData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleUpdateEmpBasicData = async (cdEmp, columnName, inputValue) => {
    try {
      const responseData = await apiRequest({
        method: "GET",
        url: `/api2/hr/updateBasicEmpdata?cdEmp=${cdEmp}&${columnName}=${inputValue}`,
      });
      setEmpBasicData({
        ...defaultEmpBasicData,
        ...responseData,
      });
    } catch (error) {
      console.error("Failed to fetch emp data:", error);
    }
  };

  const extractBirthDate = (noResident) => {
    if (!noResident) return "";

    const year = noResident.slice(0, 2);
    const month = noResident.slice(2, 4);
    const day = noResident.slice(4, 6);
    const century = noResident[7] < "3" ? "19" : "20"; // 1,2는 1900년대, 3,4는 2000년대를 의미

    return `${century}${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (cdEmp === undefined || cdEmp === null) {
      return;
    }
    setEmpBasicData(defaultEmpBasicData);
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
                  value={empBasicData.nmEngEmp}
                  onChange={handleInputChange}
                  width={322}
                  className="hrInfoBaseInput"
                />
              </td>
            </tr>
            <tr>
              <th>주민등록번호</th>
              <td>
                <CustomInput
                  value={empBasicData.noResident}
                  onChange={handleInputChange}
                  width={322}
                  className="hrInfoBaseInput"
                />
              </td>
            </tr>
            <tr>
              <th>생년월일</th>
              <td>
                <CustomCalender
                  className="hrInfoBaseInput"
                  value={extractBirthDate(empBasicData.noResident)}
                />
              </td>
            </tr>
            <tr>
              <th>부서</th>
              <td>
                <CustomInput
                  width={322}
                  onChange={handleInputChange}
                  className="hrInfoBaseInput"
                  value={empBasicData.noDepartment}
                />
              </td>
            </tr>
            <tr>
              <th>직무</th>
              <td>
                <CustomInput
                  width={322}
                  className="hrInfoBaseInput"
                  onChange={handleInputChange}
                />
              </td>
            </tr>
            <tr>
              <th>입사연월일</th>
              <td>
                <CustomCalender
                  className="hrInfoBaseInput"
                  value={empBasicData.dtHire}
                />
              </td>
            </tr>
          </tbody>
          <tbody>
            <tr>
              <th>한자성명</th>
              <td>
                <CustomInput
                  value={empBasicData.nmHanjaEmp}
                  width={322}
                  className="hrInfoBaseInput"
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
                    ["남", "0"],
                    ["여", "1"],
                  ]}
                  value={empBasicData.fgGender}
                  onChange={handleInputChange}
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
                  onChange={handleInputChange} // 추가된 부분
                />
              </td>
            </tr>
            <tr>
              <th>직급</th>
              <td>
                <CustomInput
                  width={322}
                  className="hrInfoBaseInput"
                  onChange={handleInputChange}
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
                  onChange={handleInputChange} // 추가된 부분
                />
              </td>
            </tr>
            <tr>
              <th>퇴사년연월일</th>
              <td>
                <CustomCalender className="hrInfoBaseInput" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HrBasic;
