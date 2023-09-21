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

const SalaryData = (props) => {
  // 수정 가능 여부
  const [edit, setEdit] = useState(false);
  // 입력 급여
  const [pay, setPay] = useState("");
  // 기존(조회된) 급여
  const [beforePay, setBeforePay] = useState("");
  // 모달 여닫기
  const [modalIsOpen, setModalIsOpen] = useState(false);
  // 사원 조회
  const [empList, setEmpList] = useState([]);
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
  const handleSearchTypeChange = (e) => {
    setSearchOrder(e.target.value);
  };
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
      military: "",
      obstacle: "",
      certificate: "",
    });
  };

  //조회 버튼 클릭시 사원리스트 불러오기(select)
  const handleFetchEmpData = async () => {
    // data 객체의 속성들이 undefined, null 또는 공백인지 확인
    if (!belongingDate || !payDay) {
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
          searchTaxOrder: searchTaxOrder,
        },
      });
      const searchTaxInfo = responseData.searchTaxInfo;
      const formattedDeducation = Object.fromEntries(
        Object.entries(searchTaxInfo).map(([key, value]) => [
          key,
          changeFormat(value),
        ]),
      );
      const totalAmount = Object.keys(searchTaxInfo).reduce((acc, key) => {
        if (key !== "amtAllowance") {
          return acc + searchTaxInfo[key];
        }
        return acc;
      }, 0);
      const minAmt = searchTaxInfo.amtAllowance - totalAmount;
      setEmpList(responseData.empSearch);
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
      const formattedEmpTaxInfo = Object.fromEntries(
        Object.entries(empTaxInfo).map(([key, value]) => [
          key,
          changeFormat(value),
        ]),
      );
      const formattedSearchTaxInfo = Object.fromEntries(
        Object.entries(searchTaxInfo).map(([key, value]) => [
          key,
          changeFormat(value),
        ]),
      );
      const empTotalTax = Object.keys(empTaxInfo).reduce((acc, key) => {
        if (key !== "amtAllowance") {
          return acc + empTaxInfo[key];
        }
        return acc;
      }, 0);
      const searchTotalTax = Object.keys(searchTaxInfo).reduce((acc, key) => {
        if (key !== "amtAllowance") {
          return acc + searchTaxInfo[key];
        }
        return acc;
      }, 0);
      const empDiffPayAmt = empTaxInfo.amtAllowance - empTotalTax;
      const searchDiffPayAmt = searchTaxInfo.amtAllowance - searchTotalTax;
      setPay(formattedEmpTaxInfo.amtAllowance);
      setBeforePay(formattedEmpTaxInfo.amtAllowance);
      setTaxAmount({
        nationalPension: formattedEmpTaxInfo.nationalPension,
        healthInsurance: formattedEmpTaxInfo.healthInsurance,
        employmentInsurance: formattedEmpTaxInfo.employmentInsurance,
        longtermNursingInsurance: formattedEmpTaxInfo.longtermNursingInsurance,
        incomeTax: formattedEmpTaxInfo.incomeTax,
        localIncomeTax: formattedEmpTaxInfo.localIncomeTax,
      });
      setSearchTax({
        amtAllowance: formattedSearchTaxInfo.amtAllowance,
        nationalPension: formattedSearchTaxInfo.nationalPension,
        healthInsurance: formattedSearchTaxInfo.healthInsurance,
        employmentInsurance: formattedSearchTaxInfo.employmentInsurance,
        longtermNursingInsurance:
          formattedSearchTaxInfo.longtermNursingInsurance,
        incomeTax: formattedSearchTaxInfo.incomeTax,
        localIncomeTax: formattedSearchTaxInfo.localIncomeTax,
      });
      setPersonalTax({
        deduction: changeFormat(empTotalTax),
        differencePayment: changeFormat(empDiffPayAmt),
      });
      setTotalTax({
        deduction: changeFormat(searchTotalTax),
        differencePayment: changeFormat(searchDiffPayAmt),
      });
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
      const formattedEmpTaxInfo = Object.fromEntries(
        Object.entries(empTaxInfo).map(([key, value]) => [
          key,
          changeFormat(value),
        ]),
      );
      const formattedSearchTaxInfo = Object.fromEntries(
        Object.entries(searchTaxInfo).map(([key, value]) => [
          key,
          changeFormat(value),
        ]),
      );
      const empTotalTax = Object.keys(empTaxInfo).reduce((acc, key) => {
        if (key !== "amtAllowance") {
          return acc + empTaxInfo[key];
        }
        return acc;
      }, 0);
      const searchTotalTax = Object.keys(searchTaxInfo).reduce((acc, key) => {
        if (key !== "amtAllowance") {
          return acc + searchTaxInfo[key];
        }
        return acc;
      }, 0);
      const empDiffPayAmt = empTaxInfo.amtAllowance - empTotalTax;
      const searchDiffPayAmt = searchTaxInfo.amtAllowance - searchTotalTax;
      setPay(formattedEmpTaxInfo.amtAllowance);
      setBeforePay(formattedEmpTaxInfo.amtAllowance);
      setTaxAmount({
        nationalPension: formattedEmpTaxInfo.nationalPension,
        healthInsurance: formattedEmpTaxInfo.healthInsurance,
        employmentInsurance: formattedEmpTaxInfo.employmentInsurance,
        longtermNursingInsurance: formattedEmpTaxInfo.longtermNursingInsurance,
        incomeTax: formattedEmpTaxInfo.incomeTax,
        localIncomeTax: formattedEmpTaxInfo.localIncomeTax,
      });
      setSearchTax({
        amtAllowance: formattedSearchTaxInfo.amtAllowance,
        nationalPension: formattedSearchTaxInfo.nationalPension,
        healthInsurance: formattedSearchTaxInfo.healthInsurance,
        employmentInsurance: formattedSearchTaxInfo.employmentInsurance,
        longtermNursingInsurance:
          formattedSearchTaxInfo.longtermNursingInsurance,
        incomeTax: formattedSearchTaxInfo.incomeTax,
        localIncomeTax: formattedSearchTaxInfo.localIncomeTax,
      });
      setPersonalTax({
        deduction: changeFormat(empTotalTax),
        differencePayment: changeFormat(empDiffPayAmt),
      });
      setTotalTax({
        deduction: changeFormat(searchTotalTax),
        differencePayment: changeFormat(searchDiffPayAmt),
      });
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
      const formattedEmpTaxInfo = Object.fromEntries(
        Object.entries(empTaxInfo).map(([key, value]) => [
          key,
          changeFormat(value),
        ]),
      );
      const formattedSearchTaxInfo = Object.fromEntries(
        Object.entries(searchTaxInfo).map(([key, value]) => [
          key,
          changeFormat(value),
        ]),
      );
      const empTotalTax = Object.keys(empTaxInfo).reduce((acc, key) => {
        if (key !== "amtAllowance") {
          return acc + empTaxInfo[key];
        }
        return acc;
      }, 0);
      const searchTotalTax = Object.keys(searchTaxInfo).reduce((acc, key) => {
        if (key !== "amtAllowance") {
          return acc + searchTaxInfo[key];
        }
        return acc;
      }, 0);
      const empDiffPayAmt = empTaxInfo.amtAllowance - empTotalTax;
      const searchDiffPayAmt = searchTaxInfo.amtAllowance - searchTotalTax;
      setPay(formattedEmpTaxInfo.amtAllowance);
      setBeforePay(formattedEmpTaxInfo.amtAllowance);
      setTaxAmount({
        nationalPension: formattedEmpTaxInfo.nationalPension,
        healthInsurance: formattedEmpTaxInfo.healthInsurance,
        employmentInsurance: formattedEmpTaxInfo.employmentInsurance,
        longtermNursingInsurance: formattedEmpTaxInfo.longtermNursingInsurance,
        incomeTax: formattedEmpTaxInfo.incomeTax,
        localIncomeTax: formattedEmpTaxInfo.localIncomeTax,
      });
      setSearchTax({
        amtAllowance: formattedSearchTaxInfo.amtAllowance,
        nationalPension: formattedSearchTaxInfo.nationalPension,
        healthInsurance: formattedSearchTaxInfo.healthInsurance,
        employmentInsurance: formattedSearchTaxInfo.employmentInsurance,
        longtermNursingInsurance:
          formattedSearchTaxInfo.longtermNursingInsurance,
        incomeTax: formattedSearchTaxInfo.incomeTax,
        localIncomeTax: formattedSearchTaxInfo.localIncomeTax,
      });
      setPersonalTax({
        deduction: changeFormat(empTotalTax),
        differencePayment: changeFormat(empDiffPayAmt),
      });
      setTotalTax({
        deduction: changeFormat(searchTotalTax),
        differencePayment: changeFormat(searchDiffPayAmt),
      });
      setClickEmpCode(code);
      console.log(taxAmount.nationalPension);
    } catch (error) {
      console.error("Failed to fetch emp data:", error);
    }
  };

  const handleChangeSearch = async (e) => {
    setSearchOrder(e.target.value);
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
      console.log(searchTaxInfo);
      const formattedDeducation = Object.fromEntries(
        Object.entries(searchTaxInfo).map(([key, value]) => [
          key,
          changeFormat(value),
        ]),
      );
      const totalAmount = Object.keys(searchTaxInfo).reduce((acc, key) => {
        if (key !== "amtAllowance") {
          return acc + searchTaxInfo[key];
        }
        return acc;
      }, 0);
      const minAmt = searchTaxInfo.amtAllowance - totalAmount;
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
    [belongingDate, payDay, searchTaxOrder],
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
            console.log("바뀜");
          };
          const insertPayAmount = (e) => {
            // console.log("입력 급여 : " + inputValue.replaceAll(",", ""));
            // console.log("가져온 급여 : " + beforePay);
            console.log("입력 급여 : " + inputValue);
            console.log("가져온 급여 : " + beforePay);
            const insertPay = e.target.value; //입력한 금액
            const clickedCode = clickEmpCode; //클릭한 사원 코드
            if (
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
        width: "60%",
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
              width={100}
              className={"doubleLine"}
              onChange={handleInputChange}
              type="price"
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
            console.log(e.target.value);
            setInputValue(e.target.value);
          };
          return (
            <Input
              id="price-input"
              value={inputValue}
              width={100}
              className={"doubleLine"}
              onChange={handleInputChange}
              type="price"
            />
          );
        },
      },
    ],
    [searchTax],
  );

  return (
    <>
      <div className="pageHeader">
        <div className="innerBox fxSpace">
          <PageHeaderName text="급여자료입력" />
          <div className="fxAlignCenter">
            <div className="btnWrapper textBtnWrap">
              <PageHeaderTextButton text="세율변경" onClick={openModal} />
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
                    onClick={resetStates}
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
                    onClick={resetStates}
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
                value={searchOrder || "0"}
                onChange={handleSearchTypeChange}
                onClick={resetStates}
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
            <Table data={dummyItem2} columns={columnsItem2} page={"sd"} />
            <table className="sd-allowance-top-calTable">
              <tbody>
                <tr>
                  <td>지급액 계</td>
                  <td>{pay}</td>
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
                  <td>{personalTax.deduction}</td>
                </tr>
                <tr>
                  <td>차인지급액</td>
                  <td>{personalTax.differencePayment}</td>
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
              />
            </div>
            <div className="sd-tableArea">
              <Table data={dummyItem4} columns={columnsItem4} />
              <table className="sd-search-allowance-top-calTable">
                <tbody>
                  <tr>
                    <td>지급액 계</td>
                    <td>{searchTax.amtAllowance}</td>
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
                  <td>{totalTax.deduction}</td>
                </tr>
                <tr>
                  <td>차인지급액</td>
                  <td>{totalTax.differencePayment}</td>
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

export default SalaryData;
