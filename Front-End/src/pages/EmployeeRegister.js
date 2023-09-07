import React, { useState } from "react";
import Setting from "../images/pages/common/setting.png";
import Calc from "../images/pages/common/calc.png";
import Print from "../images/pages/common/print.png";
import Delete from "../images/pages/common/delete.png";

import "../styles/css/pages/EmployeeRegister.css";
import PageHeaderIconButton from "../components/PageHeader/PageHeaderIconButton";
import PageHeaderName from "../components/PageHeader/PageHeaderName";
import PageHeaderTextButton from "../components/PageHeader/PageHeaderTextButton";
import CustomCalendar from "../components/Contents/CustomCalendar";
import CustomInput from "../components/Contents/CustomInput";
import Input from "../components/Contents/Input";
import SearchBarBox from "../components/SearchBar/SearchBarBox";
import CustomButton from "../components/Contents/CustomButton";
import CustomNumberInput from "../components/Contents/CustomNumberInput";
import CustomResidentNumberInput from "../components/Contents/CustomResidentNumberInput";
import CustomEmailInput from "../components/Contents/CustomEmailInput";
import DaumPostcode from 'react-daum-postcode';
import Table from "../components/TablesLib/Table";

const EmployeeRegister = () => {
  const [employeeData, setEmployeeData] = useState([]);
  const [openPostcode, setOpenPostcode] = useState(false);
  const [empList, setEmpList] = useState([]);
  const [zonecode, setZonecode] = useState("");
  const [address, setAddress] = useState("");
  // const [detailAddress, setDetailAddress] = useState("");

  // const handleFetchEmpData = async () => {
  //   try {
  //     const url = "/er/getAllEmpList";
  //     const data = await handlePageHeaderSearchSubmit(url);
  //     console.log("가져온 데이터 : ");
  //     console.log(data);
  //   } catch (error) {
  //     console.error("Failed to fetch emp data:", error);
  //   }
  // };

  // 버튼 클릭시 DaumPostcode 모달 열기
  const handleAddressButtonClick = () => {
    setOpenPostcode(true);
  }

  const handleAddressSelect = (data) => {
    console.log(`
        우편번호: ${data.zonecode}
        주소: ${data.address}
    `);

    // // 주소와 우편번호 값을 가져온 데이터로 설정
    // const address = data.address;
    // const zipcode = data.zipcode;
  
    // // 상태를 업데이트하여 주소와 우편번호를 입력란에 설정
    // setEmpList((prevEmpList) => [
    //   ...prevEmpList,
    //   {
    //     // 이전 데이터 유지하고 주소와 우편번호 추가
    //     address: address, // 주소 상태 값 사용
    //     zipcode: zipcode, // 우편번호 상태 값 사용
    //   },
    // ]);
  
    setZonecode(data.zonecode); // 선택된 우편번호로 우편번호 상태 업데이트
    setAddress(data.address); // 선택된 주소로 주소 상태 업데이트
    setOpenPostcode(false); // 모달 닫기
  }

  // 모달 닫기
  const closeModal = () => {
    setOpenPostcode(false);
  }

  const data = React.useMemo(
    () =>
      empList.map((emp) => ({
        checkbox: false,
        code: emp.cdEmp,
        employee: emp.nmEmp,
        foreign: emp.fgForeign,
        resident: emp.noResident,
      })),
    [empList]
  );
  const columns = React.useMemo(
    () => [
      {
        Header: "✓",
        accessor: "checkbox",
        id: "checkbox",
        Cell: ({ cell: { value } }) => <input type="checkbox" />,
      },
      {
        Header: "Code",
        accessor: "code",
        id: "code",
        width: "20%",
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
              onClick={handleInputClick}
              onChange={handleInputChange}
            />
          );
        },
      },
      {
        Header: "사원명",
        accessor: "employee",
        id: "employee",
        width: "20%",
        Cell: ({ cell: { value } }) => {
          const [inputValue, setInputValue] = React.useState(value);

          const handleInputChange = (e) => {
            setInputValue(e.target.value);
          };

          return (
            <Input
              value={inputValue}
              onChange={handleInputChange}
            />
          );
        },
      },
      {
        Header: "내/외",
        accessor: "foreign",
        id: "foreign",
        width: "12%",
        Cell: ({ cell: { value } }) => {
          const [inputValue, setInputValue] = React.useState(value);

          const handleInputChange = (e) => {
            setInputValue(e.target.value);
          };

          return (
            <Input
              value={inputValue}
              onChange={handleInputChange}
            />
          );
        },
      },
      {
        Header: "주민번호",
        accessor: "resident",
        id: "resident",
        Cell: ({ cell: { value } }) => {
          const [inputValue, setInputValue] = React.useState(value);

          const handleInputChange = (e) => {
            setInputValue(e.target.value);
          };

          return (
            <Input
              value={inputValue}
              onChange={handleInputChange}
            />
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
          <PageHeaderName text="사원등록" />
          <div className="fxAlignCenter">
            <div className="btnWrapper textBtnWrap">
              <PageHeaderTextButton text="사원검색" />
              <PageHeaderTextButton text="조건검색" />
              <PageHeaderTextButton text="데이터정렬" />
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

      <section className="section erSection">
        {/* 첫번째 그리드 */}
        <div className="erGrid">
          {/* 첫번째 테이블 */}
          <div className="listArea">
            <div className="namePickerBox">
              <Table
                columns={columns}
                data={data}
                showInsertRow={true}
                checkboxWidth={"10%"}
              />
            </div>

            {/* 두번째 테이블 */}
            <table className="erGridBottomTable">
              <tbody>
                <tr>
                  <td>재직 / 전체</td>
                  <td>{employeeData.length}명 / {employeeData.length}명</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 두번째 그리드 */}
        <div className="erGrid2">
          {/* 제목 탭 테이블 */}
          <ul className="pageTab">
            <li className="on">기초자료</li>
          </ul>

          {/* 탭 내용 테이블 */}
          <table>
            <tbody className="borderTopBold">
              <tr>
                <th className="erHeaderStyle">입사일자</th>
                <td className="erCellStyle">
                  <CustomCalendar width={180} id="erDate1" />
                </td>
              </tr>
              <tr>
                <th className="erHeaderStyle">주민번호</th>
                <td className="erCellStyle">
                  <SearchBarBox
                    className="erSelectBox"
                    options={[
                      { value: "0", label: "내국인" },
                      { value: "1", label: "외국인" },
                    ]}
                    defaultValue="0"
                  />
                </td>
                <td className="erCellStyle">
                  <CustomResidentNumberInput width={180} />
                </td>
                <td className="erCellStyle">
                  <SearchBarBox
                    className="erSelectBox"
                    options={[
                      { value: "0", label: "남자" },
                      { value: "1", label: "여자" },
                    ]}
                    defaultValue="0"
                  />
                </td>
              </tr>
              <tr>
                <th className="erHeaderStyle">주소</th>
                <td className="erCellStyle">
                  <CustomInput width={180} value={zonecode} setZonecode={setZonecode} />
                </td>
                <td className="erCellStyle" colSpan="2">
                  <CustomInput width={370} value={address} setAddress={setAddress} />
                </td>
                <td className="erCellStyle">
                  <CustomButton text="검색" color="black" onClick={handleAddressButtonClick} />
                </td>
              </tr>
              <tr>
                <th className="erHeaderStyle">상세주소</th>
                <td className="erCellStyle" colSpan="5">
                  <CustomInput width={845} />
                </td>
              </tr>
              <tr>
                <th className="erHeaderStyle">전화번호</th>
                <td className="erCellStyle">
                  <CustomNumberInput width={180} maxLength={3} />
                </td>
                <td className="erCellStyle">
                  <CustomNumberInput width={180} maxLength={4} />
                </td>
                <td className="erCellStyle">
                  <CustomNumberInput width={180} maxLength={4} />
                </td>
              </tr>
              <tr>
                <th className="erHeaderStyle">휴대폰번호</th>
                <td className="erCellStyle">
                  <CustomNumberInput width={180} maxLength={3} />
                </td>
                <td className="erCellStyle">
                  <CustomNumberInput width={180} maxLength={4} />
                </td>
                <td className="erCellStyle">
                  <CustomNumberInput width={180} maxLength={4} />
                </td>
                {/* disabled */}
                <td width={298}>
                  <input type="text" disabled className="erInputDisabledStyle" />
                </td>
              </tr>
              <tr>
                <th className="erHeaderStyle">이메일</th>
                <td className="erCellStyle">
                  <div>
                    <CustomEmailInput width={180} />
                  </div>
                </td>
                <td className="erCellStyle">
                  <div className="email-cell">
                    <div className="at-sign">@</div>
                    <CustomInput className="input-cell" />
                  </div>
                </td>
                <td className="erCellStyle">
                  <SearchBarBox
                    className="erSelectBox"
                    options={[
                      { value: "0", label: "직접입력" },
                      { value: "1", label: "gmail.com" },
                      { value: "2", label: "naver.com" },
                      { value: "3", label: "daum.net" },
                    ]}
                    defaultValue="0"
                  />
                </td>
              </tr>
              <tr>
                <th className="erHeaderStyle">부서</th>
                <td className="erCellStyle">
                  <CustomInput width={180} />
                </td>
              </tr>
              <tr>
                <th className="erHeaderStyle">직급</th>
                <td className="erCellStyle">
                  <SearchBarBox 
                    className="erSelectBox"
                    options={[{value:"0", label:"기본직급"}]} 
                    defaultValue="0" 
                  />
                </td>
                <td className="erCellStyle">
                  <SearchBarBox
                    className="erSelectBox"
                    options={[
                      { value: "0", label: "직급없음" },
                      { value: "1", label: "회장" },
                      { value: "2", label: "사장" },
                      { value: "3", label: "부사장" },
                    ]}
                    defaultValue="0"
                  />
                </td>
              </tr>
              <tr>
                <th className="erHeaderStyle">퇴사일자</th>
                <td className="erCellStyle">
                  <CustomCalendar width={180} id="erDate2" />
                </td>
              </tr>
              <tr>
                <th className="erHeaderStyle">급여이체은행</th>
                <td className="erCellStyle">
                  <CustomInput width={180} />
                </td>
                <td className="erCellStyle">
                  <CustomInput width={180} />
                </td>
                <td className="erCellStyle">
                  <CustomInput width={180} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 모달 창 */}
        {openPostcode && (
          <div className="modalOverlay" onClick={closeModal}>
            <div className="modalContent" onClick={(e) => e.stopPropagation()}>
              <DaumPostcode 
                style={{ height: "100%" }}
                onComplete={handleAddressSelect}  
                autoClose={false} 
              />
            </div>
          </div>
        )}
      </section>
    </>
  );
}

export default EmployeeRegister;
