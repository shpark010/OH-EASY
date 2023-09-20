import React, { useState, useCallback, useMemo, useEffect } from "react";
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
import CustomSelect from "../components/Contents/CustomSelect";
import CustomButton from "../components/Contents/CustomButton";
import DaumPostcode from 'react-daum-postcode';
import Table from "../components/TablesLib/Table";
import CustomModalInput from "../components/Contents/CustomModalInput";
import useApiRequest from "../components/Services/ApiRequest";
import moment from "moment";
import SweetAlert from "../components/Contents/SweetAlert";

const EmployeeRegister = () => {
  const apiRequest = useApiRequest();
  const [isReadOnly, setIsReadOnly] = useState(true); // 모든 입력 필드가 readOnly 상태인지 아닌지 확인
  const [selectedOption, setSelectedOption] = useState("0"); // 이메일 선택값 관리
  const [openPostcode, setOpenPostcode] = useState(false); // 카카오 API 모달창 상태관리
  const [empList, setEmpList] = useState([]); // 첫번째 테이블의 사원정보들 관리
  const [clickCdEmp, setClickCdEmp] = useState(""); // table에서 행 클릭시 cdEmp 저장
  const [showAlert, setShowAlert] = useState(false); // sweetAlert 상태 관리
  
  // 사원정보 테이블 컬럼 상태관리
  const [nmEmp, setNmEmp] = useState(""); // 이름 상태 관리
  const [noResident, setNoResident] = useState(""); // 주민번호 상태 관리
  const [fgForeign, setFgForeign] = useState(0); // 내/외국인 상태 관리
  const [dtHire, setDtHire] = useState(""); // 입사일자 상태 관리
  const [noPost, setNoPost] = useState(""); // 우편번호 상태 관리
  const [nmAddress, setNmAddress] = useState(""); // 주소 상태 관리
  const [dcAddress, setDcAddress] = useState(""); // 상세 주소 상태 관리
  
  // noPhone을 - 기준으로 3개로 나눠서 상태 관리
  const [noPhone1, setNoPhone1] = useState(""); // 전화번호 상태 관리
  const [noPhone2, setNoPhone2] = useState(""); // 전화번호 상태 관리
  const [noPhone3, setNoPhone3] = useState(""); // 전화번호 상태 관리
  
  // noMobilePhone을 - 기준으로 3개로 나눠서 상태 관리
  const [noMobilePhone1, setNoMobilePhone1] = useState(""); // 휴대폰번호 상태 관리
  const [noMobilePhone2, setNoMobilePhone2] = useState(""); // 휴대폰번호 상태 관리
  const [noMobilePhone3, setNoMobilePhone3] = useState(""); // 휴대폰번호 상태 관리
  
  // nmEmail을 @기준으로 나눠서 상태 관리
  const [username, setUsername] = useState(""); // 이메일 사용자명 상태 관리
  const [domain, setDomain] = useState(""); // 이메일 도메인 상태 관리

  const [cdBank, setCdBank] = useState(""); // 은행정보 상태 관리
  const [dtResign, setDtResign] = useState(""); // 퇴사일자 상태 관리
  const [noAccount, setNoAccount] = useState(""); // 계좌번호 상태 관리
  const [nmAccountHolder, setNmAccountHolder] = useState(""); // 예금주명 상태 관리
  const [noPositionUnique, setNoPositionUnique] = useState(""); // 직급고유번호 상태 관리
  const [noDepartment, setNoDepartment] = useState(""); // 부서번호 상태 관리

  const [selectedEmpCode, setSelectedEmpCode] = useState(null); // 현재 체크된 cdEmp 저장하는 상태
  const [checkedRows, setCheckedRows] = useState([]); // 각 행의 체크박스 상태를 저장하는 상태
  const [showInsertRow, setShowInsertRow] = useState(false); // 테이블의 insertRow의 상태

  // 컴포넌트가 처음 마운트될 때 handleGetEmpList 실행
  useEffect(() => {
    handleGetEmpList();
  }, []);

  // Email 도메인 맵
  const domainMap = {
    "0": "직접입력",
    "1": "gmail.com",
    "2": "kakao.com",
    "3": "nate.com",
    "4": "naver.com",
    "5": "yahoo.co.kr",
  };
  
  // 선택된 이메일 주소값 가져오기
  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    const newDomain = domainMap[selectedValue];
  
    setSelectedOption(selectedValue);
  
    if (newDomain === "직접입력") {
      setDomain("");
    } else {
      setDomain(newDomain);
    }

    handleDomainUpdate(newDomain);
  
    console.log("selectedValue : " + selectedValue);
    console.log("username : " + username);
    console.log("newDomain : " + newDomain);
  };

  // username만 업데이트하는 함수
  const handleUsernameUpdate = () => {
    if (!username) {
      console.log("Invalid username. Skipping API request.");
      return;
    }
    const email = domain ? `${username}@${domain}` : username;
    handleUpdateEmp("nmEmail", clickCdEmp, email);
  };

  // domain만 업데이트하는 함수
  const handleDomainUpdate = (newDomain) => {
    if (!newDomain) {
      console.log("Invalid domain. Skipping API request.");
      return;
    }
    const email = username ? `${username}@${newDomain}` : `@${newDomain}`;
    handleUpdateEmp("nmEmail", clickCdEmp, email);
  };

  // CustomSelect에 넘겨줄 options
  const options = Object.keys(domainMap).map((key) => ({
    value: key,
    label: domainMap[key],
  }));

  // 내/외 업데이트 함수
  const handleFgForeignChange = (event) => {
    const selectedValue = event.target.value;
    console.log("Selected option value:", selectedValue);
  
    if (selectedValue !== undefined) {
      setFgForeign(selectedValue);
      handleUpdateEmp("fgForeign", clickCdEmp, selectedValue);
    }
  };

  // 직급 업데이트 함수
  const handleNoPositionUniqueChange = (event) => {
    const selectedValue = event.target.value;
    console.log("Selected option value:", selectedValue);
  
    if (selectedValue !== undefined) {
      setNoPositionUnique(selectedValue);
      handleUpdateEmp("noPositionUnique", clickCdEmp, selectedValue);
    }
  };

  // 성별 자동입력 함수
  const genderFromNoResident = (noResident) => {

    const genderDigit = noResident.split('-')[1]?.[0];
    
    let result = null;
    if (genderDigit === '2' || genderDigit === '4' || genderDigit === '6') {
      result = '1';
    } else {
      result = '0';
    }
    
    return result;
  };

  // 버튼 클릭시 DaumPostcode 모달 열기
  const handleAddressButtonClick = () => {
    setOpenPostcode(true);
  }

  const handleAddressSelect = async (data) => {
    console.log(`
        우편번호: ${data.zonecode}
        주소: ${data.address}
    `);

    setNoPost(data.zonecode); // 선택된 우편번호로 상태 업데이트
    setNmAddress(data.address); // 선택된 주소로 상태 업데이트

    // 주소와 우편번호를 업데이트합니다.
    try {
        await handleUpdateEmp("noPost", clickCdEmp, data.zonecode);
        await handleUpdateEmp("nmAddress", clickCdEmp, data.address);
        console.log("주소와 우편번호 업데이트 성공");
    } catch (error) {
        console.error("주소와 우편번호 업데이트 실패", error);
    }

    setOpenPostcode(false); // 모달 닫기
  };

  // checkedRows 변화감지 useEffect
  useEffect(() => {
    console.log("checkedRows changed:", checkedRows);
  }, [checkedRows]);

  // 테이블의 각 행을 클릭했을 때 동작을 정의하는 함수
  const handleRowClick = useCallback((clickCdEmp) => {
    setSelectedEmpCode(clickCdEmp);
    console.log("clickCdEmp : " + clickCdEmp);
  }, []);

  // 헤더 체크박스를 클릭할 때 모든 체크박스를 체크하거나 체크를 해제
  const handleHeaderCheckboxClick = useCallback(() => {
    if (checkedRows.length !== empList.length) {
      const newCheckedRows = empList.map((emp) => emp.cdEmp);
      setCheckedRows(newCheckedRows);
    } else {
      setCheckedRows([]);
    }
  }, [empList, checkedRows]);

  // 각 행의 체크박스를 클릭할 때 해당 행의 체크박스 상태를 업데이트
  const handleRowCheckboxClick = useCallback((empCode) => {
    if (checkedRows.includes(empCode)) {
      setCheckedRows((prev) => prev.filter((code) => code !== empCode));
    } else {
      setCheckedRows((prev) => [...prev, empCode]);
    }
  }, [checkedRows]);

  // 모달 닫기
  const closeModal = () => {
    setOpenPostcode(false);
  }

  // 달력 하이픈 제거 함수
  const handleDateChange = (field, newDate) => {
    const formattedDateForUI = moment(newDate).format('YYYY-MM-DD');
    const formattedDateForDB = moment(newDate).format('YYYYMMDD'); // '-' 제거

    if (field === 'dtHire') {
      setDtHire(formattedDateForUI);
    } else if (field === 'dtResign') {
      setDtResign(formattedDateForUI);
    }

    handleUpdateEmp(field, clickCdEmp, formattedDateForDB); // '-'가 제거된 형태로 전달
    console.log("새로 선택한 날짜 : " + formattedDateForUI);
  };

  // 전화번호 하나로 합치기
  const handlePhoneUpdate = () => {
    // 세 부분을 하이픈(-)으로 연결
    const fullPhone = `${noPhone1}-${noPhone2}-${noPhone3}`;
    
    handleUpdateEmp("noPhone", clickCdEmp, fullPhone);
  };
  
  // 휴대폰번호 하나로 합치기
  const handleMobilePhoneUpdate = () => {
    const fullMobilePhone = `${noMobilePhone1}-${noMobilePhone2}-${noMobilePhone3}`;
    
    handleUpdateEmp("noMobilePhone", clickCdEmp, fullMobilePhone);
  };

  const data = useMemo(
    () =>
      empList.map((emp) => ({
        checkbox: false,
        code: emp.cdEmp,
        employee: emp.nmEmp,
        foreign: emp.fgForeign,
        resident: emp.noResident,
        onRowClick: () => handleRowClick(emp.cdEmp),
      })),
    [empList, handleRowClick]
  );

  const columns = useMemo(() => [
      {
      Header: (
        <input
          type="checkbox"
          checked={empList.length > 0 && checkedRows.length === empList.length}
          onChange={handleHeaderCheckboxClick}
        />
      ),
      accessor: "checkbox",
        width: "10%",
        id: "checkbox",
        Cell: ({ cell: { value }, row: { original } }) => {
          
          if (original === null) {
            return null;
          }

          return (
            <input
              type="checkbox"
              checked={checkedRows.includes(original.code)}
              onChange={() => handleRowCheckboxClick(original.code)}
            />
          );
        },
      },
      {
        Header: "Code",
        accessor: "code",
        id: "code",
        width: "20%",
        Cell: ({ cell: { value }, row: { original } }) => {
          const [inputValue, setInputValue] = useState(value || "");
          const [changed, setChanged] = useState(false);
          const [showAlert, setShowAlert] = useState(false);
          const [alertMessage, setAlertMessage] = useState('');

          const handleInputChange = (e) => {
            setInputValue(e.target.value);
            setChanged(true);
          };
      
          const tableEmpCodeClick = (e) => {
            console.log("*************************** Code 클릭");
            console.log("tableEmpCodeClick is called. original:", original);
            if (original && original.code != null) {
              console.log("*************************** original.code" + original.code);
              handleGetSingleEmp(original.code);
              setClickCdEmp(original.code);
            }
          };
      
          const handleInputOnBlurCdEmp = async (e) => {

            console.log("handleInputOnBlurCdEmp 함수가 호출되었습니다.");
            console.log("inputValue의 값 : ", inputValue);
          
            if (original && original.code) {
              console.log("original.code의 값 : ", original.code);
            }

            // inputValue가 null or undefined or 빈 문자열일 때, 앞뒤 공백을 제거한 문자열이 비어있지 않을 때, onChange 이벤트 발생 x
            if (!inputValue || (original && inputValue === original.code) || !inputValue.trim() || !changed) {
              console.log("*********************************** onChange 없으니 종료");
              return;
            }
          
            setChanged(false); // onBlur 이벤트가 처리된 후 changed를 다시 false로 설정
          
            try {
              const exists = await checkCdEmpExists(inputValue);
      
              if (!original || !original.code) {
                if (exists) {
                  setAlertMessage("이미 존재하는 Code 입니다.");
                  setShowAlert(true);
                  console.log("(InsertEmp) 이미 존재하는 Code 입니다.")
                  return;
                }
                const noSpaces = inputValue.replace(/\s+/g, '');
                handleInsertEmp(noSpaces);
              } else {
                if (!exists || (exists && original.code === inputValue)) {
                  handleUpdateEmp("cdEmp", original.code, inputValue);
                } else {
                  setAlertMessage("이미 존재하는 Code 입니다.");
                  setShowAlert(true);
                  console.log("(UpdateEmp) 이미 존재하는 Code 입니다.")
                  return;
                }
              }
            } catch (error) {
              console.error("An error occurred:", error);
            }
          };
      
          return (
            <>
              <Input
                value={inputValue || ""}
                onChange={handleInputChange}
                onClick={tableEmpCodeClick}
                isDoubleClick={true}
                className={"doubleLine"}
                onBlur={handleInputOnBlurCdEmp}
              />
      
              {showAlert && (
                <SweetAlert
                  text={alertMessage}
                  confirmText="확인"
                  onConfirm={() => {
                    setShowAlert(false);
                    window.location.reload();
                  }}
                />
              )}
            </>
          );
        },
      },
      {
        Header: "사원명",
        accessor: "employee",
        id: "employee",
        width: "20%",
        Cell: ({ cell: { value }, row: { original } }) => {
          const [inputValue, setInputValue] = useState(value || "");
          const [changed, setChanged] = useState(false);

          const handleInputChange = (e) => {
            setInputValue(e.target.value);
            setChanged(true);
          };

          
          const tableEmpNmClick = (e) => {
            console.log("*************************** 사원명 클릭");
            console.log("tableEmpNmClick is called. original:", original);
            if (original && original.code != null) {
              console.log("*************************** original.code " + original.code);
              handleGetSingleEmp(original.code);
              setClickCdEmp(original.code);
            }
          };
          
          
          const handleInputOnBlurNmEmp = (e) => {
            const inputValue = e.target.value?.trim();
            
            if (!changed) {
              console.log("*********************************** onChange 없으니 종료");
              return;
            }

            setChanged(false);

            if (original && original.code) {
              console.log("Calling handleUpdateEmp with nmEmp, original.code, inputValue: ", "nmEmp", original.code, inputValue);
          
              handleUpdateEmp("nmEmp", original.code, inputValue);
              console.log("******************** nmEmp");
              console.log("******************** code " + original.code);
              console.log("******************** updated name " + inputValue);
            } else {
              console.log("original or original.code is null or undefined. Exiting...");
            }
          };
          
          return (
            <Input
              value={inputValue || ""}
              onChange={handleInputChange}
              onClick={tableEmpNmClick}
              isDoubleClick={true}
              className={"doubleLine"}
              onBlur={handleInputOnBlurNmEmp}
            />
          );
        },
      },
      {
        Header: "내/외",
        accessor: "foreign",
        id: "foreign",
        width: "12%",
        Cell: ({ cell: { value }, row: { original } }) => {
          const [inputValue, setInputValue] = useState(value === 0 ? "내" : value === 1 ? "외" : value || "");
  
          const handleInputChange = (e) => {
              const newValue = e.target.value;
              // 입력값이 '내' 또는 '외'일 때 DB에 저장할 수 있는 형태 (0 또는 1)로 변환
              if (newValue === "내") {
                  setInputValue(0);
              } else if (newValue === "외") {
                  setInputValue(1);
              } else {
                  setInputValue(newValue);
              }
          };
  
          const tableFgForeignClick = (e) => {
              console.log("*************************** 내/외 클릭");
              console.log("tableFgForeignClick is called. original:", original);
              if (original && original.code != null) {
                  console.log("*************************** original.code " + original.code);
                  handleGetSingleEmp(original.code);
                  setClickCdEmp(original.code);
              }
          };
  
          return (
              <Input
                  value={inputValue === 0 ? "내" : inputValue === 1 ? "외" : inputValue || ""}
                  onChange={handleInputChange}
                  onClick={tableFgForeignClick}
                  className={"doubleLine"}
                  // onBlur={handleInputOnBluFgForeign}
              />
          );
        },
      },
      {
        Header: "주민번호",
        accessor: "resident",
        id: "resident",
        Cell: ({ cell: { value }, row: { original } }) => {
          const [inputValue, setInputValue] = useState(value || "");
          const [changed, setChanged] = useState(false);

          const handleInputChange = (e) => {
            setInputValue(e.target.value);
            setChanged(true);
          };

          const tableNoResidentClick = (e) => {
            console.log("*************************** 주민번호 클릭");
            console.log("tableNoResidentClick is called. original:", original);
            if (original && original.code != null) {
              console.log("*************************** original.code " + original.code);
              handleGetSingleEmp(original.code);
              setClickCdEmp(original.code);
            }
          };

          const handleInputOnBlurNoResident = (e) => {
            const inputValue = e.target.value?.trim();
            
            if (!changed) {
              console.log("*********************************** onChange 없으니 종료");
              return;
            }

            setChanged(false);

            if (original && original.code) {
              console.log("Calling handleUpdateEmp with noResident, original.code, inputValue: ", "noResident", original.code, inputValue);
          
              handleUpdateEmp("noResident", original.code, inputValue);
              console.log("******************** noResident");
              console.log("******************** code " + original.code);
              console.log("******************** updated noResident " + inputValue);
            } else {
              console.log("original or original.code is null or undefined. Exiting...");
            }
          };

          return (
            <Input
            type={"resident"}
            value={inputValue || ""}
            onChange={handleInputChange}
            onClick={tableNoResidentClick}
            isDoubleClick={true}
            className={"doubleLine"}
            onBlur={handleInputOnBlurNoResident}
            />
          );
        },
      },
    ], [empList, checkedRows, handleRowCheckboxClick, handleHeaderCheckboxClick]
  );

  // Insert
  const handleInsertEmp = async (codeValue) => {
    console.log("handleInsertEmp 실행 *********************");
    try {
      const responseData = await apiRequest({
        method: "POST",
        url: "/api2/er/postEmpData",
        data: {
          cdEmp: codeValue,
        },
      });
  
      console.log("****************************** handleInsertEmp");
      console.log(responseData);
    } catch (error) {
      console.log("api 요청 실패:", error);
    }
  };

  // 이미 존재하는 cdEmp를 체크하는 함수
  const checkCdEmpExists = async (cdEmp) => {
    console.log("checkCdEmpExists 실행 *********************");
    try {
      const responseData = await apiRequest({
        method: "GET",
        url: `/api2/er/checkCdEmpExists?cdEmp=${cdEmp}`,

      });

      console.log("*********************************** checkCdEmpExists");
      console.log("checkCdEmpExists : " + responseData);
      return responseData; // data는 boolean 값
    } catch (error) {
      console.error("API 요청 실패:", error);
      return false;
    }
  };

  // Update
  const handleUpdateEmp = async (columnName, clickCdEmp, inputValue) => {
    console.log("handleUpdateEmp 실행 *********************");
    console.log(columnName, clickCdEmp, inputValue);

    const requestData = {
      updateField: {
        [columnName]: inputValue
      },
      cdEmp: clickCdEmp
    };
  
    try {
      const responseData = await apiRequest({
        method: "POST",
        url: "/api2/er/updateEmpData",
        data: requestData,
      });
  
      console.log("***************************** handleUpdateEmp");
      console.log(responseData);
    } catch (error) {
      console.error("API 요청 실패:", error);
    }
  };

  // 전체사원 조회
  const handleGetEmpList = async () => {
    console.log("************************************************* 전체사원 조회");
    try {
      const responseData = await apiRequest({
        method: "GET",
        url: "/api2/er/getAllEmpList",
      });
      setEmpList(responseData);
      console.log("api 이벤트 발생");
      console.log("responseData.length : " + responseData.length);
    } catch (error) {
      console.error("api 요청 실패:", error);
    }
  }

  // 사원조회
  const handleGetSingleEmp = async (cdEmp) => {
    try {
      const responseData = await apiRequest({
        method: "GET",
        url: `/api2/er/getEmpData?cdEmp=${cdEmp}`,
      });
      console.log("api 이벤트 발생");
      console.log(responseData);

      // 각 컬럼에 대한 상태를 업데이트합니다.
      setClickCdEmp(responseData.cdEmp || "");
      setNmEmp(responseData.nmEmp || "");
      setNoResident(responseData.noResident || "");
      setFgForeign(responseData.fgForeign || "");
      setDtHire(responseData.dtHire || "");
      setNoPost(responseData.noPost || "");
      setNmAddress(responseData.nmAddress || "");
      setDcAddress(responseData.dcAddress || "");
      setNmAccountHolder(responseData.nmAccountHolder || "");

      // 전화번호를 하이픈(-) 기준으로 분할하여 상태 변수에 저장
      const phoneParts = (responseData.noPhone || "").split('-');
      if (phoneParts.length === 3) {
        const [noPhone1, noPhone2, noPhone3] = phoneParts;
        setNoPhone1(noPhone1);
        setNoPhone2(noPhone2);
        setNoPhone3(noPhone3);
      } else {
        setNoPhone1("");
        setNoPhone2("");
        setNoPhone3("");
      }
      
      // 휴대폰번호를 하이픈(-) 기준으로 분할하여 상태 변수에 저장
      const mobilePhoneParts = (responseData.noMobilePhone || "").split('-');
      if (mobilePhoneParts.length === 3) {
        const [noMobilePhone1, noMobilePhone2, noMobilePhone3] = mobilePhoneParts;
        setNoMobilePhone1(noMobilePhone1);
        setNoMobilePhone2(noMobilePhone2);
        setNoMobilePhone3(noMobilePhone3);
      } else {
        setNoMobilePhone1("");
        setNoMobilePhone2("");
        setNoMobilePhone3("");
      }

      // 이메일 주소를 @ 기준으로 분할하여 각각의 상태 변수에 저장
      const [username, domain] = (responseData.nmEmail || "").split('@');
      setUsername(username || "");
      setDomain(domain || "");
      setSelectedOption("0");
      setCdBank(responseData.cdBank || "");
      setDtResign(responseData.dtResign || "");
      setNoAccount(responseData.noAccount || "");
      setNoPositionUnique(responseData.noPositionUnique || "");
      setNoDepartment(responseData.noDepartment || "");
      
    } catch (error) {
      console.error("api 요청 실패:", error);
    }

    setIsReadOnly(false);
  }

  // Delete 체크된 모든 행을 삭제
  const handleDeleteEmp = async () => {
    // 여러 Promise를 동시에 실행하기 위한 배열
    const deletePromises = checkedRows.map((cdEmp) =>
      apiRequest({
        method: "DELETE",
        url: `/api2/er/deleteEmpData?cdEmp=${cdEmp}`,
      })
    );

    try {
      // 모든 DELETE 요청을 병렬로 실행
      await Promise.all(deletePromises);
      console.log("Successfully deleted all selected rows");
      handleGetEmpList(); // 삭제 후, 목록을 다시 가져옵니다.
      setCheckedRows([]); // 삭제 후 checkedRows 초기화
    } catch (error) {
      console.log("api 요청 실패:", error);
    }
  };

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
                  onClick={() => setShowAlert(true)}
                />
                
                {showAlert && (
                  <SweetAlert
                    text="정말 삭제하시겠습니까?"
                    showCancel={true}
                    confirmText="확인"
                    cancelText="취소"
                    onConfirm={async () => {
                      setShowAlert(false);
                      await handleDeleteEmp();
                      window.location.reload();
                    }}
                    onCancel={() => {
                      setShowAlert(false);
                      console.log("삭제 취소");
                    }}
                  />
                )}

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
          <div className="erlistArea">
            <div className="namePickerBox">
              <Table
                columns={columns}
                data={data}
                insertRow={true}
                showInsertRow={showInsertRow}
                setShowInsertRow={setShowInsertRow}
              />
            </div>

            {/* 두번째 테이블 */}
            <table className="erGridBottomTable">
              <tbody>
                <tr>
                  <td>재직 / 전체</td>
                  <td>{empList.length}명 / {empList.length}명</td>
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
                  <CustomCalendar 
                    width={180} 
                    value={dtHire} 
                    onChange={(newDate) => handleDateChange("dtHire", newDate)}
                    readOnly={isReadOnly}
                  />
                </td>
              </tr>
              <tr>
                <th className="erHeaderStyle">주민번호</th>
                  <td className="erCellStyle">
                    <CustomSelect
                      className="erSelectBox"
                      options={[
                        { value: "0", label: "내국인" },
                        { value: "1", label: "외국인" },
                      ]}
                      value={fgForeign}
                      onChange={handleFgForeignChange}
                      disabled={isReadOnly}
                    />
                  </td>
                <td className="erCellStyle">
                  <CustomInput 
                    type="resident"
                    width={180} 
                    value={noResident}
                    placeholder="주민번호를 입력해주세요."
                    onChange={(e) => {
                      setNoResident(e.target.value);
                    }}
                    onBlur={() => {
                      handleUpdateEmp("noResident", clickCdEmp, noResident);
                    }}
                    readOnly={isReadOnly}
                  />
                </td>
                <td className="erCellStyle">
                  <CustomSelect
                    className="erSelectBox"
                    options={[
                      { value: "0", label: "남자" },
                      { value: "1", label: "여자" },
                    ]}
                    value={genderFromNoResident(noResident)}
                    disabled
                  />
                </td>
              </tr>
              <tr>
                <th className="erHeaderStyle">주소</th>
                <td className="erCellStyle">
                  <CustomInput 
                    width={180} 
                    value={noPost} 
                    setZonecode={setNoPost} 
                    readOnly 
                    />
                </td>
                <td className="erCellStyle" colSpan="2">
                  <CustomInput 
                    width={368} 
                    value={nmAddress} 
                    setAddress={setNmAddress} 
                    readOnly 
                  />
                </td>
                <td className="erCellStyle">
                  <CustomButton 
                    text="검색" 
                    color="black" 
                    onClick={handleAddressButtonClick} 
                    disabled={isReadOnly}
                    />
                </td>
              </tr>
              <tr>
                <th className="erHeaderStyle">상세주소</th>
                <td className="erCellStyle" colSpan="5">
                  <CustomInput 
                    width={845} 
                    value={dcAddress} 
                    onChange={(e) => {
                      setDcAddress(e.target.value);
                    }}
                    onBlur={() => {
                      handleUpdateEmp("dcAddress", clickCdEmp, dcAddress);
                    }}
                    readOnly={isReadOnly}
                  />
                </td>
              </tr>
              <tr>
                <th className="erHeaderStyle">전화번호</th>
                <td className="erCellStyle">
                  <CustomInput 
                    type="number"
                    width={180} 
                    value={noPhone1} 
                    onChange={(e) => setNoPhone1(e.target.value)}
                    onBlur={handlePhoneUpdate}
                    maxLength={3}
                    readOnly={isReadOnly}
                  />
                </td>
                <td className="erCellStyle">
                  <CustomInput 
                    type="number"
                    width={180} 
                    value={noPhone2} 
                    onChange={(e) => setNoPhone2(e.target.value)}
                    onBlur={handlePhoneUpdate}
                    maxLength={4}
                    readOnly={isReadOnly}
                  />
                </td>
                <td className="erCellStyle">
                  <CustomInput 
                    type="number"
                    width={180} 
                    value={noPhone3} 
                    onChange={(e) => setNoPhone3(e.target.value)}
                    onBlur={handlePhoneUpdate}
                    maxLength={4}
                    readOnly={isReadOnly}
                  />
                </td>
              </tr>
              <tr>
                <th className="erHeaderStyle">휴대폰번호</th>
                <td className="erCellStyle">
                  <CustomInput 
                    type="number"
                    width={180} 
                    value={noMobilePhone1} 
                    onChange={(e) => setNoMobilePhone1(e.target.value)}
                    onBlur={handleMobilePhoneUpdate}
                    maxLength={3}
                    readOnly={isReadOnly}
                  />
                </td>
                <td className="erCellStyle">
                  <CustomInput 
                    type="number"
                    width={180} 
                    value={noMobilePhone2} 
                    onChange={(e) => setNoMobilePhone2(e.target.value)}
                    onBlur={handleMobilePhoneUpdate}
                    maxLength={4}
                    readOnly={isReadOnly}
                  />
                </td>
                <td className="erCellStyle">
                  <CustomInput 
                    type="number"
                    width={180} 
                    value={noMobilePhone3} 
                    onChange={(e) => setNoMobilePhone3(e.target.value)}
                    onBlur={handleMobilePhoneUpdate}
                    maxLength={4}
                    readOnly={isReadOnly}
                  />
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
                    <CustomInput 
                      type="email"
                      width={180} 
                      value={username} 
                      onChange={(e) => setUsername(e.target.value)} 
                      onBlur={handleUsernameUpdate}
                      readOnly={isReadOnly}
                    />
                  </div>
                </td>
                <td className="erCellStyle">
                  <div className="erEmailCell">
                    <div className="erAtSign">@</div>
                    <CustomInput
                      className="erInputCell"
                      width={160}
                      value={domainMap[selectedOption] === "직접입력" ? domain : domainMap[selectedOption]}
                      onChange={(e) => setDomain(e.target.value)}
                      onBlur={handleDomainUpdate}
                      readOnly={isReadOnly}
                    />
                  </div>
                </td>
                <td className="erCellStyle">
                  <CustomSelect
                    className="erSelectBox"
                    options={options}
                    value={selectedOption}
                    onChange={handleSelectChange} 
                    disabled={isReadOnly}
                  />
                </td>
              </tr>
              <tr>
                <th className="erHeaderStyle">부서</th>
                <td className="erCellStyle">
                  <CustomModalInput 
                    width={180} 
                    value={noDepartment} 
                    readOnly={isReadOnly}
                    />

                </td>
              </tr>
              <tr>
                <th className="erHeaderStyle">직급</th>
                <td className="erCellStyle">
                  <CustomSelect 
                    className="erSelectBox"
                    options={[{value:"0", label:"기본직급"}]} 
                    disabled={isReadOnly}
                  />
                </td>
                <td className="erCellStyle">
                  <CustomSelect
                    className="erSelectBox"
                    options={[
                      { value: "1", label: "회장" },
                      { value: "2", label: "사장" },
                      { value: "3", label: "부사장" },
                      { value: "4", label: "전무" },
                      { value: "5", label: "상무" },
                      { value: "6", label: "이사" },
                      { value: "7", label: "부장" },
                      { value: "8", label: "수석" },
                      { value: "9", label: "차장" },
                      { value: "10", label: "책임" },
                      { value: "11", label: "과장" },
                      { value: "12", label: "선임" },
                      { value: "13", label: "대리" },
                      { value: "14", label: "주임" },
                      { value: "15", label: "사원" },
                      { value: "16", label: "직급없음" },
                    ]}
                    value={noPositionUnique}
                    onChange={handleNoPositionUniqueChange}
                    placeholder="선택"
                    disabled={isReadOnly}
                  />
                </td>
              </tr>
              <tr>
                <th className="erHeaderStyle">퇴사일자</th>
                <td className="erCellStyle">
                  <CustomCalendar 
                    width={180} 
                    value={dtResign} 
                    onChange={(newDate) => handleDateChange("dtResign", newDate)}
                    readOnly={isReadOnly}
                  />
                </td>
              </tr>
              <tr>
                <th className="erHeaderStyle">급여이체은행</th>
                <td className="erCellStyle">
                  <CustomModalInput 
                    width={180} 
                    value={cdBank} 
                    readOnly={isReadOnly}
                    >
                    <h2>은행</h2>
                  </CustomModalInput>
                </td>
                <td className="erCellStyle">
                  <CustomInput 
                    width={180} 
                    value={noAccount} 
                    onChange={(e) => {
                      setNoAccount(e.target.value);
                    }}
                    onBlur={() => {
                      handleUpdateEmp("noAccount", clickCdEmp, noAccount);
                    }}
                    placeholder="계좌번호를 입력해주세요."
                    readOnly={isReadOnly}
                  />
                </td>
                <td className="erCellStyle">
                  <CustomInput 
                    width={180} 
                    value={nmAccountHolder || nmEmp}
                    onChange={(e) => {
                      const value = e.target.value;
                      setNmAccountHolder(value === "" ? null : value);
                    }}
                    onBlur={() => {
                      handleUpdateEmp("nmAccountHolder", clickCdEmp, nmAccountHolder);
                    }}
                    readOnly={isReadOnly}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 모달 창 */}
        {openPostcode && (
          <div className="erModalOverlay" onClick={closeModal}>
            <div className="erModalContent" onClick={(e) => e.stopPropagation()}>
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
