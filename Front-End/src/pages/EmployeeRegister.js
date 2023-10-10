import React, { useState, useCallback, useMemo, useEffect, useRef } from "react";
import Setting from "../images/pages/common/setting.png";
// import Calc from "../images/pages/common/calc.png";
import Print from "../images/pages/common/print.png";
import Delete from "../images/pages/common/delete.png";

import "../styles/css/pages/EmployeeRegister.css";
import PageHeaderIconButton from "../components/PageHeader/PageHeaderIconButton";
import PageHeaderName from "../components/PageHeader/PageHeaderName";
import PageHeaderTextButton from "../components/PageHeader/PageHeaderTextButton";
import CustomCalendar from "../components/Contents/CustomCalendar";
import CustomInput from "../components/Contents/CustomInput";
import Input from "../components/Contents/InputTest";
import CustomSelect from "../components/Contents/CustomSelect";
import CustomButton from "../components/Contents/CustomButton";
import DaumPostcode from 'react-daum-postcode';
import Table from "../components/TablesLib/Table";
import CustomModalInput from "../components/Contents/CustomModalInput";
import useApiRequest from "../components/Services/ApiRequest";
import moment from "moment";
import SweetAlert from "../components/Contents/SweetAlert";
import CustomModal from "../components/Contents/CustomModal";
import CustomRadio from "../components/Contents/CustomRadio";
import QuickMenu from "../components/PageHeader/QuickMenu";

