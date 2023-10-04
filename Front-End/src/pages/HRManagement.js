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
import CustomModal from "../components/Contents/CustomModal";
import CustomButton from "../components/Contents/CustomButton";
import "../styles/css/pages/HRManagement.css";
import Alert from "../components/Contents/SweetAlert";
import PageHeaderName from "../components/PageHeader/PageHeaderName";
//import { useYear } from "../containers/YearContext";

function HRManagement() {
  const apiRequest = useApiRequest();
  //const { selectedYear } = useYear();
  //console.log(selectedYear);

  const [empList, setEmpList] = useState([]); //첫번째 테이블의 사원정보들 관리

  const [activeTab, setActiveTab] = useState("family"); // 가족,학력,경력,신체,병역,자격 탭 상태 관리

  const [modalEmpList, setModalEmpList] = useState([]); // 모달창 사원 정보
  const [modalIsOpen, setModalIsOpen] = useState(false); // 모달창 관리

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  // 모달창 닫으면 바로 사원 인서트
  const closeModalAndEmpInsert = async (e, cdEmp) => {
    closeModal();
    if (!cdEmp && !clickModalEmpCode) {
      console.log("cdEmp 도없거 clickModalEmpCode 도 없어 ");
      return;
    }

    console.log("모달이벤트 ~~~~~~~~~~~~~~~~~~~~~");
    console.log(cdEmp);
    let url;
    if (!cdEmp) {
      url = `/api2/hr/insertHrEmpData?cdEmp=${clickModalEmpCode}`;
    } else {
      url = `/api2/hr/insertHrEmpData?cdEmp=${cdEmp}`;
    }
    try {
      const responseData = await apiRequest({
        method: "GET",
        url: url,
      });
      //서버에서 넘어온 데이터
      // HRManagement.js:68 {cdEmp: 'CD046', nmEmp: '장영호'}
      //setEmpList(responseData);
      setShowInsertRow(false);
      console.log("서버에서 넘어온 데이터 ");
      console.log(responseData);
      setEmpList((prevEmpList) => [...prevEmpList, responseData]);
      setClickEmpCode(clickModalEmpCode);
      setClickModalEmpCode();
    } catch (error) {
      console.error("Failed to fetch emp data:", error);
    }
  };

  const [showInsertRow, setShowInsertRow] = useState(false); // 행추가 관리

  const [checkedRows, setCheckedRows] = useState([]); // 각 행의 체크박스 상태를 저장하는 상태
  const [selectedEmpCode, setSelectedEmpCode] = useState(null); // 현재 체크된 cdEmp 저장하는 상태
  const [clickEmpCode, setClickEmpCode] = useState(null); // 현재 클릭한 cdEmp 저장하는 상태
  const [clickModalEmpCode, setClickModalEmpCode] = useState(null); // 현재 클릭한 cdEmp 저장하는 상태

  const [conditions, setConditions] = useState({
    category: 0,
    sort: 3,
  }); // 검색 조건을 저장하는 상태

  const [empStats, setEmpStats] = useState({
    total: 0,
    working: 0,
    resigned: 0,
  }); //총인원 , 재직중 , 퇴사

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

  // 사원정보 API 요청 후 사원정보 setEmpList
  const handleGetEmpList = async () => {
    try {
      const responseData = await apiRequest({
        method: "GET",
        url: "/api2/hr/getAllModalEmpList",
      });
      setModalEmpList(responseData);
    } catch (error) {
      console.error("Failed to fetch emp data:", error);
    }
  };

  // 사원 삭제
  const deleteEmp = (empCode) => {
    setEmpList((prevEmpList) =>
      prevEmpList.filter((emp) => emp.cdEmp !== empCode),
    );
    // 체크된 상태 초기화
    setCheckedRows([]);
  };

  // 첫번째 테이블에 보내야할 data 파라미터
  const data = useMemo(
    () =>
      empList.map((emp) => ({
        checkbox: false,
        cdEmp: emp.cdEmp,
        nmEmp: emp.nmEmp,
        onRowClick: () => handleRowClick(emp.cdEmp), // 여기 추가
      })),
    [empList],
  );
  const dataModalEmpList = useMemo(
    () =>
      modalEmpList.map((emp) => ({
        cdEmp: emp.cdEmp,
        nmEmp: emp.nmEmp,
      })),
    [modalEmpList],
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
          const isChecked = checkedRows.includes(original?.cdEmp);
          return (
            <input
              type="checkbox"
              // 행의 체크박스가 클릭될 때의 동작을 handleRowCheckboxClick 함수에 위임, 해당 행의 코드를 인자로 전달
              checked={isChecked}
              onChange={() => handleRowCheckboxClick(original?.cdEmp)}
            />
          );
        },
      },
      {
        Header: "사원코드",
        accessor: "cdEmp",
        width: "45%",
        id: "cdEmp",
        Cell: ({ cell: { value }, row: { original } }) => {
          const handleInputClick = (e) => {
            if (original) {
              console.log("code클릭이벤발생");
              setClickEmpCode(original.cdEmp); // 이 부분
            } else {
              console.log("Insert row input clicked!");
              openModal(e);
              handleGetEmpList();
            }
          };
          return (
            <Input
              value={original?.cdEmp || ""}
              onClick={handleInputClick}
              isDoubleClick={false}
              className={"doubleLine"}
            />
          );
        },
      },
      {
        Header: "사원명",
        accessor: "nmEmp",
        id: "nmEmp",
        Cell: ({ cell: { value }, row: { original } }) => {
          const handleInputClick = (e) => {
            if (original) {
              console.log("code클릭이벤발생");
              setClickEmpCode(original.cdEmp); // 이 부분
            } else {
              console.log("Insert row input clicked!");
              openModal(e);
              handleGetEmpList();
            }
            //handleGetEmpBasicData(original.code);
          };

          return (
            <Input
              value={original?.nmEmp || ""}
              onClick={handleInputClick}
              isDoubleClick={false}
              className={"doubleLine"}
            />
          );
        },
      },
    ],
    [checkedRows, empList],
  );

  const columnsModal = useMemo(
    () => [
      {
        Header: "사원코드",
        accessor: "cdEmp",
        width: "45%",
        id: "cdEmp",
        Cell: ({ cell: { value }, row: { original } }) => {
          const handleInputClick = (e) => {
            console.log("code클릭이벤발생");
            setClickModalEmpCode(original.cdEmp);
            console.log(original.cdEmp);
          };
          const handleDoubleClick = (e) => {
            console.log("모달안 테이블 안에 더블 클릭 발생");
            console.log(original.cdEmp);
            setClickModalEmpCode(original.cdEmp);
            closeModalAndEmpInsert(e, original.cdEmp);
          };
          return (
            <Input
              value={original?.cdEmp || ""}
              onClick={handleInputClick}
              className={"doubleLine"}
              onDoubleClick={handleDoubleClick}
            />
          );
        },
      },
      {
        Header: "사원명",
        accessor: "nmEmp",
        id: "nmEmp",
        Cell: ({ cell: { value }, row: { original } }) => {
          const handleInputClick = (e) => {
            console.log("code클릭이벤발생");
            setClickModalEmpCode(original.cdEmp);
            console.log(original.cdEmp);
          };
          const handleDoubleClick = (e) => {
            console.log("모달안 테이블 안에 더블 클릭 발생");
            console.log(original.cdEmp);
            setClickModalEmpCode(original.cdEmp);
            closeModalAndEmpInsert(e, original.cdEmp);
          };
          return (
            <Input
              value={original?.nmEmp || ""}
              onClick={handleInputClick}
              className={"doubleLine"}
              onDoubleClick={handleDoubleClick}
            />
          );
        },
      },
    ],
    [modalEmpList],
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
        setClickEmpCode={setClickEmpCode}
        deleteEmp={deleteEmp}
        setEmpStats={setEmpStats}
      />
      <HrSearchBar
        conditions={conditions}
        setConditions={setConditions}
        setEmpList={setEmpList}
        setClickEmpCode={setClickEmpCode}
        setEmpStats={setEmpStats}
      />
      <section className="section hr-section">
        <div className="hrGrid">
          {/* 리스트 영역 */}
          <div className="listArea">
            <div className="namePickerBox">
              <Table
                columns={columns}
                data={data}
                insertRow={true}
                showInsertRow={showInsertRow}
                setShowInsertRow={setShowInsertRow}
              />
            </div>
            <div className="totalBox">
              <table className="hrTotalTable borderTopBold">
                <tbody>
                  <tr>
                    <th rowSpan="2">총인원</th>
                    <td rowSpan="2">{empStats.total}</td>
                    <th>재직</th>
                    <td>{empStats.working}</td>
                  </tr>
                  <tr>
                    <th>퇴사</th>
                    <td>{empStats.resigned}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          {/* 컨텐츠 영역 */}
          <div className="contentsArea">
            <HrBasic cdEmp={clickEmpCode} />
            <div className="hrInfoDetailWrap borderbuttonBoldBlack">
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
      <CustomModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        overlayStyle={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        contentStyle={{
          width: "800px",
          height: "820px",
          backgroundColor: "white",
          border: "1px solid gray",
        }}
      >
        <PageHeaderName text="추가목록" />
        <div className="test2">
          <Table columns={columnsModal} data={dataModalEmpList} />
        </div>
        <div className="test">
          <CustomButton
            backgroundColor={"var(--color-primary-blue)"}
            color={"var(--color-primary-white)"}
            onClick={closeModalAndEmpInsert}
            text={"추가하기"}
          />
          <CustomButton
            backgroundColor={"var(--color-primary-gray)"}
            color={"var(--color-primary-white)"}
            onClick={closeModal}
            text={"취소"}
          />
        </div>
      </CustomModal>
    </>
  );
}

export default HRManagement;
