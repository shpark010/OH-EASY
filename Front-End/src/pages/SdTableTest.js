import React, { useState } from "react";
import Setting from "../images/pages/common/setting.png";
import Calc from "../images/pages/common/calc.png";
import Print from "../images/pages/common/print.png";
import Delete from "../images/pages/common/delete.png";

import "../styles/css/pages/SalaryData.css";
import PageHeaderName from "../components/PageHeader/PageHeaderName";
import PageHeaderTextButton from "../components/PageHeader/PageHeaderTextButton";
import PageHeaderIconButton from "../components/PageHeader/PageHeaderIconButton";
import SearchBarBox from "../components/SearchBar/SearchBarBox";
import CustomCalendar from "../components/Contents/CustomCalendar";
import CustomPriceInput from "../components/Contents/CustomPriceInput";
import Table from "../components/TablesLib/Table";
import Input from "../components/Contents/Input";
import CustomModal from "../components/Contents/CustomModal";
import useApiRequest from "../components/Services/ApiRequest";

const TableTest = (props) => {
  const [editing, setEditing] = useState(false);
  const [pay, setPay] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [empList, setEmpList] = useState([]);
  const [belongingDate, setBelongingDate] = useState("");
  const handleBelongingDateChange = (newDate) => {
    setBelongingDate(newDate);
    console.log("귀속년월 : " + belongingDate);
  };
  // const [selectedDate, setSelectedDate] = useState(null); // 선택한 날짜를 상위 컴포넌트의 state로 관리
  // const handleDateChange = (newDate) => {
  //   setSelectedDate(newDate); // 선택한 날짜를 state에 저장
  // };
  const [payDay, setPayDay] = useState();
  const handlePayDateChange = (newDate) => {
    setPayDay(newDate);
    console.log("지급일 : " + payDay);
  };
  const [searchOrder, setSearchOrder] = useState("0");
  // 선택된 값이 변경될 때 호출될 콜백 함수
  const handleSearchTypeChange = (newValue) => {
    setSearchOrder(newValue);
    console.log("정렬기준 : " + searchOrder);
  };
  const [nationalPension, setNationalPension] = useState(); //국민연금
  const [healthInsurance, setHealthInsurance] = useState(); //건강보험
  const [employmentInsurance, setEmploymentInsurance] = useState(); //고용보험
  const [longtermNursingInsurance, setLongtermNursingInsurance] = useState(); //장기요양보험
  const [incomeTax, setIncomeTax] = useState(); //소득세
  const [localIncomeTax, setLocalIncomeTax] = useState(); //지방소득세

  //api 요청 함수
  const apiRequest = useApiRequest();

  const handlePriceChange = (value) => {
    setPay(value);
  };

  const handleDoubleClick = () => {
    setEditing(true);
    console.log("더블클릭이벤트 발생");
  };

  const handleInputBlur = () => {
    setEditing(false);
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  //조회 버튼 클릭시 사원리스트 불러오기(select)
  const handleFetchEmpData = async () => {
    try {
      const responseData = await apiRequest({
        method: "POST",
        url: "/api2/sd/getEmpList",
        data: {
          belongingDate: belongingDate,
          payDay: payDay,
          searchOrder: searchOrder,
        },
      });
      setEmpList(responseData);
    } catch (error) {
      console.error("Failed to fetch emp data:", error);
    }
  };

  //기본급 입력 후 이벤트(insert)
  const handleInsertData = async () => {
    try {
      const responseData = await apiRequest({
        method: "POST",
        url: "/api2/sd/setEmpPay",
      });
      setEmpList(responseData);
    } catch (error) {
      console.error("Failed to fetch emp data:", error);
    }
  };

  const EmpData = React.useMemo(
    () =>
      empList.map((emp) => ({
        checkbox: false,
        code: emp.cdEmp,
        employee: emp.nmEmp,
        position: emp.nmPosition,
      })),
    [empList],
  );

  const columnsItem1 = React.useMemo(
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
          return <Input value={inputValue} onChange={handleInputChange} />;
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

          return <Input value={inputValue} onChange={handleInputChange} />;
        },
      },
      {
        Header: "직급",
        accessor: "position",
        id: "position",
        Cell: ({ cell: { value } }) => {
          const [inputValue, setInputValue] = React.useState(value);

          const handleInputChange = (e) => {
            setInputValue(e.target.value);
          };
          return <Input value={inputValue} onChange={handleInputChange} />;
        },
      },
    ],
    [],
  );

  //급여항목 , 급액 item2
  const dummyItem2 = [
    {
      nm_tax: "기본급",
      amt_allowance: pay,
    },
  ];
  const columnsItem2 = React.useMemo(
    () => [
      {
        Header: "급여항목",
        accessor: "nm_tax",
        id: "nm_tax",
      },
      {
        Header: "금액",
        width: "60%",
        accessor: "amt_allowance",
        id: "amt_allowance",
        Cell: ({ cell: { value } }) => {
          return editing ? (
            <CustomPriceInput
              id="price-input"
              value={pay}
              width={100}
              onChange={handlePriceChange}
              onBlur={handleInputBlur}
            />
          ) : pay !== null && pay.trim() !== "" ? (
            <span>{Number(pay).toLocaleString()}</span>
          ) : null;
        },
      },
    ],
    [editing, pay],
  );
  //item3
  const dummyItem3 = [
    {
      nm_tax: "국민연금",
      amt_allowance: 0,
    },
    {
      nm_tax: "건강보험",
      amt_allowance: 1000,
    },
    {
      nm_tax: "고용보험",
      amt_allowance: 2000,
    },
    {
      nm_tax: "장기요양보험료",
      amt_allowance: 3121212,
    },
    {
      nm_tax: "소득세",
      amt_allowance: 3333333,
    },
    {
      nm_tax: "지방소득세",
      amt_allowance: 122222,
    },
  ];
  const columnsItem3 = React.useMemo(
    () => [
      {
        Header: "급여항목",
        accessor: "nm_tax",
        id: "nm_tax",
      },
      {
        Header: "금액",
        width: "60%",
        accessor: "amt_allowance",
        id: "amt_allowance",
        Cell: ({ cell: { value } }) => {
          return editing ? (
            <CustomPriceInput
              id="price-input"
              value={value}
              width={100}
              onChange={handlePriceChange}
              onBlur={handleInputBlur}
            />
          ) : (
            <span>{Number(value).toLocaleString()}</span>
          );
        },
      },
    ],
    [],
  );

  //item4
  const dummyItem4 = [
    {
      nm_tax: "기본급",
      fg_tax: 0, // 0 과세 , 1비과세
      amt_allowance: 0,
    },
  ];
  const columnsItem4 = React.useMemo(
    () => [
      {
        Header: "급여항목",
        accessor: "nm_tax",
        id: "nm_tax",
      },
      {
        Header: "TX",
        accessor: "fg_tax",
        id: "fg_tax",
      },
      {
        Header: "금액",
        width: "60%",
        accessor: "amt_allowance",
        id: "amt_allowance",
        Cell: ({ cell: { value } }) => {
          return editing ? (
            <CustomPriceInput
              id="price-input"
              value={value}
              width={100}
              onChange={handlePriceChange}
              onBlur={handleInputBlur}
            />
          ) : (
            <span>{Number(value).toLocaleString()}</span>
          );
        },
      },
    ],
    [],
  );
  //item5
  const dummyItem5 = [
    {
      nm_tax: "국민연금",
      amt_allowance: 0,
    },
    {
      nm_tax: "건강보험",
      amt_allowance: 1000,
    },
    {
      nm_tax: "고용보험",
      amt_allowance: 2000,
    },
    {
      nm_tax: "장기요양보험료",
      amt_allowance: 3121212,
    },
    {
      nm_tax: "소득세",
      amt_allowance: 3333333,
    },
    {
      nm_tax: "지방소득세",
      amt_allowance: 122222,
    },
  ];
  const columnsItem5 = React.useMemo(
    () => [
      {
        Header: "급여항목",
        accessor: "nm_tax",
        id: "nm_tax",
      },
      {
        Header: "금액",
        width: "60%",
        accessor: "amt_allowance",
        id: "amt_allowance",
        Cell: ({ cell: { value } }) => {
          return editing ? (
            <CustomPriceInput
              id="price-input"
              value={value}
              width={100}
              onChange={handlePriceChange}
              onBlur={handleInputBlur}
            />
          ) : (
            <span>{Number(value).toLocaleString()}</span>
          );
        },
      },
    ],
    [],
  );

  return (
    <>
      <div className="pageHeader">
        <div className="innerBox fxSpace">
          <PageHeaderName text="급여자료입력(테스트)" />
          <div className="fxAlignCenter">
            <div className="btnWrapper textBtnWrap">
              <PageHeaderTextButton text="급여대장" />
              <PageHeaderTextButton text="지급일자" />
              <PageHeaderTextButton text="수당/공제등록" onClick={openModal} />
              <CustomModal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                overlayStyle={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                contentStyle={{
                  width: "600px",
                  height: "400px",
                  backgroundColor: "white",
                  border: "1px solid gray",
                }}
              >
                <h2>커스텀 모달 제목</h2>
                <p>커스텀 모달 내용</p>
                <button onClick={closeModal}>닫기</button>
              </CustomModal>
              <PageHeaderTextButton text="재계산" />
              <PageHeaderTextButton text="완료" />
              <PageHeaderTextButton text="급여메일보내기" />
              <PageHeaderTextButton text="급여명세 문자보내기" />
            </div>
            <div className="iconBtnWrap">
              <PageHeaderIconButton
                btnName="print"
                imageSrc={Print}
                altText="프린트"
              />
              <PageHeaderIconButton
                btnName="delete"
                imageSrc={Delete}
                altText="삭제"
              />
              <PageHeaderIconButton
                btnName="calc"
                imageSrc={Calc}
                altText="계산기"
              />
              <PageHeaderIconButton
                btnName="setting"
                imageSrc={Setting}
                altText="세팅"
              />
            </div>
          </div>
        </div>
      </div>
      <section className="section sd-section">
        <div className="searchBar">
          <div className="innerBox fxSpace">
            <div className="selectWrapper">
              {/* <div className="searchBarBox">
                  <span className="searchBarName">귀속연월</span>
                  <CustomCalendar className="" width="150" />
                </div> */}
              <div className="searchBarName">
                <div className="searchBarNameCalender">
                  <span>귀속년월</span>
                  <CustomCalendar
                    width="150"
                    type="month"
                    onChange={handleBelongingDateChange}
                  />
                </div>
              </div>
              <SearchBarBox
                label="구분"
                id="sd-salary-category"
                options={[
                  { value: "0", label: "0. 급여" },
                  { value: "1", label: "1. 급여 + 상여" },
                  { value: "2", label: "2. 상여" },
                  { value: "3", label: "3. 추급" },
                  { value: "4", label: "4. 추상" },
                ]}
              />
              <div className="searchBarName">
                <div className="searchBarNameCalender">
                  <span>지급일</span>
                  <CustomCalendar
                    width="150"
                    show="top"
                    onChange={handlePayDateChange}
                  />
                </div>
              </div>
              <SearchBarBox
                label="정렬"
                id="sd-order-category"
                options={[
                  { value: "0", label: "0. 코드순" },
                  { value: "1", label: "1. 이름순" },
                  { value: "2", label: "2. 직급순" },
                  { value: "3", label: "3. 입사일순" },
                ]}
                defaultValue={searchOrder}
                onChange={handleSearchTypeChange}
              />
            </div>
            <div className="btnWrapper">
              <button className="gray" onClick={handleFetchEmpData}>
                조회
              </button>
            </div>
          </div>
        </div>
        <div className="sd-container">
          <div className="sd-item sd-item1">
            <Table data={EmpData} columns={columnsItem1} />
            <table className="sd-empList-calTable">
              <tbody>
                <tr>
                  <td></td>
                  <td colSpan={2}>인 원 ( 퇴 직 )</td>
                  <td>{empList.length}</td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="sd-item sd-item2">
            <Table
              data={dummyItem2}
              columns={columnsItem2}
              editing={editing}
              setEditing={setEditing}
              pay={pay}
              setPay={setPay}
              page={"sd"}
            />
            <table className="sd-allowance-top-calTable">
              <tbody>
                <tr>
                  <td>과세</td>
                  <td>999,999,999</td>
                </tr>
                <tr>
                  <td>비과세</td>
                  <td></td>
                </tr>
                <tr>
                  <td>감면 소득</td>
                  <td></td>
                </tr>
                <tr>
                  <td>지급액 계</td>
                  <td>999,999,999</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="sd-item sd-item3">
            <Table data={dummyItem3} columns={columnsItem3} />
            <table className="sd-allowance-bottom-calTable">
              <tbody>
                <tr>
                  <td>공제액 계</td>
                  <td>456,641,770</td>
                </tr>
                <tr>
                  <td>차인지급액</td>
                  <td>534,358,229</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="sd-item sd-item4">
            <div className="sd-searchCondition">
              <span className="searchBarName">조회구분</span>
              <SearchBarBox
                id="hr-category"
                options={[
                  { value: "0", label: "0. 전체사원_당월" },
                  { value: "1", label: "1. 현재사원_당월" },
                  { value: "2", label: "2. 전체사원_현재" },
                  { value: "3", label: "3. 현재사원_현재" },
                  { value: "4", label: "4. 전체사원_연간" },
                  { value: "5", label: "5. 현재사원_연간" },
                ]}
                defaultValue="0"
              />
            </div>
            <div className="sd-tableArea">
              <Table data={dummyItem4} columns={columnsItem4} />
              <table className="sd-search-allowance-top-calTable">
                <tbody>
                  <tr>
                    <td>과세</td>
                    <td>1,000,000,149</td>
                  </tr>
                  <tr>
                    <td>비과세</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>감면 소득</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>지급액 계</td>
                    <td>1,000,000,149</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="sd-item sd-item5">
            <Table data={dummyItem5} columns={columnsItem5} />
            <table className="sd-search-allowance-bottom-calTable">
              <tbody>
                <tr>
                  <td>공제액 계</td>
                  <td>456,641,770</td>
                </tr>
                <tr>
                  <td>차인지급액</td>
                  <td>534,358,229</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
};

export default TableTest;