const EmployeeRegister = () => {
  
  const apiRequest = useApiRequest();
  const [isReadOnly, setIsReadOnly] = useState(true); // 모든 입력 필드가 readOnly 상태인지 아닌지 확인

  // 모달창 관련 상태관리
  const [openPostcode, setOpenPostcode] = useState(false); // 카카오 API 모달창 상태관리
  const [openSortSearch, setOpenSortSearch] = useState(false); // 데이터정렬 모달창 상태관리
  // const [openSettingModal, setOpenSettingModal] = useState(false); // 세팅 모달창 상태관리
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false); // 부서 모달창 상태관리
  const [isBankModalOpen, setIsBankModalOpen] = useState(false); // 은행 모달창 상태관리
  const [maskResident, setMaskResident] = useState(false); // 주민번호 마스킹 상태관리

  const [empList, setEmpList] = useState([]); // 첫번째 테이블의 사원정보들 관리
  const [clickCdEmp, setClickCdEmp] = useState(""); // table에서 행 클릭시 cdEmp 저장

  // sweetAlert 상태 관리
  const [showAlert, setShowAlert] = useState(false); // 삭제 버튼 sweetAlert 상태관리
  const [showDeleteSuccessAlert, setShowDeleteSuccessAlert] = useState(false);
  const [showAlertMessage, setShowAlertMessage] = useState(false); // 체크 안하고 삭제 버튼 클릭시 sweetAlert 상태관리
  const [showInsertSuccessAlert, setShowInsertSuccessAlert] = useState(false); // 사원등록 성공 sweetAlert 상태관리
  const [showMaskAlert, setShowMaskAlert] = useState(false); // 별표 사용설정 클릭시 알림 상태 관리

   // 삭제시 에러에 관한 sweetAlert 상태 관리
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showMultipleRowsAlert, setShowMultipleRowsAlert] = useState(false);

  const [checkedRows, setCheckedRows] = useState([]); // 각 행의 체크박스 상태를 저장하는 상태
  const [showInsertRow, setShowInsertRow] = useState(false); // 테이블의 insertRow의 상태
  const [initialValues, setInitialValues] = useState({}); // 업데이트 요청을 위한 초기값 상태관리
  const [isValid, setIsValid] = useState(null); // 주민번호 유효성 검사 결과 저장 상태관리
  
  // 강제로 컴포넌트를 재마운트
  const [tableKey, setTableKey] = useState(Date.now());
  
  const [insertData, setInsertData] = useState({ cdEmp: "", nmEmp: "", noResident: "" }); // 현재 편집 중인 insert 데이터 상태관리
  const [latestCdEmp, setLatestCdEmp] = useState(""); // insert 동작시 cdEmp값 저장
  const [inserted, setInserted] = useState(false); // insert 함수 한 번 실행하게 해주는 상태관리
  const [isEmpListUpdated, setIsEmpListUpdated] = useState(false); // 사원 목록이 업데이트되었는지 확인
  const [isCdEmpUpdated, setCdEmpUpdated] = useState(false); // cdEmp 업데이트 상태관리

  const [employeeData, setEmployeeData] = useState({
    cdEmp: "",
    nmEmp: "",
    noResident: "",
    fgForeign: "",
    dtHire: "",
    noPost: "",
    nmAddress: "",
    dcAddress: "",
    nmAccountHolder: "",
    noDepartment: "",
    cdBank: "",
    noPhone1: "",
    noPhone2: "",
    noPhone3: "",
    noMobilePhone1: "",
    noMobilePhone2: "",
    noMobilePhone3: "",
    nmEmail: "",
    username: "",  // 이메일 주소의 @ 앞 부분
    domain: "",    // 이메일 주소의 @ 뒷 부분
    selectedOption: "0",
    dtResign: "",
    noAccount: "",
    noPositionUnique: "",
    nmNationality: "",
    idMessenger: "",
    fgSalaryGrade: "",
    comment: "",
  });

  // 컴포넌트가 처음 마운트될 때 handleGetEmpList 실행
  useEffect(() => {
    handleGetEmpList();
  }, []);

  // 추가하기 버튼 클릭시 데이터리셋
  const resetEmployeeData = () => {
    setEmployeeData({
      cdEmp: "",
      nmEmp: "",
      noResident: "",
      fgForeign: "",
      dtHire: "",
      noPost: "",
      nmAddress: "",
      dcAddress: "",
      nmAccountHolder: "",
      noDepartment: "",
      cdBank: "",
      noPhone1: "",
      noPhone2: "",
      noPhone3: "",
      noMobilePhone1: "",
      noMobilePhone2: "",
      noMobilePhone3: "",
      nmEmail: "",
      username: "",
      domain: "",
      selectedOption: "0",
      dtResign: "",
      noAccount: "",
      noPositionUnique: "",
      nmNationality: "",
      idMessenger: "",
      fgSalaryGrade: "",
      comment: "",
    });
    setIsReadOnly(true); // readOnly 상태를 true로 설정
    setIsValid(null); // 주민번호 유효성 상태 초기화
    setNmDept("");
    setNmBank("");
    // setFgSalaryGrade("");
  }

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

    if (selectedValue === undefined || newDomain === undefined) {
      return;
    }

    // 직접입력일 때 미리 빈 문자열로 설정
    const finalDomain = newDomain === "직접입력" ? "" : newDomain;

    setEmployeeData(prevState => {
        const emailToUpdate = newDomain && prevState.username 
                              ? `${prevState.username}@${finalDomain}` 
                              : prevState.username;

        handleUpdateEmp("nmEmail", clickCdEmp, emailToUpdate);

        return {
            ...prevState,
            selectedOption: selectedValue,
            domain: finalDomain,
            nmEmail: emailToUpdate
        };
    });
  };

  // username만 업데이트하는 함수
  const handleUsernameUpdate = () => {
    
    if (employeeData.username === undefined) {
      return;
    }

    setEmployeeData(prevState => {
        let updatedDomain = prevState.domain;
        let updatedSelectedOption = prevState.selectedOption;

        // username이 null 혹은 빈 문자열일 때 domain도 비워진다
        if (!prevState.username || prevState.username === '') {
            updatedDomain = '';
            updatedSelectedOption = '0'; // 직접입력으로 설정
        }

        const email = updatedDomain ? `${prevState.username || ''}@${updatedDomain}` : (prevState.username || '');

        handleUpdateEmp("nmEmail", clickCdEmp, email);
        return { ...prevState, nmEmail: email, domain: updatedDomain, selectedOption: updatedSelectedOption };
    });
  };

  // domain만 업데이트하는 함수
  const handleDomainUpdate = (newDomain) => {

    if (newDomain === undefined) {
      return;
    }

    const updatedDomain = newDomain || ''; // newDomain이 null이나 undefined인 경우 빈 문자열을 사용
    const email = (employeeData.username && updatedDomain !== "직접입력")
        ? `${employeeData.username}@${updatedDomain}` 
        : (employeeData.username || '');
    
    handleUpdateEmp("nmEmail", clickCdEmp, email);
    setEmployeeData(prevState => ({
        ...prevState,
        domain: updatedDomain,
        nmEmail: email
    }));
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
      setEmployeeData(prevState => ({
        ...prevState,
        fgForeign: selectedValue
      }));
      handleUpdateEmp("fgForeign", clickCdEmp, selectedValue);
    }
  };

  // 직급 업데이트 함수
  const handleNoPositionUniqueChange = (event) => {
    const selectedValue = event.target.value;
    console.log("Selected option value:", selectedValue);
  
    if (selectedValue !== undefined) {
      setEmployeeData(prevState => ({
        ...prevState,
        noPositionUnique: selectedValue
      }));
      handleUpdateEmp("noPositionUnique", clickCdEmp, selectedValue);
    }
  };

  // 호봉 업데이트 함수
  const handleFgSalaryGradeChange = (event) => {
    let selectedValue = event.target.value;
    console.log("Selected salary grade value:", selectedValue);

    if (selectedValue === "null") {
        selectedValue = null;
    }

    if (selectedValue !== undefined) {
        setEmployeeData(prevState => ({
            ...prevState,
            fgSalaryGrade: selectedValue
        }));
        handleUpdateEmp("fgSalaryGrade", clickCdEmp, selectedValue);
    }
  };


  // 성별 자동입력 함수
  const genderFromNoResident = (noResident) => {

    const genderDigit = noResident.split('-')[1]?.[0];
    
    let result = null;
    if (genderDigit === '2' || genderDigit === '4' || genderDigit === '6') {
      result = '여자';
    } else {
      result = '남자';
    }
    
    return result;
  };

  // 주민번호 유효성 검사 로직
  const isValidResidentNumber = (number) => {
    if (!number || typeof number !== "string") return false;
    if (number.length !== 14) return false;
    if (number[6] !== '-') return false;  // 7번째 문자가 하이픈인지 검증
  
    const birth = number.substring(0, 6);
    const gender = number[7];  // 위치를 7로 변경
  
    // 생년월일 검증
    const year = parseInt(birth.substring(0, 2), 10);
    const month = parseInt(birth.substring(2, 4), 10);
    const day = parseInt(birth.substring(4, 6), 10);
  
    if (month < 1 || month > 12) return false;
  
    let maxDay;
    switch (month) {
      case 2:
        maxDay = ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) ? 29 : 28; // 윤년 계산
        break;
      case 4:
      case 6:
      case 9:
      case 11:
        maxDay = 30;
        break;
      default:
        maxDay = 31;
    }

    if (day < 1 || day > maxDay) return false;

    // 성별 번호 검증
    if (!['1', '2', '3', '4', '5', '6', '7', '8'].includes(gender)) return false;
  
    return true;
};


  // 주소검색 모달 열기
  const handleAddressButtonClick = () => {
    setOpenPostcode(true);
  }
  
  const handleAddressSelect = async (data) => {
    console.log(`
        우편번호: ${data.zonecode}
        주소: ${data.address}
    `);

    // 주소와 우편번호를 업데이트합니다.
    try {
        await handleUpdateEmp("noPost", clickCdEmp, data.zonecode);
        await handleUpdateEmp("nmAddress", clickCdEmp, data.address);
        console.log("주소와 우편번호 업데이트 성공");

        // employeeData 상태 업데이트
        setEmployeeData(prevState => ({
            ...prevState,
            noPost: data.zonecode,
            nmAddress: data.address
        }));
    } catch (error) {
        console.error("주소와 우편번호 업데이트 실패", error);
    }

    setOpenPostcode(false); // 모달 닫기
  };

  // checkedRows useEffect
  useEffect(() => {
    console.log("checkedRows changed : " + checkedRows);
  }, [checkedRows]);

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

  // 주소검색 모달 닫기
  const closeModal = () => {
    setOpenPostcode(false);
  }

  // 달력 하이픈 제거 함수
  const handleDateChange = (field, newDate) => {
    const formattedDateForUI = moment(newDate).format('YYYY-MM-DD');
    const formattedDateForDB = moment(newDate).format('YYYYMMDD'); // '-' 제거

    // employeeData 상태 업데이트
    setEmployeeData(prevState => ({
        ...prevState,
        [field]: formattedDateForUI
    }));

    handleUpdateEmp(field, clickCdEmp, formattedDateForDB); // '-'가 제거된 형태로 전달
    console.log("새로 선택한 날짜 : " + formattedDateForUI);
  };

  // 전화번호 하나로 합치기
  const handlePhoneUpdate = () => {
    const { noPhone1, noPhone2, noPhone3 } = employeeData;

    // 전화번호의 각 부분이 모두 비어있거나 초기 상태일 때 업데이트 스킵
    if ((noPhone1 === undefined) && (noPhone2 === undefined) && (noPhone3 === undefined)) {
    return;
    }

    let fullPhone = "";
    if (noPhone1 || noPhone2 || noPhone3) {
        fullPhone = `${noPhone1 || ''}-${noPhone2 || ''}-${noPhone3 || ''}`;
    }

    handleUpdateEmp("noPhone", clickCdEmp, fullPhone);
    
    setEmployeeData(prevState => ({
        ...prevState,
        noPhone: fullPhone
    }));
  };

  // 휴대폰번호 하나로 합치기
  const handleMobilePhoneUpdate = () => {
    const { noMobilePhone1, noMobilePhone2, noMobilePhone3 } = employeeData;

    // 휴대폰 번호의 각 부분이 모두 비어있거나 초기 상태일 때 업데이트 스킵
    if ((noMobilePhone1 === undefined) && (noMobilePhone2 === undefined) && (noMobilePhone3 === undefined)) {
      return;
    }

    let fullMobilePhone = "";
    if (noMobilePhone1 || noMobilePhone2 || noMobilePhone3) {
      fullMobilePhone = `${noMobilePhone1 || ''}-${noMobilePhone2 || ''}-${noMobilePhone3 || ''}`;
    }

    handleUpdateEmp("noMobilePhone", clickCdEmp, fullMobilePhone);
    
    setEmployeeData(prevState => ({
      ...prevState,
      noMobilePhone: fullMobilePhone
    }));
  };

  // erGrid useMemo data
  const data = useMemo(
    () =>
      empList.map((emp) => ({
        checkbox: false,
        code: emp.cdEmp,
        employee: emp.nmEmp,
        resident: emp.noResident,
        onRowClick: () => (emp.cdEmp),
      })),
    [empList]
  );

  const clickCdEmpRef = useRef(null);
  const [sortOrder, setSortOrder] = useState("code"); // default 정렬 순서
  const [sortedDataEmp, setSortedDataEmp] = useState(data); // 데이터의 현재 정렬된 버전 상태 관리

  // erGrid useMemo columns
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

          return (
            <input
              type="checkbox"
              value={""}
              checked={checkedRows.includes(original?.code)}
              onChange={() => handleRowCheckboxClick(original?.code)}
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

          const handleInputChangeCdEmp = (e) => {
            // 먼저, 공백을 제거하고 모든 문자를 대문자로 변경합니다.
            let cleanedValue = e.target.value.replace(/\s+/g, '').toUpperCase();
          
            // 영어와 숫자를 제외한 모든 문자를 제거합니다.
            cleanedValue = cleanedValue.replace(/[^A-Z0-9]/g, '');
          
            if (cleanedValue.length <= 8) {
              setInputValue(cleanedValue);
              setChanged(true);
              setInsertData(prev => ({ ...prev, cdEmp: cleanedValue }));
            }
          };

          const tableEmpCodeClick = (e) => {
            console.log("*************************** Code 클릭");
          
            if (original && original.code != null) {
              console.log("*************************** original.code : " + original.code);
          
              if (original.code !== clickCdEmpRef.current) {
                handleGetSingleEmp(original.code);
              } else {
                console.log("code 값이 동일하니 API 요청 안함");
              }
            }
          };

          const handleInputOnBlurCdEmp = async (e) => {
            console.log("handleInputOnBlurCdEmp 함수가 호출되었습니다.");

            const inputValue = e.target.value?.trim();

            if (!inputValue || (original && inputValue === original.code) || !inputValue.trim() || !changed) {
                console.log("*********************************** onChange 없으니 종료");
                return;
            }

            setChanged(false);

            try {
              const exists = await checkCdEmpExists(inputValue);

              // Code의 중복을 체크
              if (exists) {
                console.log("이미 존재하는 Code 입니다. focus 이동합니다~~");
                const upperCaseInputValue = inputValue.toUpperCase();
                const element = document.getElementById(`focusOn_${upperCaseInputValue}`);

                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  element.focus();
                  
                  // cdEmp 값을 사용하여 사원의 정보 가져오기
                  handleGetSingleEmp(upperCaseInputValue);
                }

                // 원래의 값을 inputValue로 되돌린다.
                setInputValue(original.code);
                return;
              }

              // 위에서 중복 체크를 통과했다면, 업데이트 처리
              if (original && original.code) {
                console.log("original.code의 값 : " + original.code);
                const isUpdated = await handleUpdateEmp("cdEmp", original.code, inputValue);
                
                if (isUpdated) {
                    await handleGetEmpList(); // 이 부분을 await로 수정
                    setCdEmpUpdated(inputValue);  // inputValue를 상태에 저장
                }
              }
            } catch (error) {
            console.error("An error occurred:", error);
            }
            
            setInsertData(prevState => {
              const updatedState = { ...prevState, cdEmp: inputValue };

              if (updatedState.cdEmp && updatedState.nmEmp && updatedState.noResident.length === 14) {
                  handleInsertEmp(updatedState.cdEmp, updatedState.nmEmp, updatedState.noResident);
              }

              return updatedState;
            });

          };

          const handleKeyDown = (e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleInputOnBlurCdEmp(e);

              // 현재 포커스 된 요소의 다음 요소로 포커스를 이동합니다.
              const formElements = Array.from(document.querySelectorAll('input, button, select, textarea'));
              const currentIndex = formElements.indexOf(e.target);
              const nextElement = formElements[currentIndex + 1];
              if (nextElement) {
                nextElement.focus();
              }
            }
          };

          return (
            <>
              <Input
                value={inputValue || ""}
                onChange={handleInputChangeCdEmp}
                onClick={tableEmpCodeClick}
                className={"doubleLine"}
                onBlur={handleInputOnBlurCdEmp}
                onKeyDown={handleKeyDown}
              />
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

          const handleInputChangeNmEmp = (e) => {
            const cleanedValue = e.target.value.replace(/\s+/g, '');
          
            // 정규식으로 한글, 영문, 숫자만 확인
            const regex = /^[ㄱ-힣a-zA-Z0-9]*$/;
          
            if (cleanedValue.length <= 10 && regex.test(cleanedValue)) {
              setInputValue(cleanedValue);
              setChanged(true);
              setInsertData(prev => ({ ...prev, nmEmp: cleanedValue }));
            }
          };

          const tableEmpNmClick = (e) => {
            console.log("*************************** 사원명 클릭");
          
            if (original && original.code != null) {
              console.log("*************************** original.code : " + original.code);
          
              if (original.code !== clickCdEmpRef.current) {
                handleGetSingleEmp(original.code);
              } else {
                console.log("code 값이 동일하니 API 요청 안함");
              }
            }
          };

          const handleInputOnBlurNmEmp = async (e) => {
            const inputValue = e.target.value?.trim();

            setInsertData((prevData) => ({ ...prevData, nmEmp: inputValue }));

            if (!changed) {
              console.log("*********************************** onChange 없으니 종료");
              return;
            }
          
            setChanged(false);
          
            if (original && original.code) {
              // 기존의 데이터일 경우, 업데이트 동작 수행
              handleUpdateEmp("nmEmp", original.code, inputValue);
            
              setEmployeeData(prevState => ({ ...prevState, nmEmp: inputValue }));
            }

            setInsertData(prevState => {
              const updatedState = { ...prevState, nmEmp: inputValue };

              if (updatedState.cdEmp && updatedState.nmEmp && updatedState.noResident.length === 14) {
                  handleInsertEmp(updatedState.cdEmp, updatedState.nmEmp, updatedState.noResident);
              }

              return updatedState;
            });
          };

          const handleKeyDown = (e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleInputOnBlurNmEmp(e);

              // 현재 포커스 된 요소의 다음 요소로 포커스를 이동합니다.
              const formElements = Array.from(document.querySelectorAll('input, button, select, textarea'));
              const currentIndex = formElements.indexOf(e.target);
              const nextElement = formElements[currentIndex + 1];
              if (nextElement) {
                nextElement.focus();
              }
            }
          };

        return (
            <Input
              value={inputValue || ""}
              onChange={handleInputChangeNmEmp}
              onClick={tableEmpNmClick}
              className={"doubleLine"}
              onBlur={handleInputOnBlurNmEmp}
              onKeyDown={handleKeyDown}
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

          const maskedValue = maskResidentValue(inputValue);

          const handleInputChangeNoResident = (e) => {
            const newInputValue = e.target.value;
        
            setInputValue(newInputValue);
            setChanged(true);
            setIsValid(null);
            
            setInsertData(prevState => ({ ...prevState, noResident: newInputValue }));
          };

          const tableNoResidentClick = (e) => {
            console.log("*************************** 주민번호 클릭");
          
            if (original && original.code != null) {
              console.log("*************************** original.code : " + original.code);
          
              if (original.code !== clickCdEmpRef.current) {
                handleGetSingleEmp(original.code);
              } else {
                console.log("code 값이 동일하니 API 요청 안함");
              }
            }
          };

          const handleInputOnBlurNoResident = async (e) => {
            const inputValue = e.target.value?.trim();
          
            // 아무 값도 입력되지 않았거나 빈 문자열일 경우는 바로 업데이트 진행
            if (!inputValue || inputValue === "") {
              if (original && original.code) {
                  handleUpdateEmp("noResident", original.code, "");
              }
              return;
            }

            // 주민번호의 길이 검사
            if (inputValue.length !== 14) {
              console.log("주민번호는 13자리여야 합니다.");
              return;
            }

            if (!changed) {
                console.log("*********************************** onChange 없으니 종료");
                return;
            }

            setChanged(false);

            // update가 성공하면 우측 erGrid2 부분에도 갱신
            if (original && original.code) {
              const isUpdateSuccess = await handleUpdateEmp("noResident", original.code, inputValue);
              if (isUpdateSuccess) {
                const updatedData = await handleGetSingleEmp(original.code);
                if(updatedData) {
                  setEmployeeData(updatedData);
                }
              }
            }

            setInsertData(prevState => {
              const updatedState = { ...prevState, noResident: inputValue };

              if (!original || !original.code && updatedState.cdEmp && updatedState.nmEmp && updatedState.noResident.length === 14) {
                  handleInsertEmp(updatedState.cdEmp, updatedState.nmEmp, updatedState.noResident);
              }

              return updatedState;
            });
          };

          const handleKeyDown = (e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleInsertEmp();

              // 현재 포커스 된 요소의 다음 요소로 포커스를 이동합니다.
              const formElements = Array.from(document.querySelectorAll('input, button, select, textarea'));
              const currentIndex = formElements.indexOf(e.target);
              const nextElement = formElements[currentIndex + 1];
              if (nextElement) {
                nextElement.focus();
              }
            }
          };

          return (
            <Input
            type={"resident"}
            value={maskedValue}
            onChange={handleInputChangeNoResident}
            onClick={tableNoResidentClick}
            className={"doubleLine"}
            onBlur={handleInputOnBlurNoResident}
            readOnly={maskResident} // 마스킹 상태일 경우 읽기 전용으로 설정
            onKeyDown={handleKeyDown}
            />
          );
        },
      },
    ], [checkedRows, maskResident]
  );

  // Insert
  const handleInsertEmp = async (codeValue, employeeValue, noResidentValue) => {
    console.log("handleInsertEmp 실행 *********************");

    // cdEmp, nmEmp, 또는 주민번호가 null이거나 공백일 경우 함수를 종료합니다.
    if (!codeValue || codeValue.trim() === "" || !employeeValue || employeeValue.trim() === "" || !noResidentValue || noResidentValue.trim() === "") {
      console.log("cdEmp, nmEmp 또는 주민번호가 없어서 insert를 중단합니다.");
      return;
    }

    try {
      const responseData = await apiRequest({
        method: "POST",
        url: "/api2/er/postEmpData",
        data: {
          cdEmp: codeValue,
          nmEmp: employeeValue,
          noResident: noResidentValue,
        },
      });

      console.log("****************************** handleInsertEmp");
      console.log(responseData);
      await handleGetEmpList();
      setInserted(true);
      setShowInsertSuccessAlert(true);
      setLatestCdEmp(codeValue);
      setInsertData({ cdEmp: "", nmEmp: "", noResident: "" });
      setInserted(false);

      setShowInsertRow(false);
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

    const initial = initialValues[columnName];
    console.log("columnName : " + columnName);
    console.log('initial : ' +  initial);
    console.log('inputValue : ' +  inputValue);

    // 만약 초기값이 undefined 이거나 inputValue가 비어 있으면 업데이트를 중단
    if ((initial === undefined && !inputValue) || initial === inputValue) {
      return;
    }

    console.log("********************* handleUpdateEmp 실행 *********************");
    console.log("columnName : " + columnName, "clickCdEmp : " + clickCdEmp, "inputValue : " + inputValue);

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

      // API 호출이 성공한 경우 초기값 업데이트
      console.log("responseData : " + responseData);
      if (responseData === 1) {
        setInitialValues((prev) => ({ ...prev, [columnName]: inputValue }));
        return true;
      }
      return false;
    } catch (error) {
      console.error("API 요청 실패:", error);
    }
  };

  // 사용하는 곳에서는 다음과 같이 초기값 설정
  useEffect(() => {
    if (!initialValues.noResident) {
        setInitialValues((prev) => ({ ...prev, "noResident": employeeData.noResident }));
    }
  }, []);


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
      console.log("API Response:", responseData);
      console.log("Updated empList after setEmpList:", empList);
      console.log("responseData.length : " + responseData.length);

      // // 데이터 로딩 후 첫 번째 항목에 포커스 주기
      // if (responseData && responseData.length > 0) {
      //   setTimeout(() => {
      //       const firstRowElement = document.querySelector("[id^='focusOn_']");
      //       if (firstRowElement) {
      //           firstRowElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      //           firstRowElement.focus();
      //       }
      //   }, 10);
      // }

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

      if (!responseData) {
        console.warn("응답 데이터가 없습니다.");
        return;
      }

    const updatedData = {
      ...employeeData, // 기존 데이터 복사
      cdEmp: responseData.cdEmp || "",
      nmEmp: responseData.nmEmp || "",
      noResident: responseData.noResident || "",
      fgForeign: responseData.fgForeign || "",
      dtHire: responseData.dtHire || "",
      noPost: responseData.noPost || "",
      nmAddress: responseData.nmAddress || "",
      dcAddress: responseData.dcAddress || "",
      nmAccountHolder: responseData.nmAccountHolder || "",
      noDepartment: responseData.noDepartment || "",
      cdBank: responseData.cdBank || "",
      noPhone: responseData.noPhone || "",
      noPhone1: (responseData.noPhone || "").split('-')[0] || "",
      noPhone2: (responseData.noPhone || "").split('-')[1] || "",
      noPhone3: (responseData.noPhone || "").split('-')[2] || "",
      noMobilePhone: responseData.noMobilePhone || "",
      noMobilePhone1: (responseData.noMobilePhone || "").split('-')[0] || "",
      noMobilePhone2: (responseData.noMobilePhone || "").split('-')[1] || "",
      noMobilePhone3: (responseData.noMobilePhone || "").split('-')[2] || "",
      nmEmail: responseData.nmEmail || "",
      username: (responseData.nmEmail || "").split('@')[0] || "",
      domain: (responseData.nmEmail || "").split('@')[1] || "",
      selectedOption: "0",
      dtResign: responseData.dtResign || "",
      noAccount: responseData.noAccount || "",
      noPositionUnique: responseData.noPositionUnique || "",
      nmNationality: responseData.nmNationality || "",
      idMessenger: responseData.idMessenger || "",
      fgSalaryGrade: responseData.fgSalaryGrade || "",
      comment: responseData.comment || "",
    };

    // 전화번호 처리
    const phoneParts = (responseData.noPhone || "").split('-');
    if (phoneParts.length === 3) {
      const [noPhone1, noPhone2, noPhone3] = phoneParts;
      Object.assign(updatedData, {
        noPhone1,
        noPhone2,
        noPhone3,
      });
    } else {
      Object.assign(updatedData, {
        noPhone1: "",
        noPhone2: "",
        noPhone3: "",
      });
    }

    // 휴대폰번호 처리
    const mobilePhoneParts = (responseData.noMobilePhone || "").split('-');
    if (mobilePhoneParts.length === 3) {
      const [noMobilePhone1, noMobilePhone2, noMobilePhone3] = mobilePhoneParts;
      Object.assign(updatedData, {
        noMobilePhone1,
        noMobilePhone2,
        noMobilePhone3,
      });
    } else {
      Object.assign(updatedData, {
        noMobilePhone1: "",
        noMobilePhone2: "",
        noMobilePhone3: "",
      });
    }

    // 이메일 처리
    const [username, domain] = (responseData.nmEmail || "").split('@');
    Object.assign(updatedData, {
      username: username || "",
      domain: domain || "",
    });

    // 상태 업데이트
    setEmployeeData(updatedData);

    // 유효성 검사
    const residentValid = isValidResidentNumber(updatedData.noResident);
    setIsValid(residentValid);
    console.log("(유효 = true / 유효x = false) residentValid : " + residentValid);

    // 초기값도 같은 데이터로 업데이트
    setInitialValues(updatedData);
    
    updateNmDeptByCode(responseData.noDepartment);
    updateNmBankByCode(responseData.cdBank);

    setClickCdEmp(cdEmp);
    clickCdEmpRef.current = cdEmp;
    
    } catch (error) {
        console.error("api 요청 실패:", error);
    }

      setIsReadOnly(false);
  };

  const empListRef = useRef(empList);

  useEffect(() => {
      empListRef.current = empList;
  }, [empList]);

  // Delete (체크된 행만 삭제)
  const handleDeleteEmp = async () => {
    if (checkedRows.length === 0) {
      setErrorMessage("선택된 사원이 없습니다.");
      setShowErrorAlert(true);
      return;
  }

    try {
        const responseData = await apiRequest({
            method: "POST",
            url: "/api2/er/deleteEmpData",
            data: {
                selectedEmpCodes: checkedRows,
            },
        });

        if (responseData && responseData.deleted) {
            console.log("삭제 성공임다******************************");
            // 삭제 성공한 사원 코드를 제외하고 업데이트
            const updatedEmpList = empListRef.current.filter(emp => !checkedRows.includes(emp.cdEmp));
            console.log(empList);
            console.log(updatedEmpList);
            setEmpList(updatedEmpList);
            setCheckedRows([]);
            setShowDeleteSuccessAlert(true);
          } else {
            alert("삭제 실패");
          }
    } catch (error) {
      console.error("API 요청 실패:", error);
      if (error.response && error.response.status === 409) {
        setErrorMessage("이미 사용 중인 사원코드이므로 삭제할 수 없습니다. 사용 중인 메뉴명 : " + Object.keys(error.response.data).join(", "));
        setShowErrorAlert(true);
      }
    }
  };

  // 주민번호 별표 사용설정
  const toggleMaskResident = () => {
    setMaskResident(prev => {
      // maskResident 상태가 true에서 false로 변경될 때만 얼럿을 보여줍니다.
      if (!prev) {
        setShowMaskAlert(true);
      }
      return !prev;
    });
  }

  // 주민번호 마스킹처리
  const maskResidentValue = (value) => 
    value
        ? value.slice(0, 6) + (maskResident ? '-*******' : value.slice(6))
        : '';

  // 모달창 부서 정보
  const [deptList, setDeptList] = useState([]); 
  const [clickModalDeptCode, setClickModalDeptCode] = useState("");
  const [nmDept, setNmDept] = useState("");

  const deptMap = [
    { value: "001", label: "인사부" },
    { value: "002", label: "재무부" },
    { value: "003", label: "영업부" },
    { value: "004", label: "개발부" },
    { value: "005", label: "마케팅부" },
    { value: "006", label: "고객지원부" },
    { value: "007", label: "생산부" },
    { value: "008", label: "구매부" }
  ];

  // 부서 모달창 열기
  const openDeptModal = () => {
    setIsDeptModalOpen(true);
    console.log("(openDeptModal) 버튼 눌렀으니 부서 모달창 엽니다요");
  };
  
  // 부서 모달창 닫기
  const closeDeptModal = () => {
    setIsDeptModalOpen(false);
    console.log("(closeDeptModal) 부서 모달창 닫습니다요");
  };

  // 부서 코드를 이용하여 부서명을 설정하는 함수
  const updateNmDeptByCode = (code) => {
    const matchedDept = deptMap.find(dept => dept.value === code);
    if (matchedDept) {
      setNmDept(matchedDept.label);
    } else {
      setNmDept("");
    }
  }

  // useMemo를 사용해 deptList를 테이블 데이터로 변환
  const dataDept = useMemo(
    () =>
      deptList.map((dept) => ({
        noDepartment: dept.noDepartment,
        nmDepartment: dept.nmDepartment,
      })),
    [deptList],
  );

  const columnsDept = useMemo(
    () => [
      {
        Header: "Code",
        accessor: "noDepartment",
        id: "noDepartment",
        width: "35%",
        Cell: ({ cell: { value }, row: { original } }) => {
          
          const handleInputClick = (e) => {
            console.log("부서 클릭 이벤트 발생*******************");
            setClickModalDeptCode(original.noDepartment);
          };

          const handleInputDoubleClick = async (e) => {
            await handleDeptDoubleClick(original.noDepartment);
            closeDeptModal();
          };

          return (
            <Input
              value={original?.noDepartment || ""}
              onClick={handleInputClick}
              onDoubleClick={handleInputDoubleClick}
              className={"doubleLine"}
              readOnly={true}
            />
          );
        },
      },
      {
        Header: "부서명",
        accessor: "nmDepartment",
        id: "nmDepartment",
        Cell: ({ cell: { value }, row: { original } }) => {
          
          const handleInputClick = (e) => {
            console.log("부서명 클릭 이벤트 발생*******************");
            setClickModalDeptCode(original.noDepartment);
          };

          const handleInputDoubleClick = async (e) => {
            await handleDeptDoubleClick(original.noDepartment);
            closeDeptModal();
          };

          return (
            <Input
              value={original?.nmDepartment || ""}
              onClick={handleInputClick}
              onDoubleClick={handleInputDoubleClick}
              className={"doubleLine"}
              readOnly={true}
            />
          );
        },
      },
    ],
    [clickCdEmp]
  );

  // 부서전체조회
  const handleGetDeptList = async () => {
    console.log("************************************************* 부서전체조회");
    try {
        const responseData = await apiRequest({
            method: "GET",
            url: "/api2/er/getDeptList",
        });
        setDeptList(responseData);
        console.log("api 이벤트 발생");
        console.log("(handleGetDeptList) responseData.length : " + responseData.length);
    } catch (error) {
        console.error("api 요청 실패:", error);
    }
  };

  // 부서 모달창에서 확인버튼 클릭 했을 때의 동작함수
  const handleDeptConfirmClick = async () => {

    const deptCodeToUpdate = clickModalDeptCode || "";  // 없으면 빈 문자열로 처리

    // 만약 clickModalDeptCode가 빈 문자열이면 부서 정보를 비워버립니다.
    if (!deptCodeToUpdate) {
      setNmDept("");
      await handleUpdateEmp("noDepartment", clickCdEmp, null);
      closeDeptModal();
      return;
    } 

    try {
      await handleUpdateEmp("noDepartment", clickCdEmp, deptCodeToUpdate);
      console.log(`cdEmp ${clickCdEmp}의 부서를 ${deptCodeToUpdate}로 업데이트하였습니다.`);
      closeDeptModal();
    } catch (error) {
      console.error("cdEmp 업데이트 실패:", error);
    }

    updateNmDeptByCode(deptCodeToUpdate);
    setClickModalDeptCode("");
  };

  // 부서 모달창에서 더블클릭 했을 때의 동작함수
  const handleDeptDoubleClick = async (deptCode) => {
    if (!deptCode || deptCode === clickCdEmp) {
      console.log("변경 사항이 없거나, 부서 선택이 되지 않았습니다.");
      return;
    }
  
    try {
      await handleUpdateEmp("noDepartment", clickCdEmp, deptCode);
      console.log(`cdEmp ${clickCdEmp}의 부서를 ${deptCode}로 업데이트하였습니다.`);
    } catch (error) {
      console.error("cdEmp 업데이트 실패:", error);
    }
  
    updateNmDeptByCode(deptCode);
    setClickModalDeptCode("");
  };

  // 모달창 은행 정보
  const [bankList, setBankList] = useState([]);
  const [clickModalBankCode, setClickModalBankCode] = useState("");  
  const [nmBank, setNmBank] = useState("");

  const bankMap = [
    { value: "001", label: "한국은행" },
    { value: "002", label: "산업은행" },
    { value: "003", label: "기업은행" },
    { value: "004", label: "국민은행" },
    { value: "007", label: "수협은행" },
    { value: "008", label: "수출입은행" },
    { value: "011", label: "NH농협은행" },
    { value: "012", label: "농축협은행" },
    { value: "020", label: "우리은행" },
    { value: "023", label: "SC제일은행" }
  ];

  // 은행 모달창 열기
  const openBankModal = () => {
    setIsBankModalOpen(true);
    console.log("(openBankModal) 버튼 눌렀으니 은행 모달창 엽니다요");
  };

  // 은행 모달창 닫기
  const closeBankModal = () => {
    setIsBankModalOpen(false);
    console.log("(closeBankModal) 은행 모달창 닫습니다요");
  };

  // 은행 코드를 이용하여 은행명을 설정하는 함수
  const updateNmBankByCode = (code) => {
    const matchedBank = bankMap.find(bank => bank.value === code);
    if (matchedBank) {
      setNmBank(matchedBank.label);
    } else {
      setNmBank("");
    }
  }

  // useMemo를 사용해 bankList를 테이블 데이터로 변환
  const dataBank = useMemo(
    () =>
      bankList.map((bank) => ({
        cdBank: bank.cdBank,
        nmBank: bank.nmBank,
      })),
    [bankList]
  );

  const columnsBank = useMemo(
    () => [
      {
        Header: "Code",
        accessor: "cdBank",
        id: "cdBank",
        width: "35%",
        Cell: ({ cell: { value }, row: { original } }) => {
          
          const handleInputClick = (e) => {
            console.log("은행 클릭 이벤트 발생*******************");
            setClickModalBankCode(original.cdBank);
          };
    
          const handleInputDoubleClick = async (e) => {
              await handleBankDoubleClick(original.cdBank);
              closeBankModal();
          };

          return (
            <Input
              value={original?.cdBank || ""}
              onClick={handleInputClick}
              onDoubleClick={handleInputDoubleClick}
              className={"doubleLine"}
              readOnly={true}
            />
          );
        },
      },
      {
        Header: "은행명",
        accessor: "nmBank",
        id: "nmBank",
        Cell: ({ cell: { value }, row: { original } }) => {
          
          const handleInputClick = (e) => {
            console.log("은행명 클릭 이벤트 발생*******************");
            setClickModalBankCode(original.cdBank);
          };
    
          const handleInputDoubleClick = async (e) => {
            await handleBankDoubleClick(original.cdBank);
            closeBankModal();
          };

          return (
            <Input
              value={original?.nmBank || ""}
              onClick={handleInputClick}
              onDoubleClick={handleInputDoubleClick}
              className={"doubleLine"}
              readOnly={true}
              onKeyDown={""}
            />
          );
        },
      },
    ],
    [clickCdEmp]
  );

  // 은행전체조회
  const handleGetBankList = async () => {
    console.log("************************************************* 은행전체조회");
    try {
      const responseData = await apiRequest({
        method: "GET",
        url: "/api2/er/getBankList",
      });
      setBankList(responseData);
      console.log("api 이벤트 발생");
      console.log("(handleGetBankList) responseData.length : " + responseData.length);
    } catch (error) {
      console.error("api 요청 실패:", error);
    }
  }

  // 은행 모달창에서 확인버튼 클릭 했을 때의 동작함수
  const handleBankConfirmClick = async () => {
    
    const bankCodeToUpdate = clickModalBankCode || "";  // 없으면 빈 문자열로 처리

    // 만약 clickModalDeptCode가 빈 문자열이면 은행 정보를 비워버립니다.
    if (!bankCodeToUpdate) {
      setNmBank("");
      await handleUpdateEmp("cdBank", clickCdEmp, null);
      closeBankModal();
      return;
    } 

    try {
        await handleUpdateEmp("cdBank", clickCdEmp, bankCodeToUpdate);
        console.log(`cdEmp ${clickCdEmp}의 은행을 ${bankCodeToUpdate}로 업데이트하였습니다.`);
        closeBankModal();
    } catch (error) {
        console.error("cdEmp 은행 업데이트 실패:", error);
    }

    updateNmBankByCode(bankCodeToUpdate);
    setClickModalBankCode("");
  };

  // 은행 모달창에서 더블클릭 했을 때의 동작함수
  const handleBankDoubleClick = async (bankCode) => {
    if (!bankCode || bankCode === clickCdEmp) {
        console.log("변경 사항이 없거나, 은행 선택이 되지 않았습니다.");
        return;
    }

    try {
        await handleUpdateEmp("cdBank", clickCdEmp, bankCode);
        console.log(`cdEmp ${clickCdEmp}의 은행을 ${bankCode}로 업데이트하였습니다.`);
    } catch (error) {
        console.error("cdEmp 업데이트 실패:", error);
    }

    updateNmBankByCode(bankCode);
    setClickModalBankCode("");
  };

  // 라디오 버튼 값 변경 함수
  const handleRadioChange = (event) => {
    setSortOrder(event.target.value);
    console.log("(handleRadioChange) 선택된 정렬 방식:", event.target.value);
  }

  useEffect(() => {
    if (sortOrder === "code") {
      setSortedDataEmp([...data].sort((a, b) => parseInt(a.code, 10) - parseInt(b.code, 10)));
    } else if (sortOrder === "name") {
        setSortedDataEmp([...data].sort((a, b) => a.employee.localeCompare(b.employee)));
    }
  }, [sortOrder, data]);

  // 데이터 정렬 모달창 함수
  const toggleSortSearch = () => {
    setOpenSortSearch(!openSortSearch);
  }

  // 데이터 정렬 함수
  const handleSortDataConfirm = () => {
    setSortOrder(sortOrder);
    toggleSortSearch();
    setTableKey(Date.now());
  };

  // 입사일자 리셋함수
  const handleBackspaceDtHire = (e) => {
    if (e.key === 'Backspace') {
        const field = "dtHire";
        setEmployeeData(prevState => ({
            ...prevState,
            [field]: ""
        }));
        handleUpdateEmp(field, clickCdEmp, "");
        console.log("백스페이스 키 눌림");
        e.preventDefault();
    }
  };

  // 퇴사일자 리셋함수
  const handleBackspaceDtResign = (e) => {
    if (e.key === 'Backspace') {
        const field = "dtResign";
        setEmployeeData(prevState => ({
            ...prevState,
            [field]: ""
        }));
        handleUpdateEmp(field, clickCdEmp, "");
        console.log("백스페이스 키 눌림");
        e.preventDefault();
    }
  };

  // cdEmp가 업데이트된 후 전체 목록과 특정 항목을 다시 가져오는 useEffect
  useEffect(() => {
    const fetchUpdatedData = async () => {
        if (isCdEmpUpdated) {
            setTableKey(Date.now());
            await handleGetSingleEmp(isCdEmpUpdated);

            // 포커스 설정
            const elementToFocus = document.getElementById(`focusOn_${isCdEmpUpdated}`);
            if (elementToFocus) {
                elementToFocus.scrollIntoView({ behavior: 'smooth', block: 'center' });
                elementToFocus.focus();
            }

            setCdEmpUpdated(false);
        }
    };
    fetchUpdatedData();
  }, [isCdEmpUpdated]);


  // erGrid2 주민번호 업데이트시 동작
  useEffect(() => {
    if (isEmpListUpdated) {
      setTableKey(Date.now());
      handleGetSingleEmp(clickCdEmp);
      setIsEmpListUpdated(false);
    }
  }, [isEmpListUpdated]);

  return (
    <>
      <div className="pageHeader">
        <div className="innerBox fxSpace">
          <PageHeaderName text="사원등록" />
          <div className="fxAlignCenter">
            <div className="btnWrapper textBtnWrap">
              <div>
                <PageHeaderTextButton 
                  text="데이터 정렬" 
                  onClick={toggleSortSearch}
                />
                <CustomModal 
                  isOpen={openSortSearch} 
                  onRequestClose={toggleSortSearch} 
                  contentStyle={{ width: "300px", height: "200px" }}
                >
                  <PageHeaderName text="데이터 정렬" />
                  <div style={{ 
                    borderTop: '2.5px solid var(--color-primary-black)', 
                    padding: '3px',
                  }}></div>

                  <div className="test2" style={{ 
                    flex: 1, 
                    display: 'flex', 
                    justifyContent: 'center', 
                    borderTop: '2.5px solid var(--color-primary-black)',
                    border: '1px solid var(--color-primary-gray)',
                    padding: '10px',
                  }}>
                    <CustomRadio
                      name="dataSorting"
                      options={[
                        ["코드순", "code"],
                        ["사원명순", "name"]
                      ]}
                      value={sortOrder}
                      onChange={handleRadioChange}
                    />
                  </div>
                  <div className="test" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CustomButton 
                      backgroundColor={"var(--color-primary-blue)"}
                      color={"var(--color-primary-white)"}
                      onClick={handleSortDataConfirm}
                      text={"확인"}
                    />
                    <CustomButton 
                      backgroundColor={"var(--color-primary-blue)"}
                      color={"var(--color-primary-white)"}
                      onClick={toggleSortSearch}
                      text={"취소"}
                    />
                  </div>
                </CustomModal>
              </div>
              <div>
                <PageHeaderTextButton 
                    text={maskResident ? "별표 사용해제" : "별표 사용설정"}
                    onClick={toggleMaskResident}
                />
              </div>
            </div>
            <div className="iconBtnWrap">
              <PageHeaderIconButton
                btnName="print"
                imageSrc={Print}
                altText="프린트"
                disabled={true}
              />
              <PageHeaderIconButton
                  btnName="delete"
                  imageSrc={Delete}
                  altText="삭제"
                  onClick={() => {
                    if (checkedRows.length === 0) {
                        setShowAlertMessage(true);
                        console.log("체크박스에 체크된 항목이 없습니다.");
                    } else if (checkedRows.length === 1) {
                        setShowAlert(true);
                    } else {
                        setShowMultipleRowsAlert(true);
                        console.log("여러 항목이 선택되었습니다.");
                    }
                }}
            />
                {
                  showMaskAlert && (
                    <SweetAlert
                      text={maskResident ? "마스킹 설정이 활성화되어 사원 등록이 제한됩니다." : "사원 등록을 진행하실 수 있습니다."}
                      confirmText="확인"
                      type="info"
                      onConfirm={() => {
                        setShowMaskAlert(false);
                      }}
                    />
                  )
                }

                {
                  showInsertSuccessAlert && (
                    <SweetAlert
                      text="사원 등록이 완료되었습니다."
                      confirmText="확인"
                      type="success"
                      onConfirm={async () => {
                        setShowInsertSuccessAlert(false);
                        setTableKey(Date.now());
                        await handleGetSingleEmp(latestCdEmp);

                        const element = document.getElementById(`focusOn_${latestCdEmp}`);
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          element.focus();
                        }
                      }}
                    />
                  )
                }

                {showAlert && (
                  <SweetAlert
                    text="정말 삭제하시겠습니까?"
                    showCancel={true}
                    confirmText="확인"
                    type="warning"
                    cancelText="취소"
                    onConfirm={async () => {
                      setShowAlert(false);
                      await handleDeleteEmp();
                    }}
                    onCancel={() => {
                      setShowAlert(false);
                      console.log("삭제 취소");
                    }}
                  />
                )}

                {showDeleteSuccessAlert && (
                    <SweetAlert
                        text="삭제가 완료되었습니다."
                        confirmText="확인"
                        type="success"
                        onConfirm={async () => {
                            setShowDeleteSuccessAlert(false);
                            resetEmployeeData();
                            setTableKey(Date.now());
                            
                            // 여기서 맨 위 항목으로 포커스 이동
                            if (empList && empList.length > 0) {
                            setTimeout(() => {
                                const firstRowElement = document.querySelector("[id^='focusOn_']");
                                if (firstRowElement) {
                                    firstRowElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                    firstRowElement.focus();
                                }
                            }, 310);
                          }
                        }}
                    />
                )}

                {showMultipleRowsAlert && (
                    <SweetAlert
                        text="여러 명을 동시에 삭제할 수 없습니다."
                        confirmText="확인"
                        type="error"
                        onConfirm={async () => {
                            setShowMultipleRowsAlert(false);
                        }}
                    />
                )}

                {showAlertMessage && (
                  <SweetAlert
                    text="체크박스를 선택해주세요."
                    confirmText="확인"
                    type="error"
                    onConfirm={async () => {
                      setShowAlertMessage(false);
                    }}
                  />
                )}

              <QuickMenu />

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
                key={tableKey}
                columns={columns}
                data={sortedDataEmp}
                insertRow={!maskResident}
                showInsertRow={showInsertRow}
                setShowInsertRow={setShowInsertRow}
                onAddButtonClick={resetEmployeeData}
                index={-1}
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
          <div className="erBorderBottomBold">
            <ul className="pageTab">
                <li className="on">기초자료</li>
            </ul>
          </div>

          {/* 탭 내용 테이블 */}
          <div className="erTableContainer">
            <table>
              <tbody>
                <tr>
                  <th className="erHeaderStyle">입사일자</th>
                  <td className="erCellStyle">
                    <CustomCalendar 
                      width={180}
                      value={employeeData.dtHire}
                      onChange={(newDate) => handleDateChange("dtHire", newDate)}
                      disabled={isReadOnly}
                      readOnly={true}
                      onKeyDown={handleBackspaceDtHire}
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
                        value={employeeData.fgForeign}
                        onChange={handleFgForeignChange}
                        disabled={isReadOnly}
                      />
                    </td>
                    <td className="erCellStyle">
                      <CustomInput 
                        type="resident"
                        width={180}
                        value={maskResidentValue(employeeData.noResident)}
                        placeholder="주민번호를 입력해주세요."
                        onChange={(e) => {
                          setEmployeeData(prevState => ({
                              ...prevState,
                              noResident: e.target.value
                          }));
                        }}
                        onBlur={async () => {
                          // 아무 값도 입력되지 않았거나 빈 문자열일 경우는 바로 업데이트 진행
                          if (!employeeData.noResident || employeeData.noResident === "") {
                            await handleUpdateEmp("noResident", clickCdEmp, "");
                            setIsValid(true);
                            return;
                          }

                          // 주민번호의 길이가 14자리가 아닌 경우 업데이트 중지
                          if (employeeData.noResident.length !== 14) {
                            console.log("주민번호는 13자리여야 합니다.");
                            setIsValid(false);
                            return;
                          }
                          
                          // 주민번호 유효성 검사 후 업데이트 진행
                          const residentValid = isValidResidentNumber(employeeData.noResident);
                          setIsValid(residentValid);

                          const isUpdated = await handleUpdateEmp("noResident", clickCdEmp, employeeData.noResident);

                          if (isUpdated) {
                            await handleGetEmpList();
                            setIsEmpListUpdated(true);
                            setCdEmpUpdated(clickCdEmp);
                          }
                        }}
                        readOnly={isReadOnly || maskResident}
                        style={{
                          borderColor: isValid === false ? 'red' : 'var(--color-primary-gray)',
                          borderWidth: isValid === false ? '3px' : '1px',
                          color: isValid ? 'black' : 'red'
                          }}
                      />
                    </td>
                    <td className="erCellStyle">
                      <CustomInput
                        value={genderFromNoResident(employeeData.noResident)}
                        readOnly={true}
                      />
                    </td>
                  </tr>
                {/* <tr>
                <th className="erHeaderStyle">국적</th>
                  <td className="erCellStyle">
                    <CustomInput
                      value="대한민국"
                      readOnly={true}
                    />
                  </td>
                </tr> */}
                  <tr>
                    <th className="erHeaderStyle">주소</th>
                    <td className="erCellStyle">
                      <CustomInput 
                        width={180}
                        value={employeeData.noPost}
                        setZonecode={(value) => {
                          setEmployeeData(prevState => ({
                              ...prevState,
                              noPost: value
                          }));
                        }} 
                        readOnly 
                        />
                    </td>
                    <td className="erCellStyle" colSpan="2">
                      <CustomInput 
                        width={368}
                        value={employeeData.nmAddress}
                        setAddress={(value) => {
                            setEmployeeData(prevState => ({
                                ...prevState,
                                nmAddress: value
                            }));
                        }}
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
                        maxLength={100}
                        value={employeeData.dcAddress}
                        onChange={(e) => {
                          setEmployeeData(prevState => ({
                              ...prevState,
                              dcAddress: e.target.value
                          }));
                        }}
                        onBlur={() => {
                          // 초기 값과 현재 값이 모두 비어 있으면 업데이트를 스킵
                          if (employeeData.dcAddress === undefined) {
                            return;
                          }
                          handleUpdateEmp("dcAddress", clickCdEmp, employeeData.dcAddress);
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
                        value={employeeData.noPhone1}
                        onChange={(e) => {
                          setEmployeeData(prevState => ({
                              ...prevState,
                              noPhone1: e.target.value
                          }));
                        }}
                        onBlur={handlePhoneUpdate}
                        maxLength={3}
                        readOnly={isReadOnly}
                      />
                    </td>
                    <td className="erCellStyle">
                      <CustomInput 
                        type="number"
                        width={180}
                        value={employeeData.noPhone2}
                        onChange={(e) => {
                          setEmployeeData(prevState => ({
                              ...prevState,
                              noPhone2: e.target.value
                          }));
                        }}
                        onBlur={handlePhoneUpdate}
                        maxLength={4}
                        readOnly={isReadOnly}
                      />
                    </td>
                    <td className="erCellStyle">
                      <CustomInput 
                        type="number"
                        width={180}
                        value={employeeData.noPhone3}
                        onChange={(e) => {
                          setEmployeeData(prevState => ({
                              ...prevState,
                              noPhone3: e.target.value
                          }));
                        }}
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
                        value={employeeData.noMobilePhone1}
                        onChange={(e) => {
                          setEmployeeData(prevState => ({
                              ...prevState,
                              noMobilePhone1: e.target.value
                          }));
                        }}
                        onBlur={handleMobilePhoneUpdate}
                        maxLength={3}
                        readOnly={isReadOnly}
                      />
                    </td>
                    <td className="erCellStyle">
                      <CustomInput 
                        type="number"
                        width={180}
                        value={employeeData.noMobilePhone2}
                        onChange={(e) => {
                          setEmployeeData(prevState => ({
                              ...prevState,
                              noMobilePhone2: e.target.value
                          }));
                        }}
                        onBlur={handleMobilePhoneUpdate}
                        maxLength={4}
                        readOnly={isReadOnly}
                      />
                    </td>
                    <td className="erCellStyle">
                      <CustomInput 
                        type="number"
                        width={180}
                        value={employeeData.noMobilePhone3}
                        onChange={(e) => {
                          setEmployeeData(prevState => ({
                              ...prevState,
                              noMobilePhone3: e.target.value
                          }));
                        }}
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
                          maxLength={20}
                          value={employeeData.username}
                          onChange={(e) => {
                              setEmployeeData(prevState => ({
                                  ...prevState,
                                  username: e.target.value
                              }));
                          }} 
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
                          maxLength={20}
                          value={domainMap[employeeData.selectedOption] === "직접입력" ? employeeData.domain : domainMap[employeeData.selectedOption]}
                          onChange={(e) => {
                              setEmployeeData(prevState => ({
                                  ...prevState,
                                  domain: e.target.value
                              }));
                          }}
                          onBlur={() => handleDomainUpdate(employeeData.domain)}
                          readOnly={isReadOnly}
                        />
                      </div>
                    </td>
                    <td className="erCellStyle">
                      <CustomSelect
                        className="erSelectBox"
                        options={options}
                        value={employeeData.selectedOption}
                        onChange={handleSelectChange} 
                        disabled={isReadOnly}
                      />
                    </td>
                  </tr>
                  <tr>
                    <th className="erHeaderStyle">메신저ID</th>
                    <td className="erCellStyle">
                        <CustomInput 
                            type="email"
                            width={180}
                            maxLength={20}
                            value={employeeData.idMessenger}
                            onChange={(e) => {
                                setEmployeeData(prevState => ({
                                    ...prevState,
                                    idMessenger: e.target.value
                                }));
                            }} 
                            onBlur={() => {
                                // 초기 값과 현재 값이 모두 비어 있으면 업데이트를 스킵
                                if (employeeData.idMessenger === undefined) {
                                    return;
                                }
                                handleUpdateEmp("idMessenger", clickCdEmp, employeeData.idMessenger);
                            }}
                            readOnly={isReadOnly}
                        />
                    </td>
                  </tr>
                  <tr>
                    <th className="erHeaderStyle">부서</th>
                    <td className="erCellStyle">
                      <CustomModalInput 
                        width={180}
                        value={nmDept}
                        disabled={isReadOnly}
                        readOnly={true}
                        placeholder="부서 코드도움"
                        onClick={() => {
                          handleGetDeptList();
                          openDeptModal();
                        }}
                        contentStyle={{height: '505px'}}
                        isOpen={isDeptModalOpen}
                        onRequestClose={closeDeptModal}
                      >
                        <PageHeaderName text="부서 코드도움" />
                        <div className="test2">
                          <Table 
                            columns={columnsDept} 
                            data={dataDept} 
                          />
                        </div>
                        <div className="test">
                          <CustomButton 
                              backgroundColor={"var(--color-primary-blue)"}
                              color={"var(--color-primary-white)"}
                              onClick={() => {
                                  handleDeptConfirmClick();
                                  closeDeptModal();
                              }}
                              text={"확인"}
                          />
                          <CustomButton 
                            backgroundColor={"var(--color-primary-blue)"}
                            color={"var(--color-primary-white)"}
                            onClick={closeDeptModal}
                            text={"취소"}
                          />
                        </div>
                      </CustomModalInput>
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
                        value={employeeData.noPositionUnique}
                        onChange={handleNoPositionUniqueChange}
                        placeholder="선택"
                        disabled={isReadOnly}
                      />
                    </td>
                  </tr>
                  <tr>
                    <th className="erHeaderStyle">호봉</th>
                    <td className="erCellStyle">
                        <CustomSelect
                            className="erSelectBox"
                            options={[
                                { value: "null", label: "선택" },
                                { value: "1", label: "1호봉" },
                                { value: "2", label: "2호봉" },
                                { value: "3", label: "3호봉" },
                                { value: "4", label: "4호봉" },
                                { value: "5", label: "5호봉" },
                            ]}
                            value={employeeData.fgSalaryGrade}
                            onChange={handleFgSalaryGradeChange}
                            disabled={isReadOnly}
                        />
                    </td>
                  </tr>
                  <tr>
                    <th className="erHeaderStyle">퇴사일자</th>
                    <td className="erCellStyle">
                      <CustomCalendar 
                        width={180}
                        value={employeeData.dtResign}
                        onChange={(newDate) => handleDateChange("dtResign", newDate)}
                        onKeyDown={handleBackspaceDtResign}
                        disabled={isReadOnly}
                        readOnly={true}
                        position="up"
                      />
                    </td>
                  </tr>
                  <tr>
                    <th className="erHeaderStyle">급여이체은행</th>
                    <td className="erCellStyle">
                      <CustomModalInput 
                        width={180}
                        value={nmBank}
                        disabled={isReadOnly}
                        readOnly={true}
                        placeholder="급여이체은행 코드도움"
                        onClick={() => {
                          handleGetBankList();
                          openBankModal();
                        }}
                        contentStyle={{height: '505px'}}
                        isOpen={isBankModalOpen}
                        onRequestClose={closeBankModal}
                      >
                        <PageHeaderName text="급여이체은행 코드도움" />
                        <div className="test2">
                          <Table 
                            columns={columnsBank}
                            data={dataBank}
                          />
                        </div>
                        <div className="test">
                          <CustomButton 
                            backgroundColor={"var(--color-primary-blue)"}
                            color={"var(--color-primary-white)"}
                            onClick={() => {
                              handleBankConfirmClick();
                              closeBankModal();
                            }}
                            text={"확인"}
                          />
                          <CustomButton 
                            backgroundColor={"var(--color-primary-blue)"}
                            color={"var(--color-primary-white)"}
                            onClick={closeBankModal}
                            text={"취소"}
                          />
                        </div>
                      </CustomModalInput>
                    </td>
                    <td className="erCellStyle">
                      <CustomInput 
                        type={"number"}
                        width={180}
                        maxLength={20}
                        value={employeeData.noAccount}
                        onChange={(e) => {
                          setEmployeeData(prevState => ({
                              ...prevState,
                              noAccount: e.target.value
                          }));
                        }}
                        onBlur={() => {
                          if (employeeData.noAccount === undefined) {
                            return;
                          }
                          handleUpdateEmp("noAccount", clickCdEmp, employeeData.noAccount);
                        }}
                        placeholder="계좌번호를 입력해주세요."
                        readOnly={isReadOnly}
                      />
                    </td>
                    <td className="erCellStyle">
                      <CustomInput 
                        width={180}
                        maxLength={10}
                        value={employeeData.nmAccountHolder || employeeData.nmEmp}
                        onChange={(e) => {
                          const value = e.target.value;
                          setEmployeeData(prevState => ({
                              ...prevState,
                              nmAccountHolder: value === "" ? null : value
                          }));
                        }}
                        onBlur={() => {
                          handleUpdateEmp("nmAccountHolder", clickCdEmp, employeeData.nmAccountHolder);
                        }}
                        readOnly={isReadOnly}
                      />
                    </td>
                  </tr>
                  <tr>
                    <th className="erHeaderStyle">비고</th>
                    <td className="erCellStyle" colSpan="5">
                        <CustomInput 
                            width={845}
                            maxLength={100}
                            value={employeeData.comment}
                            onChange={(e) => {
                                setEmployeeData(prevState => ({
                                    ...prevState,
                                    comment: e.target.value
                                }));
                            }}
                            onBlur={() => {
                                // 초기 값과 현재 값이 모두 비어 있으면 업데이트를 스킵
                                if (employeeData.comment === undefined) {
                                    return;
                                }
                                handleUpdateEmp("comment", clickCdEmp, employeeData.comment);
                            }}
                            readOnly={isReadOnly}
                        />
                    </td>
                  </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 주소검색 모달 */}
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

        {showErrorAlert && (
          <SweetAlert
            text={errorMessage}
            confirmText="확인"
            type="error"
            onConfirm={() => {
              setShowErrorAlert(false);
            }}
          />
        )}
        
      </section>
    </>
  );
}

export default EmployeeRegister;