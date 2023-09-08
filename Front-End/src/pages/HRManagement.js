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
import ApiRequest from "../components/Services/ApiRequest";
import "../styles/css/pages/HRManagement.css";

function HRManagement() {
  const [empList, setEmpList] = useState([]); //첫번째 테이블의 사원정보들 관리
  const [activeTab, setActiveTab] = useState("family"); // 가족,학력,경력,신체,병역,자격 탭 상태 관리
  const [checkedRows, setCheckedRows] = useState([]); // 각 행의 체크박스 상태를 저장하는 상태
  const [selectedEmpCode, setSelectedEmpCode] = useState(null); // 현재 체크된 EmpCode를 저장하는 상태
  const [clickEmpCode, setclickEmpCode] = useState(); // 현재 클릭한 EmpCode를 저장하는 상태

  const handleSetEmpCode = (code) => {
    setclickEmpCode(code);
  };

  // 테이블의 각 행을 클릭했을 때 동작을 정의하는 함수
  const handleRowClick = (empCode) => {
    setSelectedEmpCode(empCode);
    console.log(selectedEmpCode);
  };
  // 탭 클릭시 클릭한 탭으로 setActiveTab 변경
  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };
  //헤더 체크박스를 클릭할 때 호출되어, 모든 체크박스를 체크하거나 체크를 해제
  const handleHeaderCheckboxClick = () => {
    if (checkedRows.length !== empList.length) {
      setCheckedRows(empList.map((emp) => emp.cdEmp));
    } else {
      setCheckedRows([]);
    }
  };
  // 각 행의 체크박스를 클릭할 때 해당 행의 체크박스 상태를 업데이트
  const handleRowCheckboxClick = (empCode) => {
    if (checkedRows.includes(empCode)) {
      setCheckedRows((prevCheckedRows) =>
        prevCheckedRows.filter((code) => code !== empCode),
      );
    } else {
      setCheckedRows((prevCheckedRows) => [...prevCheckedRows, empCode]);
    }
  };

  // 첫번째 테이블에 보내야할 data 파라미터
  const data = React.useMemo(
    () =>
      empList.map((emp) => ({
        checkbox: false,
        code: emp.cdEmp,
        employee: emp.nmEmp,
        onRowClick: () => handleRowClick(emp.cdEmp), // 여기 추가
      })),
    [empList],
  );
  // 첫번째 테이블에 보내야할 colums 파라미터
  const columns = React.useMemo(
    () => [
      {
        Header: (
          // 이 체크박스는 체크된 행의 수가 전체 empList와 동일한 경우에만 체크되도록 설정 모든 행이 체크되어 있으면 이 체크박스도 체크
          <input
            type="checkbox"
            checked={checkedRows.length === empList.length}
            onChange={handleHeaderCheckboxClick}
          />
        ),
        accessor: "checkbox",
        width: "10%",
        id: "checkbox",
        Cell: ({ cell: { value }, row: { original } }) => {
          // 현재 행의 체크박스 상태를 결정 checkedRows 배열에 현재 행의 코드가 포함되어 있으면 체크박스는 체크된 상태로 표시
          const isChecked = checkedRows.includes(original.code);
          return (
            <input
              type="checkbox"
              // 행의 체크박스가 클릭될 때의 동작을 handleRowCheckboxClick 함수에 위임, 해당 행의 코드를 인자로 전달
              checked={isChecked}
              onChange={() => handleRowCheckboxClick(original.code)}
            />
          );
        },
      },
      {
        Header: "Code",
        accessor: "code",
        width: "35%",
        id: "code",
        Cell: ({ cell: { value }, row: { original } }) => {
          const [inputValue, setInputValue] = React.useState(value);
          const handleInputChange = (e) => {
            setInputValue(e.target.value);
          };
          const handleInputClick = (e) => {
            console.log("code클릭이벤발생");
            //console.log(original.code);
            setclickEmpCode(original.code);
            console.log(clickEmpCode);
          };
          return (
            <Input
              value={inputValue}
              onClick={handleInputClick}
              onChange={handleInputChange}
              isDoubleClick={false}
            />
          );
        },
      },
      {
        Header: "사원",
        accessor: "employee",
        id: "employee",
        Cell: ({ cell: { value }, row: { original } }) => {
          const [inputValue, setInputValue] = React.useState(value);

          const handleInputChange = (e) => {
            setInputValue(e.target.value);
          };
          const handleInputClick = (e) => {
            console.log("hr : 클릭이벤");
            console.log(original.code);
            setclickEmpCode(original.code);
          };
          const defaultTdOnBlur = (e) => {
            console.log("hr: td 블러이벤");
          };
          const handleEnterPress = (e) => {
            console.log("Enter 키가 눌렸습니다.");
            setclickEmpCode(original.code);
            console.log(clickEmpCode);
            // 여기에서 DB 접근 등의 원하는 작업 수행
          };

          const handleTabPress = (e) => {
            console.log("Tab 키가 눌렸습니다.");
            // 여기에서 DB 접근 등의 원하는 작업 수행
          };

          return (
            <Input
              value={inputValue}
              onClick={handleInputClick}
              onChange={handleInputChange}
              onBlur={defaultTdOnBlur}
              onEnterPress={handleEnterPress}
              onTabPress={handleTabPress}
              isDoubleClick={true}
              className={"doubleLine"}
            />
          );
        },
      },
    ],
    [checkedRows, empList],
  );
  const renderContent = () => {
    switch (activeTab) {
      case "family":
        return <HrFamily empCode={clickEmpCode} />;
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
      <HrPageHeader
        checkedRows={checkedRows}
        setCheckedRows={setCheckedRows}
        setEmpList={setEmpList}
      />
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
                checkboxWidth={"10%"}
              />
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
