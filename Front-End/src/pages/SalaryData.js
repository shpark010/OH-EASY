import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import Input from "../components/Contents/InputTest";
import CustomModal from "../components/Contents/CustomModal";
import useApiRequest from "../components/Services/ApiRequest";
import CustomButton from "../components/Contents/CustomButton";
import SweetAlert from "../components/Contents/SweetAlert";
import CustomSelect from "../components/Contents/CustomSelect";

const SalaryData = (props) => {
  // 수정 가능 여부
  const [edit, setEdit] = useState(false);
  // 입력 급여
  const [pay, setPay] = useState("");
  // 기존(조회된) 급여
  const [beforePay, setBeforePay] = useState("");
  // 모달 여닫기
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalIsOpen2, setModalIsOpen2] = useState(false);
  // 사원 조회 리스트
  const [empList, setEmpList] = useState([]);
  useEffect(() => {
    if (empList.length > 0) {
      const cdEmp = empList[0].cdEmp;
      const element = document.querySelector(`.${cdEmp}`); // className으로 요소를 찾음

      if (element) {
        element.click(); // 요소를 클릭
      }
    }
  }, [empList]);
  // 체크 리스트
  const [checkedRows, setCheckedRows] = useState([]); // 각 행의 체크박스 상태를 저장하는 상태
  //헤더 체크박스를 클릭할 때 호출되어, 모든 체크박스를 체크하거나 체크를 해제
  const handleHeaderCheckboxClick = useCallback(() => {
    if (checkedRows.length !== empList.length) {
      setCheckedRows(empList.map((emp) => emp.cdEmp));

      console.log(checkedRows);
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
  // 귀속년월
  const [belongingDate, setBelongingDate] = useState("");
  const handleBelongingDateChange = (newDate) => {
    newDate = newDate.replace(/-/g, "");
    setBelongingDate(newDate);
    console.log("귀속년월 : " + belongingDate);
  };
  // 지급일
  const [payDay, setPayDay] = useState();
  const handlePayDateChange = (newDate) => {
    newDate = newDate.replace(/-/g, "");
    setPayDay(newDate);
    console.log("지급일 : " + payDay);
  };
  // 정렬
  const [searchOrder, setSearchOrder] = useState("0");
  // 선택된 값이 변경될 때 호출될 콜백 함수
  const handleSearchTypeChange = async (e) => {
    const newSearchOrder = e.target.value;
    setSearchOrder(newSearchOrder);
    await handleFetchEmpData(e);
  };
  useEffect(() => {
    // handleFetchEmpData();
    console.log(searchOrder);
  }, [searchOrder]);
  // 테이블의 insertRow의 상태
  const [showInsertRow, setShowInsertRow] = useState(false);
  // 현재 클릭한 cdEmp 저장하는 상태
  const [clickEmpCode, setClickEmpCode] = useState("");
  // 클릭한 사원 코드 확인
  useEffect(() => {
    if (clickEmpCode !== undefined) {
      console.log("insert : " + clickEmpCode);
    }
  }, [clickEmpCode]);
  //클릭한 지급일자 상태
  const [clickPayDay, setClickPayDay] = useState({
    mmBelong: "",
    dtAllowance: "",
  });
  // 선택 사원 세액
  const [taxAmount, setTaxAmount] = useState({
    nationalPension: "", //국민연금
    healthInsurance: "", //건강보험
    employmentInsurance: "", //고용보험
    longtermNursingInsurance: "", //장기요양보험
    incomeTax: "", //소득세
    localIncomeTax: "", //지방소득세
  }); //단일 세금 금액

  //포멧 함수
  //금액
  const changeFormat = (changeValue) => {
    let newValue = String(changeValue);
    // 쉼표(,) 제거 후 숫자만 남김
    newValue = newValue.replace(/,/g, "");
    // 숫자만 허용
    newValue = newValue.replace(/[^0-9]/g, "");
    // 앞에 0을 제거
    newValue = newValue.replace(/^0+/, "");
    // 3자리마다 쉼표 추가
    newValue = newValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    // newValue = Number(newValue).toLocaleString("ko-KR");
    return newValue;
  };

  //수치
  const figureFormat = (changeValue) => {
    let newValue = changeValue;
    // 정수 또는 소수만 허용하는 정규 표현식
    newValue = newValue.replace(/[^0-9.]/g, "");

    // 소수점이 두 번 이상 등장하지 않도록 처리
    const decimalPoints = newValue.split(".").length - 1;
    if (decimalPoints > 1) {
      newValue = newValue.substr(0, newValue.lastIndexOf("."));
    }

    // 소수점이 있는데, 소수 부분이 0이라면 정수로 변환
    if (newValue.includes(".") && parseFloat(newValue) === parseInt(newValue)) {
      newValue = parseInt(newValue).toString();
    }

    // 소수 부분의 끝이 0이라면 0을 제거
    if (newValue.includes(".")) {
      newValue = parseFloat(newValue).toString();
    }
    return newValue;
  };

  //날짜
  const dateFormat = (rawDate) => {
    if (rawDate.length !== 8 || isNaN(rawDate)) {
      return "";
    }

    const year = rawDate.substring(0, 4);
    const month = rawDate.substring(4, 6);
    const day = rawDate.substring(6, 8);

    const newDate = `${year}-${month}-${day}`;

    return newDate;
  };

  //개인 종합 세액
  const [personalTax, setPersonalTax] = useState({
    deduction: "",
    differencePayment: "",
  });

  // 조회 구분
  const [searchTaxOrder, setSearchTaxOrder] = useState("0");

  const handleSearchTaxTypeChange = (e) => {
    setSearchTaxOrder(e.target.value);
    handleChangeSearch(e);
  };

  //
  const [searchTax, setSearchTax] = useState({
    amtAllowance: "", //기본급 총액
    nationalPension: "", //국민연금 총액
    healthInsurance: "", //건강보험 총액
    employmentInsurance: "", //고용보험 총액
    longtermNursingInsurance: "", //장기요양보험 총액
    incomeTax: "", //소득세 총액
    localIncomeTax: "", //지방소득세 총액
  });

  const [totalTax, setTotalTax] = useState({
    deduction: "",
    differencePayment: "",
  });

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
    milDischarge: "", //제대구분
    milService: "", //병역구분
    obstacle: "", //장애
    certificate: "", //자격증
  }); //사원 상세 정보

  //api 요청 함수
  const apiRequest = useApiRequest();

  const handlePriceChange = (value) => {
    setPay(value);
  };

  const openModal = () => {
    resetStates();
    setModalIsOpen(true);
    handleGetPayDayList();
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const openModal2 = () => {
    setModalIsOpen2(true);
    handleGetTaxList(applyYear);
  };

  const closeModal2 = () => {
    setModalIsOpen2(false);
  };

  //조회 아래 영역 초기화
  const resetStates = () => {
    setPay("");
    setBeforePay("");
    setModalIsOpen(false);
    setEmpList([]);
    setShowInsertRow(false);
    setClickEmpCode("");
    setTaxAmount({
      nationalPension: "",
      healthInsurance: "",
      employmentInsurance: "",
      longtermNursingInsurance: "",
      incomeTax: "",
      localIncomeTax: "",
    });
    setCheckedRows([]);
    setPersonalTax({
      deduction: "",
      differencePayment: "",
    });
    setSearchTaxOrder("0");
    setSearchTax({
      amtAllowance: "",
      nationalPension: "",
      healthInsurance: "",
      employmentInsurance: "",
      longtermNursingInsurance: "",
      incomeTax: "",
      localIncomeTax: "",
    });
    setTotalTax({
      deduction: "",
      differencePayment: "",
    });
    setEmpDetailInfo({
      hireDate: "",
      gender: "",
      address: "",
      detailAddress: "",
      phone: "",
      email: "",
      leavingDate: "",
      department: "",
      domesticForeign: "",
      family: "",
      milDischarge: "",
      milService: "",
      obstacle: "",
      certificate: "",
    });
  };

  //세금 정보 포멧
  const formatTaxInfo = (taxInfo) => {
    const formattedDeducation = Object.fromEntries(
      Object.entries(taxInfo).map(([key, value]) => [key, changeFormat(value)]),
    );
    return formattedDeducation;
  };

  //총 세액
  const calTotalTax = (taxInfo) => {
    const totalAmount = Object.keys(taxInfo).reduce((acc, key) => {
      if (key !== "amtAllowance") {
        return acc + taxInfo[key];
      }
      return acc;
    }, 0);
    return totalAmount;
  };

  //차인지급액
  const calMinTax = (taxInfo, totalAmount) => {
    const minAmt = taxInfo.amtAllowance - totalAmount;
    return minAmt;
  };

  //개별 사원 set
  const handleSetPersonal = (formattedDeducation, totalAmount, minAmt) => {
    setPay(formattedDeducation.amtAllowance);
    setBeforePay(formattedDeducation.amtAllowance);
    setTaxAmount({
      nationalPension: formattedDeducation.nationalPension,
      healthInsurance: formattedDeducation.healthInsurance,
      employmentInsurance: formattedDeducation.employmentInsurance,
      longtermNursingInsurance: formattedDeducation.longtermNursingInsurance,
      incomeTax: formattedDeducation.incomeTax,
      localIncomeTax: formattedDeducation.localIncomeTax,
    });
    setPersonalTax({
      deduction: changeFormat(totalAmount),
      differencePayment: changeFormat(minAmt),
    });
  };

  //조건 조회 set
  const handleSetSearch = (formattedDeducation, totalAmount, minAmt) => {
    setSearchTax({
      amtAllowance: formattedDeducation.amtAllowance,
      nationalPension: formattedDeducation.nationalPension,
      healthInsurance: formattedDeducation.healthInsurance,
      employmentInsurance: formattedDeducation.employmentInsurance,
      longtermNursingInsurance: formattedDeducation.longtermNursingInsurance,
      incomeTax: formattedDeducation.incomeTax,
      localIncomeTax: formattedDeducation.localIncomeTax,
    });
    setTotalTax({
      deduction: changeFormat(totalAmount),
      differencePayment: changeFormat(minAmt),
    });
  };

  //조건 조회 세금
  const handleSearchTax = (searchTaxInfo) => {
    const formattedDeducation = formatTaxInfo(searchTaxInfo);
    const totalAmount = calTotalTax(searchTaxInfo);
    const minAmt = calMinTax(searchTaxInfo, totalAmount);
    handleSetSearch(formattedDeducation, totalAmount, minAmt);
  };

  //개별 사원 세금
  const handlePersonalTax = (empTaxInfo) => {
    const formattedDeducation = formatTaxInfo(empTaxInfo);
    const totalAmount = calTotalTax(empTaxInfo);
    const minAmt = calMinTax(empTaxInfo, totalAmount);
    handleSetPersonal(formattedDeducation, totalAmount, minAmt);
  };

  //조회 버튼 클릭시 사원리스트 불러오기(select)
  const handleFetchEmpData = async (e) => {
    // data 객체의 속성들이 undefined, null 또는 공백인지 확인
    if (!belongingDate || !payDay) {
      handleSearchOpenAlert();
      return;
    }
    let confirmOrder = searchOrder;

    if (e.target.tagName === "SELECT") {
      confirmOrder = e.target.value;
    }

    try {
      const responseData = await apiRequest({
        method: "POST",
        url: "/api2/sd/getEmpList",
        data: {
          belongingDate: belongingDate,
          payDay: payDay,
          searchOrder: confirmOrder,
          searchTaxOrder: searchTaxOrder,
        },
      });
      setEmpList(responseData.empSearch);
      const searchTaxInfo = responseData.searchTaxInfo;
      handleSearchTax(searchTaxInfo);
    } catch (error) {
      console.error("Failed to fetch emp data:", error);
    }
  };

  //지급일자 조회
  const handleFetchEmpData2 = async (original) => {
    try {
      const responseData = await apiRequest({
        method: "POST",
        url: "/api2/sd/getEmpList",
        data: {
          belongingDate: "2023" + original.mmBelong,
          payDay: original.dtAllowance,
          searchOrder: "0",
          searchTaxOrder: "0",
        },
      });
      setEmpList(responseData.empSearch);
      const searchTaxInfo = responseData.searchTaxInfo;
      handleSearchTax(searchTaxInfo);
      setBelongingDate("2023" + original.mmBelong);
      setPayDay(original.dtAllowance);
      setSearchOrder("0");
      setSearchTaxOrder("0");
      closeModal();
    } catch (error) {
      console.error("Failed to fetch emp data:", error);
    }
  };

  //사원 클릭시 사원정보&급여 정보 불러오기
  const handleGetEmpDetailData = async (code) => {
    try {
      const responseData = await apiRequest({
        method: "POST",
        url: "/api2/sd/getOneEmpDetailData",
        data: {
          code: code,
          belongingDate: belongingDate,
          payDay: payDay,
          searchTaxOrder: searchTaxOrder,
        },
      });
      const empTaxInfo = responseData.empTaxInfo;
      const searchTaxInfo = responseData.searchTaxInfo;
      handlePersonalTax(empTaxInfo);
      handleSearchTax(searchTaxInfo);
      setEmpDetailInfo(responseData.searchInfo);
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
          searchTaxOrder: searchTaxOrder,
        },
      });
      const empTaxInfo = responseData.empTaxInfo;
      const searchTaxInfo = responseData.searchTaxInfo;
      handlePersonalTax(empTaxInfo);
      handleSearchTax(searchTaxInfo);
      setClickEmpCode(code);
    } catch (error) {
      console.error("Failed to fetch emp data:", error);
    }
  };

  //급여 정보 수정
  const handleUpdateData = async (code, pay) => {
    try {
      const responseData = await apiRequest({
        method: "POST",
        url: "/api2/sd/updateEmpPay",
        data: {
          code: code,
          pay: pay,
          belongingDate: belongingDate,
          payDay: payDay,
          searchTaxOrder: searchTaxOrder,
        },
      });
      const empTaxInfo = responseData.empTaxInfo;
      const searchTaxInfo = responseData.searchTaxInfo;
      handlePersonalTax(empTaxInfo);
      handleSearchTax(searchTaxInfo);
      setClickEmpCode(code);
    } catch (error) {
      console.error("Failed to fetch emp data:", error);
    }
  };

  //조회구분에 따른 세금정보
  const handleChangeSearch = async (e) => {
    // setSearchOrder(e.target.value);
    // console.log("값 : " + e.target.value);
    const newValue = e.target.value;
    try {
      const responseData = await apiRequest({
        method: "POST",
        url: "/api2/sd/searchTaxInfo",
        data: {
          code: clickEmpCode,
          belongingDate: belongingDate,
          payDay: payDay,
          searchTaxOrder: newValue,
        },
      });
      const searchTaxInfo = responseData.searchTaxInfo;
      handleSearchTax(searchTaxInfo);
      setSearchOrder(newValue);
    } catch (error) {
      console.error("Failed to fetch emp data:", error);
    }
  };

  //급여 자료 삭제
  const handleDeletePayData = async (checkedRows) => {
    if (checkedRows.length === 0) {
      return;
    }
    try {
      const responseData = await apiRequest({
        method: "POST",
        url: "/api2/sd/deletePayData",
        data: {
          code: checkedRows,
          belongingDate: belongingDate,
          payDay: payDay,
          searchTaxOrder: searchTaxOrder,
        },
      });
      const empTaxInfo = responseData.empTaxInfo;
      const searchTaxInfo = responseData.searchTaxInfo;
      handlePersonalTax(empTaxInfo);
      handleSearchTax(searchTaxInfo);
      setCheckedRows([]);
    } catch (error) {
      console.error("Failed to fetch emp data:", error);
    }
  };

  //지급일자 조회
  const handleGetPayDayList = async () => {
    try {
      const responseData = await apiRequest({
        method: "POST",
        url: "/api2/sd/getPayDayList",
        data: {
          //추후 입력
        },
      });
      setPayDayList(responseData.payDayList);
    } catch (error) {
      console.error("Failed to fetch emp data:", error);
    }
  };

  //과세 리스트 조회
  const handleGetTaxList = async (applyYear) => {
    try {
      const responseData = await apiRequest({
        method: "POST",
        url: "/api2/sd/getTaxList",
        data: {
          applyYear: applyYear,
        },
      });
      setTaxList(responseData.taxList);
      setEditTaxList(responseData.taxList);
    } catch (error) {
      console.error("Failed to fetch emp data:", error);
    }
  };

  //과세 리스트 업데이트
  const handleUpdateTaxList = async () => {
    try {
      const responseData = await apiRequest({
        method: "POST",
        url: "/api2/sd/updateTaxList",
        data: {
          checkList: checkedRows,
          applyYear: applyYear,
          editTaxList: editTaxList,
        },
      });
    } catch (error) {
      console.error("Failed to fetch emp data:", error);
    }
  };

  //이메일 발송
  const handleSendEmail = async () => {
    let sendResult = 0;
    try {
      const responseData = await apiRequest({
        method: "POST",
        url: "/api2/util/sendSalaryEmail",
        data: {
          codeList: checkedRows,
          belongingDate: belongingDate,
          dtAllowance: payDay,
        },
      });
      sendResult = responseData.sendResult;
      if (sendResult > 0) {
        handleEmailSendOpenAlert();
      }
    } catch (error) {
      console.error("Failed to fetch emp data:", error);
    }
    return sendResult;
  };

  //PDF 출력
  const handlePrintPdf = async () => {
    let sendResult = 0;
    try {
      const responseData = await apiRequest({
        method: "POST",
        url: "/api2/util/salaryPdf",
        data: {
          code: clickEmpCode,
          belongingDate: belongingDate,
          dtAllowance: payDay,
        },
        responseType: "blob",
      });
      // Create a new Blob from the response data
      const blob = new Blob([responseData], { type: "application/pdf" });

      // Create a link element
      const link = document.createElement("a");

      // Set the download attribute with a filename
      link.download = "salary.pdf";

      // Create a URL to the blob and set it as the href attribute
      link.href = window.URL.createObjectURL(blob);

      // Append the link to the body
      document.body.appendChild(link);

      // Trigger a click event on the link to download the file
      link.click();
      console.log(blob);
    } catch (error) {
      console.error("Failed to fetch emp data:", error);
    }
    return sendResult;
  };

  //각 공제 항목 별 수정
  const handleUpdateEachDeduction = async (nmTax, amtTax) => {
    let sendResult = 0;
    try {
      const responseData = await apiRequest({
        method: "POST",
        url: "/api2/sd/updateEachDeduction",
        data: {
          clickEmpCode: clickEmpCode,
          nmTax: nmTax,
          amtTax: amtTax,
          belongingDate: belongingDate,
          payDay: payDay,
          searchTaxOrder: searchTaxOrder,
        },
      });
      const searchTaxInfo = responseData.searchTaxInfo;
      handleSearchTax(searchTaxInfo);
    } catch (error) {
      console.error("Failed to fetch emp data:", error);
    }
    return sendResult;
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

  const columnsItem1 = useMemo(
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
          const isChecked = checkedRows.includes(original?.code);
          return (
            <input
              type="checkbox"
              // 행의 체크박스가 클릭될 때의 동작을 handleRowCheckboxClick 함수에 위임, 해당 행의 코드를 인자로 전달
              checked={isChecked}
              onChange={() => {
                handleRowCheckboxClick(original?.code);
              }}
            />
          );
        },
      },
      {
        Header: "Code",
        accessor: "code",
        width: "30%",
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
              className={original.code}
              value={inputValue}
              onClick={handleInputClick}
              onChange={handleInputChange}
              readOnly={true}
            />
          );
        },
      },
      {
        Header: "사원",
        accessor: "employee",
        width: "30%",
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
              readOnly={true}
            />
          );
        },
      },
      {
        Header: "직급",
        accessor: "position",
        width: "30%",
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
              readOnly={true}
            />
          );
        },
      },
    ],
    [belongingDate, payDay, searchTaxOrder, checkedRows, empList],
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
        width: "55%",
        accessor: "amt_allowance",
        id: "amt_allowance",
        Cell: ({ cell: { value } }) => {
          const [inputValue, setInputValue] = React.useState(value || "");
          const handleInputChange = (e) => {
            console.log(clickEmpCode);
            setInputValue(e.target.value);
            console.log("inputValue" + typeof e.target.value);
            console.log("바뀜");
          };
          const insertPayAmount = (e) => {
            const insertPay = e.target.value; //입력한 금액
            const clickedCode = clickEmpCode; //클릭한 사원 코드
            if (
              inputValue !== "" &&
              inputValue !== Number(beforePay).toLocaleString() &&
              inputValue != beforePay
            ) {
              if (!beforePay) {
                //신규 급여 insert
                handleInsertData(clickedCode, insertPay);
                console.log("신규 작성 조건");
              } else {
                //기존 급여 update
                handleUpdateData(clickEmpCode, insertPay);
                console.log("급여 수정 조건");
              }
            }

            if (inputValue === "") {
              console.log("삭제해야해~");
              handleDeletePayData([clickEmpCode]);
            }
          };
          return (
            <Input
              id="price-input"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={(e) => insertPayAmount(e)}
              className={"doubleLine"}
              type="price"
              align="right"
              readOnly={
                !empList ||
                empList.length === 0 ||
                !clickEmpCode ||
                clickEmpCode.trim() === ""
              }
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
        Header: "공제항목",
        accessor: "nm_tax",
        id: "nm_tax",
      },
      {
        Header: "금액",
        width: "55%",
        accessor: "amt_allowance",
        id: "amt_allowance",
        Cell: ({ cell: { value }, row: { original } }) => {
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
              onChange={handleInputChange}
              className={"doubleLine"}
              type="price"
              align="right"
              readOnly={
                !empList ||
                empList.length === 0 ||
                !clickEmpCode ||
                clickEmpCode.trim() === ""
              }
              onKeyDown={(e) =>
                handleUpdateEachDeduction(original.nm_tax, e.target.value)
              }
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
      amt_allowance: searchTax.amtAllowance,
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
        Header: "금액",
        width: "55%",
        accessor: "amt_allowance",
        id: "amt_allowance",
        Cell: ({ cell: { value } }) => {
          const [inputValue, setInputValue] = React.useState(value);
          const handleInputChange = (e) => {
            console.log(e.target.value);
            setInputValue(e.target.value);
          };
          return (
            <Input
              id="price-input"
              value={inputValue}
              onChange={handleInputChange}
              type="price"
              align="right"
              readOnly={true}
            />
          );
        },
      },
    ],
    [searchTax],
  );
  //item5
  const dummyItem5 = [
    {
      nm_tax: "국민연금",
      amt_allowance: searchTax.nationalPension,
    },
    {
      nm_tax: "건강보험",
      amt_allowance: searchTax.healthInsurance,
    },
    {
      nm_tax: "고용보험",
      amt_allowance: searchTax.employmentInsurance,
    },
    {
      nm_tax: "장기요양보험료",
      amt_allowance: searchTax.longtermNursingInsurance,
    },
    {
      nm_tax: "소득세",
      amt_allowance: searchTax.incomeTax,
    },
    {
      nm_tax: "지방소득세",
      amt_allowance: searchTax.localIncomeTax,
    },
  ];
  const columnsItem5 = React.useMemo(
    () => [
      {
        Header: "공제항목",
        accessor: "nm_tax",
        id: "nm_tax",
      },
      {
        Header: "금액",
        width: "55%",
        accessor: "amt_allowance",
        id: "amt_allowance",
        Cell: ({ cell: { value } }) => {
          const [inputValue, setInputValue] = React.useState(value);
          const handleInputChange = (e) => {
            console.log(e.target.value);
            setInputValue(e.target.value);
          };
          return (
            <Input
              id="price-input"
              value={inputValue}
              onChange={handleInputChange}
              type="price"
              align="right"
              readOnly={true}
            />
          );
        },
      },
    ],
    [searchTax],
  );

  const [payDayList, setPayDayList] = useState([]); // 모달창 지급일 정보
  const dataModalPayDayList = useMemo(
    () =>
      payDayList.map((list) => ({
        mmBelong: list.mmBelong,
        dtAllowance: list.dtAllowance,
        cntPeople: list.cntPeople,
        amtTotalPay: changeFormat(list.amtTotalPay),
      })),
    [payDayList],
  );
  const columnsModal = useMemo(
    () => [
      {
        Header: "귀속월",
        accessor: "mmBelong",
        width: "15%",
        id: "mmBelong",
        Cell: ({ cell: { value }, row: { original } }) => {
          const handleSearchPayDay = () => {
            handleFetchEmpData2(original);
          };
          const handleSetClickPayDay = () => {
            handleSetSearchList(original);
          };
          return (
            <Input
              value={original?.mmBelong}
              onDoubleClick={handleSearchPayDay}
              onClick={handleSetClickPayDay}
              readOnly={true}
            />
          );
        },
      },
      {
        Header: "지급일자",
        accessor: "dtAllowance",
        width: "30%",
        id: "dtAllowance",
        Cell: ({ cell: { value }, row: { original } }) => {
          const handleSearchPayDay = () => {
            handleFetchEmpData2(original);
          };
          const handleSetClickPayDay = () => {
            handleSetSearchList(original);
          };
          return (
            <Input
              value={(original?.dtAllowance || "").replace(
                /(\d{4})(\d{2})(\d{2})/,
                "$1-$2-$3",
              )}
              onDoubleClick={handleSearchPayDay}
              onClick={handleSetClickPayDay}
              readOnly={true}
            />
          );
        },
      },
      {
        Header: "순인원",
        accessor: "cntPeople",
        width: "15%",
        id: "cntPeople",
        Cell: ({ cell: { value }, row: { original } }) => {
          const handleSearchPayDay = () => {
            handleFetchEmpData2(original);
          };
          const handleSetClickPayDay = () => {
            handleSetSearchList(original);
          };
          return (
            <Input
              value={original?.cntPeople}
              onDoubleClick={handleSearchPayDay}
              onClick={handleSetClickPayDay}
              readOnly={true}
            />
          );
        },
      },
      {
        Header: "총지급액",
        accessor: "amtTotalPay",
        width: "40%",
        id: "amtTotalPay",
        Cell: ({ cell: { value }, row: { original } }) => {
          const handleSearchPayDay = () => {
            handleFetchEmpData2(original);
          };
          const handleSetClickPayDay = () => {
            handleSetSearchList(original);
          };
          return (
            <Input
              value={original?.amtTotalPay}
              onDoubleClick={handleSearchPayDay}
              onClick={handleSetClickPayDay}
              type="price"
              align="right"
              readOnly={true}
            />
          );
        },
      },
    ],
    [payDayList],
  );

  const handleSetSearchList = (original) => {
    console.log("payDay : " + original.dtAllowance);
    setClickPayDay({
      mmBelong: original.mmBelong,
      dtAllowance: original.dtAllowance,
    });
  };

  // 알림창 표시 상태 관리(지급일자)
  const [showAlert, setShowAlert] = React.useState(false);

  const handleCloseAlert = () => {
    setShowAlert(false); // 알림창 표시 상태를 false로 설정
  };
  const handleOpenAlert = () => {
    console.log("alert 나오니");
    setShowAlert(true); // 알림창 표시 상태를 false로 설정
  };

  const handleConfirm = () => {
    handleFetchEmpData2(clickPayDay);
    closeModal();
    handleCloseAlert();
  };

  // 알림창 표시 상태 관리(급여자료 삭제)
  const [deleteAlert, setDeleteAlert] = React.useState(false);

  const handleDeleteCloseAlert = () => {
    setDeleteAlert(false); // 알림창 표시 상태를 false로 설정
  };
  const handleDeleteOpenAlert = () => {
    if (checkedRows.length === 0) {
      return;
    }
    setDeleteAlert(true); // 알림창 표시 상태를 false로 설정
  };

  const handleDeleteConfirm = () => {
    handleDeletePayData(checkedRows);
    handleDeleteCloseAlert();
  };

  // 알림창 표시 상태 관리(세율변경)
  const [taxAlert, setTaxAlert] = React.useState(false);

  const handleTaxCloseAlert = () => {
    setTaxAlert(false); // 알림창 표시 상태를 false로 설정
  };
  const handleTaxOpenAlert = () => {
    setTaxAlert(true); // 알림창 표시 상태를 false로 설정
  };

  const handleTaxConfirm = () => {
    handleUpdateTaxList();
    handleTaxCloseAlert();
    closeModal2();
  };
  //적용년도
  const [applyYear, setApplyYear] = useState("2023");

  const changeTaxList = (e) => {
    const newApplyYear = e.target.value;
    console.log(newApplyYear);
    setApplyYear(newApplyYear);
    handleGetTaxList(newApplyYear);
  };

  const [taxList, setTaxList] = useState([]); // 모달창 지급일 정보
  const dataModalTaxList = useMemo(
    () =>
      taxList.map((list) => ({
        seqTaxRate: list.seqTaxRate,
        cdTaxRate: list.cdTaxRate,
        nmTaxRate: list.nmTaxRate,
        rateTax: figureFormat(list.rateTax),
      })),
    [taxList],
  );
  const [editTaxList, setEditTaxList] = useState({});
  const columnsModal2 = useMemo(
    () => [
      {
        Header: "Code",
        accessor: "cdTaxRate",
        width: "15%",
        id: "cdTaxRate",
        Cell: ({ cell: { value }, row: { original } }) => {
          return <Input value={original?.cdTaxRate} readOnly={true} />;
        },
      },
      {
        Header: "항목명",
        accessor: "nmTaxRate",
        width: "45%",
        id: "nmTaxRate",
        Cell: ({ cell: { value }, row: { original } }) => {
          return <Input value={original?.nmTaxRate} readOnly={true} />;
        },
      },
      {
        Header: "적용세율(%)",
        accessor: "rateTax",
        width: "25%",
        id: "rateTax",
        Cell: ({ cell: { value }, row: { original } }) => {
          const [inputValue, setInputValue] = useState(original.rateTax);
          const handleInputChange = (e) => {
            let changeValue = e.target.value;
            setInputValue(changeValue);
          };
          const handleBlur = (e) => {
            let newValue = e.target.value;
            // 소수점이 있는데, 소수 부분이 0이라면 정수로 변환
            if (
              newValue.includes(".") &&
              parseFloat(newValue) === parseInt(newValue)
            ) {
              newValue = parseInt(newValue).toString();
            }
            // 소수 부분의 끝이 0이라면 0을 제거
            if (newValue.includes(".")) {
              newValue = parseFloat(newValue).toString();
            }
            setInputValue(newValue);
            setEditTaxList(
              editTaxList.map((item) =>
                item.seqTaxRate === original.seqTaxRate
                  ? { ...item, rateTax: newValue }
                  : item,
              ),
            );
          };
          return (
            <Input
              type="figure"
              onChange={handleInputChange}
              value={inputValue}
              className={"doubleLine"}
              onBlur={handleBlur}
              onKeyDown={handleBlur}
            />
          );
        },
      },
    ],
    [taxList],
  );

  // 이메일 발송 alert
  const [emailAlert, setEmailAlert] = React.useState(false);

  const handleEmailCloseAlert = () => {
    setEmailAlert(false); // 알림창 표시 상태를 false로 설정
  };
  const handleEmailOpenAlert = () => {
    setEmailAlert(true); // 알림창 표시 상태를 false로 설정
  };

  const handleEmailConfirm = () => {
    if (checkedRows.length > 0) {
      const sendResult = handleSendEmail();
      console.log(sendResult);
      setCheckedRows([]);
    }
    handleEmailCloseAlert();
    setCheckedRows([]);
  };

  // 이메일 발송 성공 alert
  const [emailSendAlert, setEmailSendAlert] = React.useState(false);

  const handleEmailSendCloseAlert = () => {
    setEmailSendAlert(false); // 알림창 표시 상태를 false로 설정
  };
  const handleEmailSendOpenAlert = () => {
    setEmailSendAlert(true); // 알림창 표시 상태를 false로 설정
  };

  const handleEmailSendConfirm = () => {
    handleEmailSendCloseAlert();
  };

  // 조회 조건 alert
  const [searchAlert, setSearchAlert] = React.useState(false);

  const handleSearchCloseAlert = () => {
    setSearchAlert(false); // 알림창 표시 상태를 false로 설정
  };
  const handleSearchOpenAlert = () => {
    setSearchAlert(true); // 알림창 표시 상태를 false로 설정
  };

  const handleSearchConfirm = () => {
    handleSearchCloseAlert();
  };

  return (
    <>
      {showAlert && (
        <SweetAlert
          text="해당 귀속년월/지급일로 조회하시겠습니까?"
          showCancel={true}
          //type="success"
          // type="warning"
          //type="error"
          type="question"
          onConfirm={handleConfirm}
          onCancel={handleCloseAlert}
        />
      )}
      {deleteAlert && (
        <SweetAlert
          text="선택한 사원(들)의 급여정보를 삭제하시겠습니까?"
          showCancel={true}
          type="error"
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCloseAlert}
        />
      )}
      {taxAlert && (
        <SweetAlert
          text={
            checkedRows.length > 0
              ? `선택한 ${checkedRows.length}명의 사원만 변경한 세율을 반영하시겠습니까?`
              : "전체 사원에 변경한 세율을 반영하시겠습니까?"
          }
          showCancel={true}
          type="warning"
          onConfirm={handleTaxConfirm}
          onCancel={handleTaxCloseAlert}
        />
      )}
      {emailAlert && (
        <SweetAlert
          text={
            checkedRows.length > 0
              ? `선택한 ${checkedRows.length}명의 사원에게 변경한 급여메일을 발송하시겠습니까?`
              : "체크된 사원이 없습니다. 사원을 체크하시고 다시 시도해 주세요"
          }
          showCancel={true}
          type={checkedRows.length > 0 ? "question" : "warning"}
          onConfirm={handleEmailConfirm}
          onCancel={handleEmailCloseAlert}
        />
      )}
      {searchAlert && (
        <SweetAlert
          text={"조회 조건 사항을 모두 선택해 주세요"}
          type="warning"
          onConfirm={handleSearchConfirm}
          showCancel={false}
          confirmText="확인"
        />
      )}

      {emailSendAlert && (
        <SweetAlert
          text={"메일을 성공적으로 발송했습니다."}
          type="success"
          onConfirm={handleEmailSendConfirm}
          showCancel={false}
          confirmText="확인"
        />
      )}

      <div className="pageHeader">
        <div className="innerBox fxSpace">
          <PageHeaderName text="급여자료입력" />
          <div className="fxAlignCenter">
            <div className="btnWrapper textBtnWrap">
              <PageHeaderTextButton text="지급일자" onClick={openModal} />
              <CustomModal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                overlayStyle={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid gray",
                  width: "600px",
                  height: "500px",
                }}
              >
                <PageHeaderName text="지급일자" />
                <div className="test2" style={{ height: "380px" }}>
                  <Table
                    height="500px"
                    columns={columnsModal}
                    data={dataModalPayDayList}
                  />
                </div>
                <div className="test">
                  <CustomButton
                    backgroundColor={"var(--color-primary-blue)"}
                    color={"var(--color-primary-white)"}
                    onClick={handleOpenAlert}
                    text={"선택"}
                  />
                  <CustomButton
                    backgroundColor={"var(--color-primary-gray)"}
                    color={"var(--color-primary-white)"}
                    onClick={closeModal}
                    text={"취소"}
                  />
                </div>
              </CustomModal>
              <PageHeaderTextButton text="세율확인/변경" onClick={openModal2} />
              <CustomModal
                isOpen={modalIsOpen2}
                onRequestClose={closeModal2}
                overlayStyle={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid gray",
                  width: "600px",
                  height: "450px",
                }}
              >
                <PageHeaderName text="세율확인/변경" />
                <div className="test2">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "end",
                      alignItems: "center",
                      marginBottom: "5px",
                    }}
                  >
                    <span style={{ marginRight: "10px" }}>적용년도</span>
                    <CustomSelect
                      label="정렬"
                      id="sd-order-category"
                      width={"180px"}
                      options={[
                        { value: "2023", label: "2023년" },
                        { value: "2022", label: "2022년" },
                        { value: "2021", label: "2021년" },
                        { value: "2020", label: "2020년" },
                      ]}
                      value={applyYear}
                      onChange={changeTaxList}
                    />
                  </div>
                  <div>
                    <Table
                      height="250px"
                      columns={columnsModal2}
                      data={dataModalTaxList}
                    />
                  </div>
                </div>
                <div className="test">
                  <CustomButton
                    backgroundColor={"var(--color-primary-blue)"}
                    color={"var(--color-primary-white)"}
                    onClick={handleTaxOpenAlert}
                    text={"적용"}
                  />
                  <CustomButton
                    backgroundColor={"var(--color-primary-gray)"}
                    color={"var(--color-primary-white)"}
                    onClick={closeModal2}
                    text={"취소"}
                  />
                </div>
              </CustomModal>
              <PageHeaderTextButton
                text="급여메일보내기"
                onClick={handleEmailOpenAlert}
              />
            </div>
            <div className="iconBtnWrap">
              <PageHeaderIconButton
                btnName="print"
                imageSrc={Print}
                altText="프린트"
                onClick={handlePrintPdf}
                disabled={!clickEmpCode ? true : false}
              />
              <PageHeaderIconButton
                btnName="delete"
                imageSrc={Delete}
                altText="삭제"
                onClick={handleDeleteOpenAlert}
                disabled={checkedRows.length > 0 ? false : true}
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
                    onClick={resetStates}
                    readOnly={true}
                  />
                </div>
              </div>
              <div className="searchBarName">
                <div className="searchBarNameCalender">
                  <span>지급일</span>
                  <CustomCalendar
                    width="150"
                    show="top"
                    value={payDay}
                    onChange={handlePayDateChange}
                    onClick={resetStates}
                    readOnly={true}
                  />
                </div>
              </div>
              <SearchBarBox
                label="정렬"
                id="sd-order-category"
                options={[
                  { value: "0", label: "0. 코드순" },
                  { value: "1", label: "1. 이름순" },
                  { value: "2", label: "2. 입사일순" },
                  { value: "3", label: "3. 직급순" },
                ]}
                value={searchOrder}
                onChange={handleSearchTypeChange}
                // onClick={resetStates}
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
              height="97%"
            />
            <table className="sd-empList-calTable">
              <tbody>
                <tr>
                  <td style={{ width: "10.5%" }}></td>
                  <td style={{ width: "58%" }}>인 원 ( 퇴 직 )</td>
                  <td style={{ width: "15%" }}>{empList.length}</td>
                  <td style={{ width: "15%" }}></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="sd-item sd-item2">
            <Table data={dummyItem2} columns={columnsItem2} />
            <table className="sd-allowance-top-calTable">
              <tbody>
                <tr>
                  <td>지급액 계</td>
                  <td style={{ width: "55%" }}>
                    <p className="sd-price">{pay}</p>
                  </td>
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
                  <td style={{ width: "55%" }}>
                    <p className="sd-price">{personalTax.deduction}</p>
                  </td>
                </tr>
                <tr>
                  <td>차인지급액</td>
                  <td style={{ width: "55%" }}>
                    <p className="sd-price">{personalTax.differencePayment}</p>
                  </td>
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
                  { value: "2", label: "2. 전체사원_연간" },
                  { value: "3", label: "3. 현재사원_연간" },
                ]}
                value={searchTaxOrder}
                onChange={handleSearchTaxTypeChange}
                fixed={!empList || empList.length === 0}
              />
            </div>
            <div className="sd-tableArea">
              <Table data={dummyItem4} columns={columnsItem4} />
              <table className="sd-search-allowance-top-calTable">
                <tbody>
                  <tr>
                    <td>지급액 계</td>
                    <td style={{ width: "55%" }}>
                      <p className="sd-price">{searchTax.amtAllowance}</p>
                    </td>
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
                  <td style={{ width: "55%" }}>
                    <p className="sd-price">{totalTax.deduction}</p>
                  </td>
                </tr>
                <tr>
                  <td>차인지급액</td>
                  <td style={{ width: "55%" }}>
                    <p className="sd-price">{totalTax.differencePayment}</p>
                  </td>
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
                <p>
                  {empDetailInfo.hireDate
                    ? dateFormat(empDetailInfo.hireDate)
                    : ""}
                </p>
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
                <p>
                  {empDetailInfo.leavingDate
                    ? dateFormat(empDetailInfo.leavingDate)
                    : ""}
                </p>
                <label htmlFor="">부서</label>
                <p>{empDetailInfo.department}</p>
                <label htmlFor="">내/외국인</label>
                <p>{empDetailInfo.domesticForeign}</p>
                <label htmlFor="">가족수(명)</label>
                <p>{empDetailInfo.family}</p>
                <label htmlFor="">병역/전역</label>
                <p>
                  {empDetailInfo.milService}/{empDetailInfo.milDischarge}
                </p>
                <label htmlFor="">장애구분</label>
                <p>{empDetailInfo.obstacle}</p>
                <label htmlFor="">자격증(개)</label>
                <p>{empDetailInfo.certificate}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SalaryData;
