import React, { useState, useEffect } from "react";
import HrPageHeader from "../components/HRManagement/HrPageHeader";
import HrSearchBar from "../components/HRManagement/HrSearchBar";
import CustomInput from "../components/Contents/CustomInput";
import Input from "../components/Contents/Input";
import CustomButton from "../components/Contents/CustomButton";
import CustomCalender from "../components/Contents/CustomCalendar";
import CustomRadio from "../components/Contents/CustomRadio";
import Table from "../components/TablesLib/Table";
import HrFamily from "../components/HRManagement/HrDetail/HrFamily";
import HrEdu from "../components/HRManagement/HrDetail/HrEdu";
import HrCareer from "../components/HRManagement/HrDetail/HrCareer";
import HrBody from "../components/HRManagement/HrDetail/HrBody";
import HrMilitary from "../components/HRManagement/HrDetail/HrMilitary";
import HrLicense from "../components/HRManagement/HrDetail/HrLicense";
import { handlePageHeaderSearchSubmit } from "../components/Services/PageHeaderSearchService";

import "../styles/css/pages/HRManagement.css";

function HRManagement() {
  const [activeTab, setActiveTab] = useState("family");
  const [empList, setEmpList] = useState([]);

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const handleFetchEmpData = async () => {
    try {
      const url = "/api2/hr/getAllEmpList";
      const data = await handlePageHeaderSearchSubmit(url);
      setEmpList(data);
    } catch (error) {
      console.error("Failed to fetch emp data:", error);
    }
  };
  const data = React.useMemo(
    () =>
      empList.map((emp) => ({
        checkbox: false,
        code: emp.cdEmp,
        employee: emp.nmEmp,
      })),
    [empList]
  );
  const columns = React.useMemo(
    () => [
      {
        Header: "✓",
        accessor: "checkbox",
        width: "20%",
        id: "checkbox",
        //Cell: ({ cell: { value } }) => <input type="checkbox" />,
        Cell: ({ cell: { value } }) => {
          const [inputValue, setInputValue] = React.useState(value);

          const handleInputChange = (e) => {
            const newValue = !inputValue;
            console.log("현재 체크박스 value : ", inputValue);
            setInputValue(newValue);
            console.log("변경 체크박스 value : ", newValue);
          };

          return (
            <input
              type="checkbox"
              checked={inputValue} // checked 속성 사용
              value={inputValue}
              onChange={handleInputChange}
            />
          );
        },
      },
      {
        Header: "Code",
        accessor: "code",
        id: "code",
        Cell: ({ cell: { value } }) => {
          const [inputValue, setInputValue] = React.useState(value);

          const handleInputChange = (e) => {
            setInputValue(e.target.value);
          };
          const handleInputClick = (e) => {
            console.log(e.target);
          };

          return (
            <Input
              value={inputValue}
              //onClick={handleInputClick}
              onChange={handleInputChange}
            />
          );
        },
      },
      {
        Header: "사원",
        accessor: "employee",
        id: "employee",
        Cell: ({ cell: { value } }) => {
          const [inputValue, setInputValue] = React.useState(value);

          const handleInputChange = (e) => {
            setInputValue(e.target.value);
          };
          const defaultTdOnBlur = (e) => {
            //alert("ddd");
          };

          return (
            <Input
              value={inputValue}
              onChange={handleInputChange}
              //onBlur={defaultTdOnBlur}
            />
          );
        },
      },
    ],
    []
  );

  const renderContent = () => {
    switch (activeTab) {
      case "family":
        return <HrFamily />;
      case "edu":
        return <HrEdu />;
      case "career":
        return <HrCareer />;
      case "body":
        return <HrBody />;
      case "military":
        return <HrMilitary />;
      case "license":
        return <HrLicense />;
      default:
        return null;
    }
  };

  return (
    <>
      <HrPageHeader onFetchEmpData={handleFetchEmpData} />
      <HrSearchBar />
      <section className="section hr-section">
        <div className="hrGrid">
          {/* 리스트 영역 */}
          <div className="listArea">
            <div className="namePickerBox">
              <Table
                columns={columns}
                data={data}
                showInsertRow={true}
                checkboxWidth={"20%"}
              />
              {/* <Table
                  headers={["✓", "Code", "사원"]}
                  colWidths={["10%", "40%", "50%"]}
                  cells={[
                    <input
                      type="checkbox"
                      onMouseEnter={() => alert("안녕")}
                    />,
                    null,
                    null,
                  ]}
                  data={this.state.empList.map((emp) => [
                    false,
                    emp.cdEmp,
                    emp.nmEmp,
                  ])}
                  eventHandlers={{
                    onClick: () => {
                      console.log("테이블 항목을 클릭하였습니다.");
                    },
                  }}
                /> */}
            </div>
            <div className="totalBox">
              <table className="hrTotalTable borderTopBold">
                <tbody>
                  <tr>
                    <th rowSpan="2">총인원</th>
                    <td rowSpan="2">7</td>
                    <th>재직</th>
                    <td>0</td>
                  </tr>
                  <tr>
                    <th>퇴사</th>
                    <td>0</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          {/* 컨텐츠 영역 */}
          <div className="contentsArea">
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
                <div className="hrInfoBaseProfileTitle">
                  <p className="hrInfoBaseProfileOnePtag">영문성명</p>
                  <p className="hrInfoBaseProfileOnePtag">주민등록번호</p>
                  <p className="hrInfoBaseProfileOnePtag">생년월일</p>
                  <p className="hrInfoBaseProfileOnePtag">부서</p>
                  <p className="hrInfoBaseProfileOnePtag">직무</p>
                  <p className="hrInfoBaseProfileOnePtag">입사년월일</p>
                </div>
                <div className="hrInfoBaseProfiletwo">
                  <CustomInput className="hrInfoBaseInput" width="300" />
                  <CustomInput className="hrInfoBaseInput" width="300" />
                  <CustomCalender className="hrInfoBaseInput" width="300" />
                  <CustomInput className="hrInfoBaseInput" width="300" />
                  <CustomInput className="hrInfoBaseInput" width="300" />
                  <CustomCalender className="hrInfoBaseInput" width="300" />
                </div>
                <div className="hrInfoBaseProfileTitle">
                  <p className="hrInfoBaseProfileOnePtag">한자성명</p>
                  <p className="hrInfoBaseProfileOnePtag">성별</p>
                  <p className="hrInfoBaseProfileOnePtag">결혼여부</p>
                  <p className="hrInfoBaseProfileOnePtag">직급</p>
                  <p className="hrInfoBaseProfileOnePtag">근로계약서</p>
                  <p className="hrInfoBaseProfileOnePtag">퇴사년연월일</p>
                </div>
                <div className="hrInfoBaseProfiletwo">
                  <CustomInput className="hrInfoBaseInput" width="300" />
                  <CustomRadio
                    classNameBox="hrInfoBaseBox"
                    classNameRadio="classNameRadio"
                    name="gender"
                    options={[
                      ["남", "male"],
                      ["여", "female"],
                    ]}
                  />
                  <CustomRadio
                    classNameBox="hrInfoBaseBox"
                    classNameRadio="classNameRadio"
                    name="married"
                    options={[
                      ["미혼", "0"],
                      ["기혼", "1"],
                    ]}
                  />
                  <CustomInput className="hrInfoBaseInput" width="300" />
                  <CustomRadio
                    classNameBox="hrInfoBaseBox"
                    classNameRadio="classNameRadio"
                    name="married"
                    options={[
                      ["작성", "0"],
                      ["미작성", "1"],
                    ]}
                  />
                  <CustomCalender className="hrInfoBaseInput" width="300" />
                </div>
              </div>
            </div>
            <div className="hrInfoDetailWrap">
              <ul className="pageTab">
                <li
                  className={activeTab === "family" ? "on" : ""}
                  onClick={() => handleTabClick("family")}
                >
                  가족
                </li>
                <li
                  className={activeTab === "edu" ? "on" : ""}
                  onClick={() => handleTabClick("edu")}
                >
                  학력
                </li>
                <li
                  className={activeTab === "career" ? "on" : ""}
                  onClick={() => handleTabClick("career")}
                >
                  경력
                </li>
                <li
                  className={activeTab === "body" ? "on" : ""}
                  onClick={() => handleTabClick("body")}
                >
                  신체
                </li>
                <li
                  className={activeTab === "military" ? "on" : ""}
                  onClick={() => handleTabClick("military")}
                >
                  병역
                </li>
                <li
                  className={activeTab === "license" ? "on" : ""}
                  onClick={() => handleTabClick("license")}
                >
                  자격
                </li>
              </ul>

              <div className="hrInfoDetail">{renderContent()}</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default HRManagement;
