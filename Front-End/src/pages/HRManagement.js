import React, { useState, useEffect, useCallback, useMemo } from "react";
import HrPageHeader from "../components/HRManagement/HrPageHeader";
import HrSearchBar from "../components/HRManagement/HrSearchBar";
import Input from "../components/Contents/Input";
import Table from "../components/TablesLib/Table";
import HrBasic from "../components/HRManagement/HrDetail/HrBasic";
import HrFamily from "../components/HRManagement/HrDetail/HrFamily";
import HrEdu from "../components/HRManagement/HrDetail/HrEdu";
import HrCareer from "../components/HRManagement/HrDetail/HrCareer";
import HrBody from "../components/HRManagement/HrDetail/HrBody";
import HrMilitary from "../components/HRManagement/HrDetail/HrMilitary";
import HrLicense from "../components/HRManagement/HrDetail/HrLicense";
import useApiRequest from "../components/Services/ApiRequest";
import "../styles/css/pages/HRManagement.css";

function HRManagement() {
  const apiRequest = useApiRequest();
  const [empList, setEmpList] = useState([]); //첫번째 테이블의 사원정보들 관리
  const [activeTab, setActiveTab] = useState("family"); // 가족,학력,경력,신체,병역,자격 탭 상태 관리

  const [checkedRows, setCheckedRows] = useState([]); // 각 행의 체크박스 상태를 저장하는 상태
  const [selectedEmpCode, setSelectedEmpCode] = useState(null); // 현재 체크된 cdEmp 저장하는 상태
  const [clickEmpCode, setclickEmpCode] = useState(); // 현재 클릭한 cdEmp 저장하는 상태
  const [showInsertRow, setShowInsertRow] = useState(false); // 테이블의 insertRow의 상태

  const handleGetEmpBasicData = async (cdEmp) => {
    try {
      const responseData = await apiRequest({
        method: "GET",
        url: `/api2/hr/getOneEmpBasicData?cdEmp=${cdEmp}`,
      });
      //setEmpList(responseData);
    } catch (error) {
      console.error("Failed to fetch emp data:", error);
    }
  };

  const handleSetEmpCode = (code) => {
    setclickEmpCode(code);
  };

  // 테이블의 각 행을 클릭했을 때 동작을 정의하는 함수
  const handleRowClick = useCallback((empCode) => {
    setSelectedEmpCode(empCode);
    console.log(selectedEmpCode);
  }, []);
  // 탭 클릭시 클릭한 탭으로 setActiveTab 변경
  const handleTabClick = useCallback((tabName) => {
    setActiveTab(tabName);
  }, []);
  //헤더 체크박스를 클릭할 때 호출되어, 모든 체크박스를 체크하거나 체크를 해제
  const handleHeaderCheckboxClick = useCallback(() => {
    if (checkedRows.length !== empList.length) {
      setCheckedRows(empList.map((emp) => emp.cdEmp));
    } else {
      setCheckedRows([]);
    }
  }, [checkedRows, empList]);
  // 각 행의 체크박스를 클릭할 때 해당 행의 체크박스 상태를 업데이트
  const handleRowCheckboxClick = useCallback(
    (empCode) => {
      if (checkedRows.includes(empCode)) {
        setCheckedRows((prevCheckedRows) =>
          prevCheckedRows.filter((code) => code !== empCode),
        );
      } else {
        setCheckedRows((prevCheckedRows) => [...prevCheckedRows, empCode]);
      }
    },
    [checkedRows],
  );

  // 첫번째 테이블에 보내야할 data 파라미터
  const data = useMemo(
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
  const columns = useMemo(
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
        width: "45%",
        id: "code",
        Cell: ({ cell: { value }, row: { original } }) => {
          const [inputValue, setInputValue] = React.useState(value || "");

          const handleInputChange = (e) => {
            setInputValue(e.target.value);
          };
          const handleInputClick = (e) => {
            console.log("code클릭이벤발생");
            //console.log(original.code);
            setclickEmpCode(original.code);
            handleGetEmpBasicData(original.code);
          };
          return (
            <Input
              value={inputValue || ""}
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
          const [inputValue, setInputValue] = React.useState(value || "");

          const handleInputChange = (e) => {
            setInputValue(e.target.value);
          };
          const handleInputClick = (e) => {
            console.log("hr : 클릭이벤");
            console.log(original.code);
            setclickEmpCode(original.code);
            handleGetEmpBasicData(original.code);
          };
          const defaultTdOnBlur = (e) => {
            console.log("hr: td 블러이벤");
          };
          const handleEnterPress = (e) => {
            console.log("Enter 키가 눌렸습니다.");
            setclickEmpCode(original.code);
            console.log(clickEmpCode);
            // 여기에서 DB 접근 등의 원하는 작업 수행
            handleGetEmpBasicData(original.code);
          };

          const handleTabPress = (e) => {
            console.log("Tab 키가 눌렸습니다.");
            // 여기에서 DB 접근 등의 원하는 작업 수행
            handleGetEmpBasicData(original.code);
          };

          return (
            <Input
              value={inputValue || ""}
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
  const tabs = [
    { id: "family", label: "가족", component: HrFamily },
    { id: "edu", label: "학력", component: HrEdu },
    { id: "career", label: "경력", component: HrCareer },
    { id: "body", label: "신체", component: HrBody },
    { id: "military", label: "병역", component: HrMilitary },
    { id: "license", label: "자격", component: HrLicense },
  ];
  const renderHrDetail = () => {
    const tab = tabs.find((t) => t.id === activeTab);
    if (!tab) return null;
    const Component = tab.component;
    return <Component cdEmp={clickEmpCode} />;
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
                //insertRow={false}
                //showInsertRow={showInsertRow}
                //setShowInsertRow={setShowInsertRow}
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
            <HrBasic cdEmp={clickEmpCode} />
            <div className="hrInfoDetailWrap">
              <ul className="pageTab">
                {tabs.map((tab) => (
                  <li
                    key={tab.id}
                    className={activeTab === tab.id ? "on" : ""}
                    onClick={() => handleTabClick(tab.id)}
                  >
                    {tab.label}
                  </li>
                ))}
              </ul>
              <div className="hrInfoDetail">{renderHrDetail()}</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default HRManagement;
