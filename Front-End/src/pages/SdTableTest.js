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

const TableTest = (props) => {
  const [editing, setEditing] = useState(false);
  const [price, setPrice] = useState("");

  const handlePriceChange = (value) => {
    setPrice(value);
  };

  const handleDoubleClick = () => {
    setEditing(true);
    console.log("더블클릭이벤트 발생");
  };

  const handleInputBlur = () => {
    setEditing(false);
  };

  // item1
  const dummyItem1 = [
    {
      checkbox: false,
      code: 1000,
      employee: "이재훈",
      nm_position: "조장",
    },
    {
      checkbox: false,
      code: 1001,
      employee: "박성환",
      nm_position: "부조장",
    },
    {
      checkbox: false,
      code: 1002,
      employee: "김의진",
      nm_position: "조원",
    },
    {
      checkbox: false,
      code: 1004,
      employee: "조병국",
      nm_position: "조원",
    },
  ];
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
        accessor: "nm_position",
        id: "nm_position",
        Cell: ({ cell: { value } }) => {
          const [inputValue, setInputValue] = React.useState(value);

          const handleInputChange = (e) => {
            setInputValue(e.target.value);
          };
          return <Input value={inputValue} onChange={handleInputChange} />;
        },
      },
    ],
    []
  );

  //급여항목 , 급액 item2
  const dummyItem2 = [
    {
      nm_tax: "기본급",
      amt_allowance: price,
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
              value={price}
              width={100}
              onChange={handlePriceChange}
              onBlur={handleInputBlur}
            />
          ) : (
            <span>{Number(price).toLocaleString()}</span>
          );
        },
      },
    ],
    [editing, price]
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
    []
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
    []
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
    []
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
              <PageHeaderTextButton text="수당/공제등록" />
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
                  <CustomCalendar width="150" />
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
                defaultValue="0"
              />
              <div className="searchBarName">
                <div className="searchBarNameCalender">
                  <span>지급일</span>
                  <CustomCalendar width="150" />
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
                defaultValue="0"
              />
            </div>
            <div className="btnWrapper">
              <button className="gray">조회</button>
            </div>
          </div>
        </div>
        <div className="sd-container">
          <div className="sd-item sd-item1">
            <Table data={dummyItem1} columns={columnsItem1} />
            <table className="sd-empList-calTable">
              <tbody>
                <tr>
                  <td></td>
                  <td colSpan={2}>인 원 ( 퇴 직 )</td>
                  <td>7(0)</td>
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
              price={price}
              setPrice={setPrice}
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
                  { value: "3", label: "4. 전체사원_연간" },
                  { value: "3", label: "5. 현재사원_연간" },
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
