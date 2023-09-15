import React, { useRef, useState, useEffect } from "react";
import Table from "../../TablesLib/Table";
import useApiRequest from "../../Services/ApiRequest";
import Input from "../../Contents/Input";
import CustomSelect from "../../Contents/CustomSelect";

const HrFamily = ({ cdEmp }) => {
  console.log("가족 페이지 ******");
  console.log(cdEmp);
  // prop 이름 변경
  const apiRequest = useApiRequest();
  const [familyList, setfamilyList] = useState([]);
  const [familyEmpCode, setfamilyEmpCode] = useState(cdEmp);
  const [showInsertRow, setShowInsertRow] = useState(false);

  const isFirstRender = useRef(true);

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
    handleSendEmpCodeGetFamilyData(cdEmp); // 함수 호출시 인자로 empCode 전달
    setfamilyEmpCode(cdEmp);
  }, [cdEmp]);

  const handleSendEmpCodeGetFamilyData = async (cdEmp) => {
    try {
      const responseData = await apiRequest({
        method: "GET",
        url: `/api2/hr/getFamilyDataList?cdEmp=${cdEmp}`,
      });
      setfamilyList(Array.isArray(responseData) ? responseData : []); // 배열 확인
      setShowInsertRow(false);
    } catch (error) {
      console.error("api 요청 실패:", error);
    }
  };

  const handleSendEmpCodeUpdateFamilyData = async (
    seqFamily,
    accessor,
    inputValue,
  ) => {
    console.log("현재 inputValue : " + inputValue);
    if (inputValue == null || inputValue === "" || inputValue === undefined) {
      console.log("값의 변화가 없음 api요청 안감");
      return;
    }

    try {
      const responseData = await apiRequest({
        method: "GET",
        url: `/api2/hr/updateFamilyData?seqFamily=${seqFamily}&${accessor}=${inputValue}`,
      });
    } catch (error) {
      console.error("api 요청 실패:", error);
    }
    //handleSendEmpCodeGetFamilyData(cdEmp);
  };
  const handleSendEmpCodeInsertFamilyData = async (
    cdEmp,
    accessor,
    inputValue,
  ) => {
    try {
      const responseData = await apiRequest({
        method: "GET",
        url: `/api2/hr/insertFamilyData?cdEmp=${cdEmp}&${accessor}=${inputValue}`,
      });
    } catch (error) {
      console.error("api 요청 실패:", error);
    }
    handleSendEmpCodeGetFamilyData(cdEmp);
  };

  // 테이블에 보내야할 데이터
  const data = React.useMemo(
    () =>
      familyList.map((family) => ({
        seqFamily: family.seqFamily,
        fgYearEndTax: family.fgYearEndTax,
        nmEmpFam: family.nmEmpFam,
        noResident: family.noResident,
        fgFamily: family.fgFamily,
        fgEducation: family.fgEducation,
        fgGraduate: family.fgGraduate,
        fgCohabitation: family.fgCohabitation,
        fgSolarLunar: family.fgSolarLunar,
        dtBirth: family.dtBirth,
        nmJob: family.nmJob,
        nmCompany: family.nmCompany,
        nmPosition: family.nmPosition,
      })),
    [familyList],
  );

  const columns = React.useMemo(
    () => [
      {
        Header: "연말정산관계",
        accessor: "fgYearEndTax",
        id: "fgYearEndTax",
        width: "8%",
        Cell: ({ cell: { value }, row: { original } }) => {
          const [inputValue, setInputValue] = React.useState(value || ""); // value가 null일 경우 빈 문자열로 초기화
          const handleInputChange = (e) => {
            if (original == null) {
              // insert
              console.log("****************");
              handleSendEmpCodeInsertFamilyData(
                cdEmp,
                "fgYearEndTax",
                e.target.value,
              );
              console.log("수정요청");
              handleSendEmpCodeGetFamilyData(cdEmp);
              setInputValue(e.target.value);
            } else {
              // update
              handleSendEmpCodeUpdateFamilyData(
                original.seqFamily,
                "fgYearEndTax",
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
                { value: "0", label: "본인" },
                { value: "1", label: "배우자" },
                { value: "2", label: "자녀" },
              ]}
              placeholder="선택"
              value={inputValue}
              onChange={handleInputChange}
            />
          );
        },
      },
      {
        Header: "성명",
        accessor: "nmEmpFam",
        id: "nmEmpFam",
        Cell: ({ cell: { value }, row: { original } }) => {
          const [inputValue, setInputValue] = React.useState(value || ""); // value가 null일 경우 빈 문자열로 초기화

          const handleInputChange = (e) => {
            setInputValue(e.target.value);
          };

          const handleInputOnBlur = (e) => {
            if (original == null) {
              // insert
              handleSendEmpCodeInsertFamilyData(
                cdEmp,
                "nmEmpFam",
                e.target.value,
              );
              handleSendEmpCodeGetFamilyData(cdEmp);
              setInputValue(e.target.value);
            } else {
              // update
              handleSendEmpCodeUpdateFamilyData(
                original.seqFamily,
                "nmEmpFam",
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
        Header: "주민번호",
        accessor: "noResident",
        id: "noResident",
        width: "11%",
        Cell: ({ cell: { value }, row: { original } }) => {
          const [inputValue, setInputValue] = React.useState(value || "");
          const handleInputChange = (e) => {
            setInputValue(e.target.value);
          };
          const handleInputOnBlur = (e) => {
            if (original == null) {
              // insert
              handleSendEmpCodeInsertFamilyData(
                cdEmp,
                "noResident",
                e.target.value,
              );
              handleSendEmpCodeGetFamilyData(cdEmp);
              setInputValue(e.target.value);
            } else {
              // update
              handleSendEmpCodeUpdateFamilyData(
                original.seqFamily,
                "noResident",
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
              type="resident"
              className={"doubleLine"}
              onBlur={handleInputOnBlur}
            />
          );
        },
      },
      {
        Header: "가족관계",
        accessor: "fgFamily",
        width: "9%",
        id: "fgFamily",
        Cell: ({ cell: { value }, row: { original } }) => {
          const [inputValue, setInputValue] = React.useState(value || ""); // value가 null일 경우 빈 문자열로 초기화

          const handleInputChange = (e) => {
            setInputValue(e.target.value);
            handleSendEmpCodeUpdateFamilyData(
              original.seqFamily,
              "fgFamily",
              e.target.value,
            );
          };

          return (
            <CustomSelect
              className={"hrDetailSelect"}
              options={[
                { value: 0, label: "본인" },
                { value: 1, label: "배우자" },
                { value: 2, label: "자녀" },
              ]}
              value={inputValue}
              placeholder="선택"
              onChange={handleInputChange}
            />
          );
        },
      },
      {
        Header: "학력",
        accessor: "fgEducation",
        id: "fgEducation",
        width: "15%",
        Cell: ({ cell: { value }, row: { original } }) => {
          const [inputValue, setInputValue] = React.useState(value || ""); // value가 null일 경우 빈 문자열로 초기화

          const handleInputChange = (e) => {
            setInputValue(e.target.value);
            handleSendEmpCodeUpdateFamilyData(
              original.seqFamily,
              "fgEducation",
              e.target.value,
            );
          };

          return (
            <CustomSelect
              className={"hrDetailSelect"}
              options={[
                { value: 0, label: "중학교" },
                { value: 1, label: "고등학교" },
                { value: 3, label: "2년제" },
                { value: 4, label: "3년제" },
                { value: 5, label: "4년제" },
              ]}
              value={inputValue}
              placeholder="선택"
              onChange={handleInputChange}
            />
          );
        },
      },
      {
        Header: "졸업구분",
        accessor: "fgGraduate",
        id: "fgGraduate",
        width: "8%",
        Cell: ({ cell: { value }, row: { original } }) => {
          const [inputValue, setInputValue] = React.useState(value || ""); // value가 null일 경우 빈 문자열로 초기화

          const handleInputChange = (e) => {
            setInputValue(e.target.value);
            handleSendEmpCodeUpdateFamilyData(
              original.seqFamily,
              "fgGraduate",
              e.target.value,
            );
          };

          return (
            <CustomSelect
              className={"hrDetailSelect"}
              options={[
                { value: "0", label: "졸업" },
                { value: "1", label: "중퇴" },
                { value: "2", label: "휴학" },
              ]}
              placeholder="선택"
              value={inputValue}
              onChange={handleInputChange}
            />
          );
        },
      },
      {
        Header: "동거",
        accessor: "fgCohabitation",
        id: "fgCohabitation",
        width: "8%",
        Cell: ({ cell: { value }, row: { original } }) => {
          const [inputValue, setInputValue] = React.useState(value || ""); // value가 null일 경우 빈 문자열로 초기화

          const handleInputChange = (e) => {
            setInputValue(e.target.value);
            handleSendEmpCodeUpdateFamilyData(
              original.seqFamily,
              "fgCohabitation",
              e.target.value,
            );
          };

          return (
            <CustomSelect
              className={"hrDetailSelect"}
              options={[
                { value: "0", label: "여" },
                { value: "1", label: "부" },
              ]}
              placeholder="선택"
              value={inputValue}
              onChange={handleInputChange}
            />
          );
        },
      },
      {
        Header: "양음",
        accessor: "fgSolarLunar",
        id: "fgSolarLunar",
        width: "8%",
        Cell: ({ cell: { value }, row: { original } }) => {
          const [inputValue, setInputValue] = React.useState(value || ""); // value가 null일 경우 빈 문자열로 초기화

          const handleInputChange = (e) => {
            setInputValue(e.target.value);
            handleSendEmpCodeUpdateFamilyData(
              original.seqFamily,
              "fgSolarLunar",
              e.target.value,
            );
          };
          return (
            <CustomSelect
              className={"hrDetailSelect"}
              options={[
                { value: "0", label: "양" },
                { value: "1", label: "음" },
              ]}
              placeholder="선택"
              value={inputValue}
              onChange={handleInputChange}
            />
          );
        },
      },
      {
        Header: "생년월일",
        accessor: "dtBirth",
        id: "dtBirth",
        width: "9%",
        Cell: ({ cell: { value }, row: { original } }) => {
          const [inputValue, setInputValue] = React.useState(value || ""); // value가 null일 경우 빈 문자열로 초기화
          const handleInputChange = (e) => {
            setInputValue(e.target.value);
          };
          const handleInputOnBlur = (e) => {
            if (original == null) {
              // insert
              handleSendEmpCodeInsertFamilyData(
                cdEmp,
                "dtBirth",
                e.target.value,
              );
              handleSendEmpCodeGetFamilyData(cdEmp);
              setInputValue(e.target.value);
            } else {
              // update
              handleSendEmpCodeUpdateFamilyData(
                original.seqFamily,
                "dtBirth",
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
              className={"doubleLine"}
              onBlur={handleInputOnBlur}
            />
          );
        },
      },
      {
        Header: "직업",
        accessor: "nmJob",
        id: "nmJob",
        Cell: ({ cell: { value }, row: { original } }) => {
          const [inputValue, setInputValue] = React.useState(value || ""); // value가 null일 경우 빈 문자열로 초기화

          const handleInputChange = (e) => {
            setInputValue(e.target.value);
          };
          const handleInputOnBlur = (e) => {
            if (original == null) {
              // insert
              handleSendEmpCodeInsertFamilyData(cdEmp, "nmJob", e.target.value);
              handleSendEmpCodeGetFamilyData(cdEmp);
              setInputValue(e.target.value);
            } else {
              // update
              handleSendEmpCodeUpdateFamilyData(
                original.seqFamily,
                "nmJob",
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
              className={"doubleLine"}
              onBlur={handleInputOnBlur}
            />
          );
        },
      },
      {
        Header: "직장명",
        accessor: "nmCompany",
        id: "nmCompany",
        Cell: ({ cell: { value }, row: { original } }) => {
          const [inputValue, setInputValue] = React.useState(value || ""); // value가 null일 경우 빈 문자열로 초기화

          const handleInputChange = (e) => {
            setInputValue(e.target.value);
          };
          const handleInputOnBlur = (e) => {
            if (original == null) {
              // insert
              handleSendEmpCodeInsertFamilyData(
                cdEmp,
                "nmCompany",
                e.target.value,
              );
              handleSendEmpCodeGetFamilyData(cdEmp);
              setInputValue(e.target.value);
            } else {
              // update
              handleSendEmpCodeUpdateFamilyData(
                original.seqFamily,
                "nmCompany",
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
              className={"doubleLine"}
              onBlur={handleInputOnBlur}
            />
          );
        },
      },
      {
        Header: "직급",
        accessor: "nmPosition",
        id: "nmPosition",
        Cell: ({ cell: { value }, row: { original } }) => {
          const [inputValue, setInputValue] = React.useState(value || ""); // value가 null일 경우 빈 문자열로 초기화

          const handleInputChange = (e) => {
            setInputValue(e.target.value);
          };
          const handleInputOnBlur = (e) => {
            if (original == null) {
              // insert
              handleSendEmpCodeInsertFamilyData(
                cdEmp,
                "nmPosition",
                e.target.value,
              );
              handleSendEmpCodeGetFamilyData(cdEmp);
              setInputValue(e.target.value);
            } else {
              // update
              handleSendEmpCodeUpdateFamilyData(
                original.seqFamily,
                "nmPosition",
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
              className={"doubleLine"}
              onBlur={handleInputOnBlur}
            />
          );
        },
      },
    ],
    [familyList],
  );

  return (
    <Table
      data={data}
      columns={columns}
      insertRow={true}
      showInsertRow={showInsertRow}
      setShowInsertRow={setShowInsertRow}
      scrollHeight={"700"}
    />
  );
};

export default React.memo(HrFamily);
