import React, { useRef, useState, useEffect, useMemo } from "react";
import Table from "../../TablesLib/Table";
import CustomCalender from "../../Contents/CustomCalendar";
import useApiRequest from "../../Services/ApiRequest";
//import Input from "../../Contents/Input";
import Input from "../../Contents/InputTest";
import CustomSelect from "../../Contents/CustomSelect";

const HrEdu = ({ cdEmp }) => {
  const apiRequest = useApiRequest();
  const [eduList, setEduList] = useState([]);
  const [showInsertRow, setShowInsertRow] = useState(false);

  const isFirstRender = useRef(true);

  console.log("학력 페이지 ******");
  console.log(cdEmp);

  useEffect(() => {
    // 첫 렌더링인지 체크
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    // cdEmp가 undefined일 때는 아무것도 하지 않고 리턴
    if (cdEmp === undefined) {
      return;
    }

    setShowInsertRow(false);
    handleSendEmpCodeGetEduData(cdEmp);
  }, [cdEmp]);

  const handleSendEmpCodeInsertEduData = async (
    cdEmp,
    accessor,
    inputValue,
  ) => {
    console.log("handleSendEmpCodeInsertEduData ***************************");
    console.log(inputValue);
    if (inputValue === "" || inputValue === " ") {
      console.log("**********************");
    }
    if (
      cdEmp == null ||
      cdEmp === "" ||
      cdEmp === undefined ||
      inputValue === "" ||
      inputValue === " "
    ) {
      console.log("값이 없어요 ~~~~~~~~~~~~~~~~~");
      return;
    }
    try {
      const responseData = await apiRequest({
        method: "GET",
        url: `/api2/hr/insertEduData?cdEmp=${cdEmp}&${accessor}=${inputValue}`,
      });
    } catch (error) {
      console.error("api 요청 실패:", error);
    }
    handleSendEmpCodeGetEduData(cdEmp);
  };

  const handleSendEmpCodeGetEduData = async (cdEmp) => {
    if (cdEmp == null || cdEmp === "" || cdEmp === undefined) {
      return;
    }
    try {
      const responseData = await apiRequest({
        method: "GET",
        url: `/api2/hr/getEduDataList?cdEmp=${cdEmp}`,
      });
      setEduList(Array.isArray(responseData) ? responseData : []); // 배열 확인
      setShowInsertRow(false);
    } catch (error) {
      console.error("api 요청 실패:", error);
    }
  };
  const handleSendEmpCodeUpdateEduData = async (
    seqEducation,
    accessor,
    inputValue,
  ) => {
    console.log("현재 inputValue : " + inputValue);
    console.log("현재 inputValue : " + inputValue);
    console.log("현재 inputValue : " + inputValue);
    if (inputValue == null || inputValue === "" || inputValue === undefined) {
      console.log("값의 변화가 없음 api요청 안감");
      return;
    }

    try {
      const responseData = await apiRequest({
        method: "GET",
        url: `/api2/hr/updateEduData?seqEducation=${seqEducation}&${accessor}=${inputValue}`,
      });
    } catch (error) {
      console.error("api 요청 실패:", error);
    }
    //handleSendEmpCodeGetFamilyData(cdEmp);
  };

  const handleDateChange = async (value, name, seqEducation) => {
    console.log("handleDateChange ******************");

    if (cdEmp == null || cdEmp === "" || cdEmp === undefined) {
      return;
    }
    value = value.replace(/-/g, "");

    if (
      seqEducation === null ||
      seqEducation === undefined ||
      seqEducation === ""
    ) {
      // 학력고유 번호가 없을땐 insert
      try {
        const responseData = await apiRequest({
          method: "GET",
          url: `/api2/hr/insertEduData?cdEmp=${cdEmp}&${name}=${value}`,
        });
        console.log("요청성공!!!!!!!!!!!!!!!!");
      } catch (error) {
        console.error("api 요청 실패:", error);
      }
      handleSendEmpCodeGetEduData(cdEmp);
    } else {
      // 학력고유 번호가 있을땐 update
      console.log("요청 전!!!!!!!!!!!!!!!!!!!!!!");
      try {
        const responseData = await apiRequest({
          method: "GET",
          url: `/api2/hr/updateEduData?seqEducation=${seqEducation}&${name}=${value}`,
        });
        console.log("요청성공!!!!!!!!!!!!!!!!");
      } catch (error) {
        console.error("Failed to fetch emp data:", error);
      }
      updateEduListItem(seqEducation, name, value);
    }
  };
  // 1. `eduList`의 특정 항목을 업데이트하는 helper 함수
  const updateEduListItem = (seqEducation, name, value) => {
    const updatedEduList = eduList.map((edu) => {
      if (edu.seqEducation === seqEducation) {
        return {
          ...edu,
          [name]: value,
        };
      }
      return edu;
    });
    setEduList(updatedEduList);
  };

  const data = React.useMemo(
    () =>
      eduList.map((edu) => ({
        seqEducation: edu.seqEducation, // 학력 고유값
        cdEmp: edu.cdEmp, // 사원코드
        nmSchool: edu.nmSchool, // 학교명
        dtEntrance: edu.dtEntrance, // 입학일
        dtGraduate: edu.dtGraduate, // 졸업일
        fgAcademic: edu.fgAcademic, // 학적구분
        addrSchool: edu.addrSchool, // 소재지
        nmMajor: edu.nmMajor, // 전공과목
        nmSubMajor: edu.nmSubMajor, // 부전공
        nmDegree: edu.nmDegree, // 학위
        fgDaynight: edu.fgDaynight, // 주야
        nmBranchSchool: edu.nmBranchSchool, // 분교
      })),
    [eduList],
  );
  const columns = useMemo(
    () => [
      {
        Header: "학교명",
        accessor: "nmSchool",
        id: "nmSchool",
        Cell: ({ cell: { value }, row: { original } }) => {
          const [inputValue, setInputValue] = React.useState(value || ""); // value가 null일 경우 빈 문자열로 초기화

          const handleInputChange = (e) => {
            setInputValue(e.target.value);
          };

          const handleInputOnBlur = (e) => {
            if (inputValue === "") {
              return;
            }
            if (original == null) {
              // insert
              console.log("인서트 이벤트 실행~~~~~~~~~~");
              console.log(e.target.value);
              handleSendEmpCodeInsertEduData(cdEmp, "nmSchool", e.target.value);
              handleSendEmpCodeGetEduData(cdEmp);
              setInputValue(e.target.value);
            } else {
              // update
              handleSendEmpCodeUpdateEduData(
                original.seqEducation,
                "nmSchool",
                e.target.value,
              );
              setInputValue(e.target.value);
            }
          };

          return (
            <Input
              value={inputValue || ""}
              onChange={handleInputChange}
              isDoubleClick={true}
              onBlur={handleInputOnBlur}
              className={"doubleLine"}
            />
          );
        },
      },
      {
        Header: "입학일",
        accessor: "dtEntrance",
        id: "dtEntrance",
        //width: "9%",
        Cell: ({ cell: { value }, row: { original } }) => {
          const handleInputChange = (e) => {
            const seqEducationValue = original ? original.seqEducation : null;
            handleDateChange(e, "dtEntrance", seqEducationValue);
          };
          return (
            <CustomCalender
              className="hrInfoBaseInput"
              value={value || ""}
              name="dtEntrance"
              readOnly={true}
              onChange={handleInputChange}
            />
          );
        },
      },
      {
        Header: "졸업일",
        accessor: "dtGraduate",
        id: "dtGraduate",
        //width: "9%",
        Cell: ({ cell: { value }, row: { original } }) => {
          const handleInputChange = (e) => {
            const seqEducationValue = original ? original.seqEducation : null;
            handleDateChange(e, "dtGraduate", seqEducationValue);
          };
          return (
            <CustomCalender
              className="hrInfoBaseInput"
              value={value || ""}
              name="dtGraduate"
              readOnly={true}
              onChange={handleInputChange}
            />
          );
        },
      },
      {
        Header: "구분",
        accessor: "fgAcademic",
        id: "fgAcademic",
        width: "8%",
        Cell: ({ cell: { value }, row: { original } }) => {
          const [inputValue, setInputValue] = React.useState(value || ""); // value가 null일 경우 빈 문자열로 초기화
          const handleInputChange = (e) => {
            if (original == null) {
              // insert
              console.log("****************");
              handleSendEmpCodeInsertEduData(
                cdEmp,
                "fgAcademic",
                e.target.value,
              );
              console.log("수정요청");
              handleSendEmpCodeGetEduData(cdEmp);
              setInputValue(e.target.value);
            } else {
              // update
              handleSendEmpCodeUpdateEduData(
                original.seqEducation,
                "fgAcademic",
                e.target.value,
              );
              console.log("수정요청");
              setInputValue(e.target.value);
            }
          };
          return (
            <CustomSelect
              className={"hrDetailSelect"}
              options={[
                { value: "0", label: "졸업" },
                { value: "1", label: "중퇴" },
              ]}
              placeholder="선택"
              value={inputValue}
              onChange={handleInputChange}
            />
          );
        },
      },
      {
        Header: "소재지",
        accessor: "addrSchool",
        id: "addrSchool",
        Cell: ({ cell: { value }, row: { original } }) => {
          const [inputValue, setInputValue] = React.useState(value || ""); // value가 null일 경우 빈 문자열로 초기화

          const handleInputChange = (e) => {
            setInputValue(e.target.value);
          };

          const handleInputOnBlur = (e) => {
            if (inputValue === "") {
              return;
            }
            if (original == null) {
              // insert
              handleSendEmpCodeInsertEduData(
                cdEmp,
                "addrSchool",
                e.target.value,
              );
              handleSendEmpCodeGetEduData(cdEmp);
              setInputValue(e.target.value);
            } else {
              // update
              handleSendEmpCodeUpdateEduData(
                original.seqEducation,
                "addrSchool",
                e.target.value,
              );
              setInputValue(e.target.value);
            }
          };

          return (
            <Input
              value={inputValue || ""}
              onChange={handleInputChange}
              isDoubleClick={true}
              onBlur={handleInputOnBlur}
              className={"doubleLine"}
            />
          );
        },
      },
      {
        Header: "전공",
        accessor: "nmMajor",
        id: "nmMajor",
        Cell: ({ cell: { value }, row: { original } }) => {
          const [inputValue, setInputValue] = React.useState(value || ""); // value가 null일 경우 빈 문자열로 초기화

          const handleInputChange = (e) => {
            setInputValue(e.target.value);
          };

          const handleInputOnBlur = (e) => {
            if (inputValue === "") {
              return;
            }
            if (original == null) {
              // insert
              handleSendEmpCodeInsertEduData(cdEmp, "nmMajor", e.target.value);
              handleSendEmpCodeGetEduData(cdEmp);
              setInputValue(e.target.value);
            } else {
              // update
              handleSendEmpCodeUpdateEduData(
                original.seqEducation,
                "nmMajor",
                e.target.value,
              );
              setInputValue(e.target.value);
            }
          };

          return (
            <Input
              value={inputValue || ""}
              onChange={handleInputChange}
              isDoubleClick={true}
              onBlur={handleInputOnBlur}
              className={"doubleLine"}
            />
          );
        },
      },
      {
        Header: "부전공",
        accessor: "nmSubMajor",
        id: "nmSubMajor",
        Cell: ({ cell: { value }, row: { original } }) => {
          const [inputValue, setInputValue] = React.useState(value || ""); // value가 null일 경우 빈 문자열로 초기화

          const handleInputChange = (e) => {
            setInputValue(e.target.value);
          };

          const handleInputOnBlur = (e) => {
            if (inputValue === "") {
              return;
            }
            if (original == null) {
              // insert
              handleSendEmpCodeInsertEduData(
                cdEmp,
                "nmSubMajor",
                e.target.value,
              );
              handleSendEmpCodeGetEduData(cdEmp);
              setInputValue(e.target.value);
            } else {
              // update
              handleSendEmpCodeUpdateEduData(
                original.seqEducation,
                "nmSubMajor",
                e.target.value,
              );
              setInputValue(e.target.value);
            }
          };

          return (
            <Input
              value={inputValue || ""}
              onChange={handleInputChange}
              isDoubleClick={true}
              onBlur={handleInputOnBlur}
              className={"doubleLine"}
            />
          );
        },
      },
      {
        Header: "학위",
        accessor: "nmDegree",
        id: "nmDegree",
        Cell: ({ cell: { value }, row: { original } }) => {
          const [inputValue, setInputValue] = React.useState(value || ""); // value가 null일 경우 빈 문자열로 초기화

          const handleInputChange = (e) => {
            setInputValue(e.target.value);
          };

          const handleInputOnBlur = (e) => {
            if (inputValue === "") {
              return;
            }
            if (original == null) {
              // insert
              handleSendEmpCodeInsertEduData(cdEmp, "nmDegree", e.target.value);
              handleSendEmpCodeGetEduData(cdEmp);
              setInputValue(e.target.value);
            } else {
              // update
              handleSendEmpCodeUpdateEduData(
                original.seqEducation,
                "nmDegree",
                e.target.value,
              );
              setInputValue(e.target.value);
            }
          };

          return (
            <Input
              value={inputValue || ""}
              onChange={handleInputChange}
              isDoubleClick={true}
              onBlur={handleInputOnBlur}
              className={"doubleLine"}
            />
          );
        },
      },
      {
        Header: "주야",
        accessor: "fgDaynight",
        id: "fgDaynight",
        Cell: ({ cell: { value }, row: { original } }) => {
          const [inputValue, setInputValue] = React.useState(value || ""); // value가 null일 경우 빈 문자열로 초기화

          const handleInputChange = (e) => {
            setInputValue(e.target.value);
          };

          const handleInputOnBlur = (e) => {
            if (inputValue === "") {
              return;
            }
            if (original == null) {
              // insert
              handleSendEmpCodeInsertEduData(
                cdEmp,
                "fgDaynight",
                e.target.value,
              );
              handleSendEmpCodeGetEduData(cdEmp);
              setInputValue(e.target.value);
            } else {
              // update
              handleSendEmpCodeUpdateEduData(
                original.seqEducation,
                "fgDaynight",
                e.target.value,
              );
              setInputValue(e.target.value);
            }
          };

          return (
            <Input
              value={inputValue || ""}
              onChange={handleInputChange}
              isDoubleClick={true}
              onBlur={handleInputOnBlur}
              className={"doubleLine"}
            />
          );
        },
      },
      {
        Header: "분교",
        accessor: "nmBranchSchool",
        id: "nmBranchSchool",
        Cell: ({ cell: { value }, row: { original } }) => {
          const [inputValue, setInputValue] = React.useState(value || ""); // value가 null일 경우 빈 문자열로 초기화

          const handleInputChange = (e) => {
            setInputValue(e.target.value);
          };

          const handleInputOnBlur = (e) => {
            if (inputValue === "") {
              return;
            }
            if (original == null) {
              // insert
              handleSendEmpCodeInsertEduData(
                cdEmp,
                "nmBranchSchool",
                e.target.value,
              );
              handleSendEmpCodeGetEduData(cdEmp);
              setInputValue(e.target.value);
            } else {
              // update
              handleSendEmpCodeUpdateEduData(
                original.seqEducation,
                "nmBranchSchool",
                e.target.value,
              );
              setInputValue(e.target.value);
            }
          };

          return (
            <Input
              value={inputValue || ""}
              onChange={handleInputChange}
              isDoubleClick={true}
              onBlur={handleInputOnBlur}
              className={"doubleLine"}
            />
          );
        },
      },
    ],
    [eduList],
  );

  return (
    <Table
      data={data}
      columns={columns}
      insertRow={true}
      showInsertRow={showInsertRow}
      setShowInsertRow={setShowInsertRow}
      //scrollHeight={"700"}
    />
  );
};

export default HrEdu;
