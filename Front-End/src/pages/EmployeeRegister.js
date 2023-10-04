import React, { useState, useCallback, useMemo, useEffect } from "react";
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
  const [showAlert, setShowAlert] = useState(false); // sweetAlert 상태 관리

  const [checkedRows, setCheckedRows] = useState([]); // 각 행의 체크박스 상태를 저장하는 상태
  const [showInsertRow, setShowInsertRow] = useState(false); // 테이블의 insertRow의 상태
  const [initialValues, setInitialValues] = useState({}); // 업데이트 요청을 위한 초기값 상태 관리
  const [isValid, setIsValid] = useState(null); // 주민번호 유효성 검사 결과 저장 상태 관리
  
  const [insertData, setInsertData] = useState({ cdEmp: "", nmEmp: "", noResident: "" }); // 현재 편집 중인 insert 데이터 상태 관리
  const [isDataInserted, setIsDataInserted] = useState(false);

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
  });

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

    setEmployeeData(prevState => ({
      ...prevState,
      selectedOption: selectedValue,
      domain: newDomain === "직접입력" ? "" : newDomain,
      nmEmail: newDomain && prevState.username ? `${prevState.username}@${newDomain}` : prevState.username
    }));

    handleDomainUpdate(newDomain);
  };

  // username만 업데이트하는 함수
  const handleUsernameUpdate = () => {
    setEmployeeData(prevState => {
      if (!prevState.username) {
        console.log("username API 요청 중단*********************");
        return prevState; // 상태를 그대로 반환
      }
      const email = prevState.domain ? `${prevState.username}@${prevState.domain}` : prevState.username;
      handleUpdateEmp("nmEmail", clickCdEmp, email);
      return { ...prevState, nmEmail: email };
    });
  };

  // domain만 업데이트하는 함수
  const handleDomainUpdate = (newDomain) => {
    if (!newDomain) {
      console.log("domain API 요청 중단*********************");
      return;
    }
    const email = employeeData.username ? `${employeeData.username}@${newDomain}` : `@${newDomain}`;
    handleUpdateEmp("nmEmail", clickCdEmp, email);
    setEmployeeData(prevState => ({
      ...prevState,
      domain: newDomain,
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


  // 버튼 클릭시 DaumPostcode 모달 열기
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

  // 모달 닫기
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
    const fullPhone = `${employeeData.noPhone1}-${employeeData.noPhone2}-${employeeData.noPhone3}`;

    // 전화번호의 모든 세부 요소가 비어 있으면 API 요청 중단
    if (!employeeData.noPhone1 && !employeeData.noPhone2 && !employeeData.noPhone3) {
      console.log("전화번호 API 요청 중단*********************");
      return;
    }

    handleUpdateEmp("noPhone", clickCdEmp, fullPhone);
    setEmployeeData(prevState => ({
        ...prevState,
        noPhone: fullPhone
    }));
  };

  // 휴대폰번호 하나로 합치기
  const handleMobilePhoneUpdate = () => {
    const fullMobilePhone = `${employeeData.noMobilePhone1}-${employeeData.noMobilePhone2}-${employeeData.noMobilePhone3}`;

    // 휴대폰 번호의 모든 세부 요소가 비어 있으면 API 요청 중단
    if (!employeeData.noMobilePhone1 && !employeeData.noMobilePhone2 && !employeeData.noMobilePhone3) {
      console.log("휴대폰번호 API 요청 중단*********************");
      return;
    }

    handleUpdateEmp("noMobilePhone", clickCdEmp, fullMobilePhone);
    setEmployeeData(prevState => ({
        ...prevState,
        noMobilePhone: fullMobilePhone
    }));
  };

  // insert useEffect
  useEffect(() => {
    if (isDataInserted) {
        handleInsertEmp(insertData.cdEmp, insertData.nmEmp, insertData.noResident);
        setIsDataInserted(false);
        window.location.reload();
    }
  }, [isDataInserted]);


  // erGrid useMemo data
  const data = useMemo(
    () =>
      empList.map((emp) => ({
        checkbox: false,
        code: emp.cdEmp,
        employee: emp.nmEmp,
        foreign: emp.fgForeign,
        resident: emp.noResident,
        onRowClick: () => (emp.cdEmp),
      })),
    [empList]
  );

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
            setInputValue(e.target.value);
            setChanged(true);
            setInsertData(prev => ({ ...prev, cdEmp: e.target.value }));
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
            console.log("inputValue의 값 : " + inputValue);
        
            if (original && original.code) {
                console.log("original.code의 값 : " + original.code);
            }
        
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
                const element = document.getElementById(`focusOn_${inputValue}`);
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  element.focus();
                }
                // 원래의 값을 inputValue로 되돌린다.
                setInputValue(original.code);
                return;
              }

              // 위에서 중복 체크를 통과했다면, 업데이트 처리
              if (original && original.code) {
                handleUpdateEmp("cdEmp", original.code, inputValue);
              }
            } catch (error) {
            console.error("An error occurred:", error);
            }
          };

          return (
            <>
              <Input
                value={inputValue || ""}
                onChange={handleInputChangeCdEmp}
                onClick={tableEmpCodeClick}
                // isDoubleClick={true}
                className={"doubleLine"}
                onBlur={handleInputOnBlurCdEmp}
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
            setInputValue(e.target.value);
            setChanged(true);
            setInsertData(prev => ({ ...prev, nmEmp: e.target.value }));
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

          const handleInputOnBlurNmEmp = async (e) => {
            const inputValue = e.target.value?.trim();
            if (!changed) {
              console.log("*********************************** onChange 없으니 종료");
              return;
            }
          
            setChanged(false);
          
            if (original && original.code) {
              // 기존의 데이터일 경우, 업데이트 동작 수행
              handleUpdateEmp("nmEmp", original.code, inputValue);
            } else {
              // 새로운 데이터일 경우, 상태만 업데이트하고 실제 insert는 주민번호 입력란에서 처리
              setInsertData(prev => ({
                ...prev, 
                nmEmp: inputValue
              }));
            }
          };

        return (
            <Input
              value={inputValue || ""}
              onChange={handleInputChangeNmEmp}
              onClick={tableEmpNmClick}
              // isDoubleClick={true}
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
                  readOnly={true}
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
            setIsValid(null); // 변경될 때 isValid를 null로 설정
            setInsertData(prev => ({ ...prev, noResident: e.target.value }));
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

          const handleInputOnBlurNoResident = async (e) => {
            
            // // 주민번호가 마스킹 상태인 경우 업데이트 및 삽입을 중지
            // if (maskResident) {
            //   console.log("주민번호가 마스킹 상태이므로 업데이트 및 삽입을 중지합니다.");
            //   return;
            // }

            const inputValue = e.target.value?.trim();

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

            try {
                if (original && original.code) {
                    handleUpdateEmp("noResident", original.code, inputValue);
                } else {
                    setInsertData(prev => {
                        if (prev.cdEmp && prev.nmEmp && inputValue) {
                            setIsDataInserted(true);
                        }
                        return { ...prev, noResident: inputValue };
                    });
                }
            } catch (error) {
                console.error("An error occurred:", error);
            }
            // setIsValid(isValidResidentNumber(inputValue));
          };

          const maskedValue = inputValue 
          ? inputValue.slice(0, 6) + (maskResident ? '-*******' : inputValue.slice(6))
          : '';

          // // 색상 결정 로직
          // let color;
          // if (isValid === null || isValid) {
          //   color = 'grey';
          // } else {
          //   color = 'red';
          // }

          return (
            <Input
            type={"resident"}
            value={maskedValue}
            onChange={handleInputChange}
            onClick={tableNoResidentClick}
            // isDoubleClick={true}
            // style={{ color: color }}
            className={"doubleLine"}
            onBlur={handleInputOnBlurNoResident}
            readOnly={maskResident} // 마스킹 상태일 경우 읽기 전용으로 설정
            />
          );
        },
      },
    ], [checkedRows, maskResident]
  );

  // Insert
  const handleInsertEmp = async (codeValue, employeeValue, noResidentValue) => {
    console.log("handleInsertEmp 실행 *********************");
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
    if (
      (initial === inputValue) || // 초기값과 변경값이 동일할 때
      ((initial === undefined || initial === null) && !inputValue) // 초기값이 undefined 또는 null이고 입력값이 없을 때
    ) {
      console.log("변경이 없으니 API 호출 중단");
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
      setInitialValues((prev) => ({ ...prev, [columnName]: inputValue }));
      console.log("responseData : " + responseData);
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

      } catch (error) {
        console.error("api 요청 실패:", error);
      }

      setIsReadOnly(false);
  };

  // Delete (체크된 모든 행을 삭제)
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

  // 주민번호 별표 사용 설정
  const toggleMaskResident = () => {
    setMaskResident(prev => !prev);
    console.log("toggleMaskResident 함수 실행 ********************************")
  }

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
            console.log("부서 Code 클릭 이벤트 발생*******************");
            setClickModalDeptCode(original.noDepartment);
          };
          return (
            <Input
              value={original?.noDepartment || ""}
              onClick={handleInputClick}
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
          return (
            <Input
              value={original?.nmDepartment || ""}
              onClick={handleInputClick}
              className={"doubleLine"}
              readOnly={true}
            />
          );
        },
      },
    ],
    []
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
  }

  // 부서 확인 버튼 클릭 이벤트 핸들러
  const handleDeptConfirmClick = async () => {
    console.log("확인 버튼 클릭됨");

    if (clickModalDeptCode && clickModalDeptCode !== clickCdEmp) {
      try {
        await handleUpdateEmp("noDepartment", clickCdEmp, clickModalDeptCode);
        console.log(`cdEmp ${clickCdEmp}의 부서를 ${clickModalDeptCode}로 업데이트하였습니다.`);
      } catch (error) {
        console.error("cdEmp 업데이트 실패:", error);
      }
    } else {
      console.log("변경 사항이 없거나, 부서 선택이 되지 않았습니다.");
    }

    // 부서명을 갱신
    updateNmDeptByCode(clickModalDeptCode);
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
            console.log("code클릭이벤발생");
            setClickModalBankCode(original.cdBank);  // 클릭한 은행의 코드 설정
          };
          return (
            <Input
              value={original?.cdBank || ""}
              onClick={handleInputClick}
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
            console.log("code클릭이벤발생");
            setClickModalBankCode(original.cdBank);  // 클릭한 은행의 코드 설정
          };
          return (
            <Input
              value={original?.nmBank || ""}
              onClick={handleInputClick}
              className={"doubleLine"}
              readOnly={true}
            />
          );
        },
      },
    ],
    []
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

  // 은행 확인 버튼 클릭 이벤트 핸들러
  const handleBankConfirmClick = async () => {
    console.log("은행 확인 버튼 클릭됨");

    if (clickModalBankCode && clickModalBankCode !== clickCdEmp) {
      try {
        await handleUpdateEmp("cdBank", clickCdEmp, clickModalBankCode);
        console.log(`cdEmp ${clickCdEmp}의 은행을 ${clickModalBankCode}로 업데이트하였습니다.`);
      } catch (error) {
        console.error("cdEmp 업데이트 실패:", error);
      }
    } else {
      console.log("변경 사항이 없거나, 은행 선택이 되지 않았습니다.");
    }

    // 은행명을 갱신
    updateNmBankByCode(clickModalBankCode);
    setClickModalBankCode("");
  };

  // 라디오 버튼 값 변경 함수
  const handleRadioChange = (event) => {
    setSortOrder(event.target.value);
    console.log("(handleRadioChange) 선택된 정렬 방식:", event.target.value);
  }

  useEffect(() => {
    if (sortOrder === "code") {
        setSortedDataEmp([...data].sort((a, b) => a.code.localeCompare(b.code)));
    } else if (sortOrder === "name") {
        setSortedDataEmp([...data].sort((a, b) => a.employee.localeCompare(b.employee)));
    }
  }, [sortOrder, data]);

  // 데이터 정렬 모달창 함수
  const toggleSortSearch = () => {
    setOpenSortSearch(!openSortSearch);
  }

  // 강제로 컴포넌트를 재마운트 상태 관리
  const [tableKey, setTableKey] = useState(Date.now());

  // 데이터 정렬 함수
  const handleSortDataConfirm = () => {
    setSortOrder(sortOrder);
    toggleSortSearch();
    setTableKey(Date.now());
  };

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
                  text="별표 사용설정"
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
                    // 체크박스에 체크가 된 상태인 경우에만 SweetAlert 창을 띄움
                    if (checkedRows.length > 0) {
                      setShowAlert(true);
                    } else {
                      console.log("체크박스에 체크된 항목이 없습니다.");
                    }
                  }}
                />

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
                      window.location.reload();
                    }}
                    onCancel={() => {
                      setShowAlert(false);
                      console.log("삭제 취소");
                    }}
                  />
                )}

              {/* <PageHeaderIconButton
                btnName="calc"
                imageSrc={Calc}
                altText="계산기"
                disabled={true}
              /> */}

              <PageHeaderIconButton
                btnName="setting"
                imageSrc={Setting}
                altText="세팅"
                // onClick={handleOpenSetting}
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
                key={tableKey}
                columns={columns}
                data={sortedDataEmp}
                insertRow={!maskResident}
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
                    value={employeeData.dtHire} 
                    onChange={(newDate) => handleDateChange("dtHire", newDate)}
                    disabled={isReadOnly}
                    readOnly={true}
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
                      // if (maskResident) {
                      //   console.log("주민번호가 마스킹 상태이므로 값 변경을 중지합니다.");
                      //   return;
                      // }
                      setEmployeeData(prevState => ({
                          ...prevState,
                          noResident: e.target.value
                      }));
                    }}
                    onBlur={() => {
                      // if (maskResident) {
                      //   console.log("주민번호가 마스킹 상태이므로 업데이트를 중지합니다.");
                      //   return;
                      // }
                      
                      if (employeeData.noResident.length !== 14) {
                        console.log("주민번호는 13자리여야 합니다.");
                        setIsValid(false);
                        return;
                      }
                      const residentValid = isValidResidentNumber(employeeData.noResident);
                      setIsValid(residentValid);
                      handleUpdateEmp("noResident", clickCdEmp, employeeData.noResident);
                    }}
                    readOnly={isReadOnly || maskResident}
                    style={{
                      borderColor: isValid === false ? 'red' : 'var(--color-primary-gray)',
                      borderWidth: isValid === false ? '2px' : '1px',
                      // color: isValid ? 'black' : 'red'
                    }}
                  />
                </td>
                <td className="erCellStyle">
                  <CustomInput
                    className="erSelectBox"
                    value={genderFromNoResident(employeeData.noResident)}
                    readOnly={true}
                  />
                </td>
              </tr>
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
                    value={employeeData.dcAddress} 
                    onChange={(e) => {
                      setEmployeeData(prevState => ({
                          ...prevState,
                          dcAddress: e.target.value
                      }));
                    }}
                    onBlur={() => {
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
                <th className="erHeaderStyle">퇴사일자</th>
                <td className="erCellStyle">
                  <CustomCalendar 
                    width={180} 
                    value={employeeData.dtResign} 
                    onChange={(newDate) => handleDateChange("dtResign", newDate)}
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
                    width={180} 
                    value={employeeData.noAccount} 
                    onChange={(e) => {
                      setEmployeeData(prevState => ({
                          ...prevState,
                          noAccount: e.target.value
                      }));
                    }}
                    onBlur={() => {
                      handleUpdateEmp("noAccount", clickCdEmp, employeeData.noAccount);
                    }}
                    placeholder="계좌번호를 입력해주세요."
                    readOnly={isReadOnly}
                  />
                </td>
                <td className="erCellStyle">
                  <CustomInput 
                    width={180} 
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
            </tbody>
          </table>
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

      </section>
    </>
  );
}

export default EmployeeRegister;