import React, { useEffect, useState } from "react";
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
import Table from "../components/TablesLib/Table";
import Input from "../components/Contents/Input";
import CustomModal from "../components/Contents/CustomModal";
import useApiRequest from "../components/Services/ApiRequest";

const TableTest = (props) => {
  // const [editing, setEditing] = useState(false);
  const [pay, setPay] = useState("");
  const [beforePay, setBeforePay] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [empList, setEmpList] = useState([]);
  const [belongingDate, setBelongingDate] = useState("");
  const handleBelongingDateChange = (newDate) => {
    newDate = newDate.replace(/-/g, "");
    setBelongingDate(newDate);
    console.log("귀속년월 : " + belongingDate);
  };
  const [payDay, setPayDay] = useState();
  const handlePayDateChange = (newDate) => {
    newDate = newDate.replace(/-/g, "");
    setPayDay(newDate);
    console.log("지급일 : " + payDay);
  };
  const [searchOrder, setSearchOrder] = useState("cdEmp");
  // 선택된 값이 변경될 때 호출될 콜백 함수
  const handleSearchTypeChange = (newValue) => {
    setSearchOrder(newValue);
    console.log("정렬기준 : " + searchOrder);
  };
  const [showInsertRow, setShowInsertRow] = useState(false); // 테이블의 insertRow의 상태
  const [clickEmpCode, setClickEmpCode] = useState("aaa"); // 현재 클릭한 cdEmp 저장하는 상태

  useEffect(() => {
    if (clickEmpCode !== undefined) {
      console.log("insert : " + clickEmpCode);
    }
  }, [clickEmpCode]);
  const [taxAmount, setTaxAmount] = useState({
    nationalPension: "", //국민연금
    healthInsurance: "", //건강보험
    employmentInsurance: "", //고용보험
    longtermNursingInsurance: "", //장기요양보험
    incomeTax: "", //소득세
    localIncomeTax: "", //지방소득세
  }); //단일 세금 금액

  const [empDetailInfo, setEmpDetailInfo] = useState({
    hireDate: "", //입사일
    gender: "", //성별
    address: "", //주소
    detailAddress: "", //상세주소
    phone: "", //휴대폰번호
    email: "", //이메일
    leavingDate: "", //퇴사일
    department: "", //부서
    domesticForeign: "", //내외국인
    family: "", //가족수
    military: "", //병역
    obstacle: "", //장애
    certificate: "", //자격증
  }); //사원 상세 정보

  //api 요청 함수
  const apiRequest = useApiRequest();

  const handlePriceChange = (value) => {
    setPay(value);
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  //조회 버튼 클릭시 사원리스트 불러오기(select)
  const handleFetchEmpData = async () => {
    // data 객체의 속성들이 undefined, null 또는 공백인지 확인
    if (!belongingDate || !payDay || !searchOrder) {
      alert("조회 조건 사항을 모두 선택해 주세요");
      return;
    }
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

  //사원 클릭시 사원정보와 급여 정보 불러오기
  const handleGetEmpDetailData = async (code) => {
    try {
      const responseData = await apiRequest({
        method: "POST",
        url: "/api2/sd/getOneEmpDetailData",
        data: {
          code: code,
          belongingDate: belongingDate,
          payDay: payDay,
        },
      });
      console.log("사원 클릭시 : ");
      console.log(responseData.searchInfo);
      console.log("사원 클릭시 : ");
      console.log(responseData.deducation);
      setPay(responseData.pay);
      setBeforePay(responseData.pay);
      setEmpDetailInfo(responseData.searchInfo);
      setTaxAmount(responseData.deducation);
      setClickEmpCode(code);
    } catch (error) {
      console.error("Failed to fetch emp data:", error);
    }
  };

  //기본급 입력 후 이벤트(insert)
  const handleInsertData = async (code, pay) => {
    try {
      const responseData = await apiRequest({
        method: "POST",
        url: "/api2/sd/setEmpPay",
        data: {
          code: code,
          pay: pay,
          belongingDate: belongingDate,
          payDay: payDay,
        },
      });
      setTaxAmount(responseData);
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
        Cell: ({ cell: { value }, row: { original } }) => {
          const [inputValue, setInputValue] = React.useState(value);

          const handleInputChange = (e) => {
            setInputValue(e.target.value);
          };

          const handleInputClick = (e) => {
            const clickedCode = original.code;
            console.log("클릭코드 : " + clickedCode);
            setClickEmpCode(clickedCode);
            handleGetEmpDetailData(clickedCode);
          };

          return (
            <Input
              value={inputValue}
              onClick={handleInputClick}
              onChange={handleInputChange}
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
            const clickedCode = original.code;
            setClickEmpCode(clickedCode);
            handleGetEmpDetailData(clickedCode);
          };

          return (
            <Input
              value={inputValue}
              onClick={handleInputClick}
              onChange={handleInputChange}
            />
          );
        },
      },
      {
        Header: "직급",
        accessor: "position",
        id: "position",
        Cell: ({ cell: { value }, row: { original } }) => {
          const [inputValue, setInputValue] = useState(value);

          const handleInputChange = (e) => {
            setInputValue(e.target.value);
          };

          const handleInputClick = (e) => {
            const clickedCode = original.code;
            setClickEmpCode(clickedCode);
            handleGetEmpDetailData(clickedCode);
          };
          return (
            <Input
              value={inputValue}
              onClick={handleInputClick}
              onChange={handleInputChange}
            />
          );
        },
      },
    ],
    [belongingDate, payDay],
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
          const [inputValue, setInputValue] = React.useState(value || "");
          const handleInputChange = (e) => {
            console.log(clickEmpCode);
            setInputValue(e.target.value);
            console.log(inputValue);
          };
          const insertPayAmount = (e) => {
            console.log("입력 급여 : " + inputValue.replaceAll(",", ""));
            console.log("가져온 급여 : " + beforePay);
            if (inputValue !== Number(beforePay).toLocaleString()) {
              const insertPay = e.target.value;
              const clickedCode = clickEmpCode;
              handleInsertData(clickedCode, insertPay);
            }
          };
          return (
            <Input
              isDoubleClick={true}
              id="price-input"
              value={inputValue}
              width={100}
              onChange={handleInputChange}
              onBlur={insertPayAmount}
              onEnterPress={insertPayAmount}
              className={"doubleLine"}
              type="price"
            />
          );
        },
      },
    ],
    [pay, clickEmpCode],
  );
  //item3
  const dummyItem3 = [
    {
      nm_tax: "국민연금",
      amt_allowance: taxAmount.nationalPension,
    },
    {
      nm_tax: "건강보험",
      amt_allowance: taxAmount.healthInsurance,
    },
    {
      nm_tax: "고용보험",
      amt_allowance: taxAmount.employmentInsurance,
    },
    {
      nm_tax: "장기요양보험료",
      amt_allowance: taxAmount.longtermNursingInsurance,
    },
    {
      nm_tax: "소득세",
      amt_allowance: taxAmount.incomeTax,
    },
    {
      nm_tax: "지방소득세",
      amt_allowance: taxAmount.localIncomeTax,
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
          const [inputValue, setInputValue] = React.useState(value);
          const handleInputChange = (e) => {
            console.log(clickEmpCode);
            console.log("newValue");
            console.log(e.target.value);
            setInputValue(e.target.value);
          };
          return (
            <Input
              id="price-input"
              value={inputValue}
              width={100}
              onChange={handleInputChange}
              className={"doubleLine"}
              type="price"
            />
          );
        },
      },
    ],
    [taxAmount],
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
          return <Input />;
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
          return <Input />;
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
              <div className="searchBarName">
                <div className="searchBarNameCalender">
                  <span>귀속년월</span>
                  <CustomCalendar
                    width="150"
                    type="month"
                    value={belongingDate}
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
                    value={payDay}
                    onChange={handlePayDateChange}
                  />
                </div>
              </div>
              <SearchBarBox
                label="정렬"
                id="sd-order-category"
                options={[
                  { value: "cdEmp", label: "0. 코드순" },
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
            <Table
              data={EmpData}
              columns={columnsItem1}
              showInsertRow={showInsertRow}
              setShowInsertRow={setShowInsertRow}
              scrollHeight="500"
            />
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
              // editing={editing}
              // setEditing={setEditing}
              // pay={pay}
              // setPay={setPay}
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
          <div className="sd-item sd-item6">
            <div className="sd-empInfo">
              <div className="sd-empInfo-top">
                <h4>
                  <span>
                    <box-icon name="user"></box-icon>
                  </span>
                  사원정보
                </h4>
              </div>
              <div className="sd-empInfo-detail">
                <label htmlFor="">입사일</label>
                <p>{empDetailInfo.hireDate}</p>
                <label htmlFor="">성별</label>
                <p>{empDetailInfo.gender}</p>
                <label htmlFor="">주소</label>
                <p>{empDetailInfo.address}</p>
                <label htmlFor="">상세주소</label>
                <p>{empDetailInfo.detailAddress}</p>
                <label htmlFor="">핸드폰</label>
                <p>{empDetailInfo.phone}</p>
                <label htmlFor="">이메일</label>
                <p>{empDetailInfo.email}</p>
                <label htmlFor="">퇴사일</label>
                <p>{empDetailInfo.leavingDate}</p>
                <label htmlFor="">부서</label>
                <p>{empDetailInfo.department}</p>
                <label htmlFor="">내외국인</label>
                <p>{empDetailInfo.domesticForeign}</p>
                <label htmlFor="">가족수</label>
                <p>{empDetailInfo.family}</p>
                <label htmlFor="">병역</label>
                <p>{empDetailInfo.military}</p>
                <label htmlFor="">장애구분</label>
                <p>{empDetailInfo.obstacle}</p>
                <label htmlFor="">자격증</label>
                <p>{empDetailInfo.certificate}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default TableTest;
