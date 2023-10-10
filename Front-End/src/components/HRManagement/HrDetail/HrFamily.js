import React, { useRef, useState, useEffect } from "react";
import Table from "../../TablesLib/Table";
import useApiRequest from "../../Services/ApiRequest";
//import Input from "../../Contents/Input";
import Input from "../../Contents/InputTest";
import CustomSelect from "../../Contents/CustomSelect";
import CustomCalender from "../../Contents/CustomCalendar";
import CustomButton from "../../Contents/CustomButton";
const HrFamily = ({ cdEmp }) => {
  console.log("가족 페이지 ******");
  console.log(cdEmp);
  // prop 이름 변경
  const apiRequest = useApiRequest();
  const [familyList, setFamilyList] = useState([]);
  const [showInsertRow, setShowInsertRow] = useState(false);

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (cdEmp === undefined || cdEmp === "" || cdEmp === null) {
      setFamilyList([]);
    }
    // 첫 렌더링인지 체크
    // if (isFirstRender.current) {
    //   isFirstRender.current = false;
    //   return;
    // }
    // cdEmp가 undefined일 때는 아무것도 하지 않고 리턴

    setShowInsertRow(false);
    handleSendEmpCodeGetFamilyData(cdEmp); // 함수 호출시 인자로 empCode 전달
  }, [cdEmp]);

  const handleSendEmpCodeGetFamilyData = async (cdEmp) => {
    if (cdEmp == null || cdEmp === "" || cdEmp === undefined) {
      return;
    }
    try {
      const responseData = await apiRequest({
        method: "GET",
        url: `/api2/hr/getFamilyDataList?cdEmp=${cdEmp}`,
      });
      setFamilyList(Array.isArray(responseData) ? responseData : []); // 배열 확인
      setShowInsertRow(false);
    } catch (error) {
      console.error("api 요청 실패:", error);
    }
  };

  const handleSendEmpCodeUpdateFamilyData = async (
    seqFamily,
    accessor,
    inputValue,
    value,
  ) => {
    if (!cdEmp || !seqFamily || value === inputValue) {
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
    updateFamilyListItem(seqFamily, accessor, inputValue);
  };
  const handleSendEmpCodeInsertFamilyData = async (
    cdEmp,
    accessor,
    inputValue,
  ) => {
    if (!cdEmp || !inputValue) {
      return;
    }
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

  const handleDateChange = async (value, name, seqFamily) => {
    console.log("handleDateChange ******************");

    if (cdEmp == null || cdEmp === "" || cdEmp === undefined) {
      return;
    }
    value = value.replace(/-/g, "");

    if (seqFamily === null || seqFamily === undefined || seqFamily === "") {
      // 학력고유 번호가 없을땐 insert
      try {
        const responseData = await apiRequest({
          method: "GET",
          url: `/api2/hr/insertFamilyData?cdEmp=${cdEmp}&${name}=${value}`,
        });
        console.log("요청성공!!!!!!!!!!!!!!!!");
      } catch (error) {
        console.error("api 요청 실패:", error);
      }
      handleSendEmpCodeGetFamilyData(cdEmp);
    } else {
      // 학력고유 번호가 있을땐 update
      console.log("요청 전!!!!!!!!!!!!!!!!!!!!!!");
      try {
        const responseData = await apiRequest({
          method: "GET",
          url: `/api2/hr/updateFamilyData?seqFamily=${seqFamily}&${name}=${value}`,
        });
        console.log("요청성공!!!!!!!!!!!!!!!!");
      } catch (error) {
        console.error("Failed to fetch emp data:", error);
      }
      updateFamilyListItem(seqFamily, name, value);
    }
  };

  const updateFamilyListItem = (seqFamily, name, value) => {
    console.log(seqFamily, name, value);

    const updatedFamilyList = familyList.map((family) => {
      if (family.seqFamily === seqFamily) {
        return {
          ...family,
          [name]: value,
        };
      }
      return family;
    });
    setFamilyList(updatedFamilyList);
  };

  const handleDeleteFamily = async (seqFamily) => {
    if (!seqFamily) {
      return;
    }
    try {
      const responseData = await apiRequest({
        method: "POST",
        //url: `/api2/hr/deleteFamilyData?seqFamily=${seqFamily}`,
        url: `/api2/hr/deleteFamilyData`,
        data: {
          seqFamily: seqFamily,
        },
      });
      console.log("요청성공!!!!!!!!!!!!!!!!");
      // API 요청이 성공하면, familyList 상태를 업데이트하여 뷰를 갱신합니다.
      setFamilyList((prevFamilyList) =>
        prevFamilyList.filter((family) => family.seqFamily !== seqFamily),
      );
    } catch (error) {
      console.error("api 요청 실패:", error);
    }
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
          const [inputValue, setInputValue] = React.useState(value || "");
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
              placeholder={"선택"}
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
        width: "5%",
        Cell: ({ cell: { value }, row: { original } }) => {
          const [inputValue, setInputValue] = React.useState(value || ""); // value가 null일 경우 빈 문자열로 초기화

          const handleInputChange = (e) => {
            setInputValue(e.target.value);
          };

          const handleInputOnBlur = (e) => {
            console.log("value : " + value);
            console.log("inputValue : " + inputValue);

            if (inputValue === "") {
              return;
            }
            if (original == null) {
              // insert
              console.log("*********************************");
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
                value,
              );
              setInputValue(e.target.value);
            }
          };

          return (
            <Input
              value={inputValue || ""}
              onChange={handleInputChange}
              //onBlur={handleInputOnBlur}
              onKeyDown={handleInputOnBlur}
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
            console.log("value : " + value);
            console.log("inputValue : " + inputValue);

            if (inputValue === "") {
              return;
            }
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
              console.log(original);
              handleSendEmpCodeUpdateFamilyData(
                original.seqFamily,
                "noResident",
                e.target.value,
                value,
              );
              setInputValue(e.target.value);
            }
          };
          return (
            <Input
              value={inputValue || ""}
              onChange={handleInputChange}
              type="resident"
              className={"doubleLine"}
              //onBlur={handleInputOnBlur}
              onKeyDown={handleInputOnBlur}
            />
          );
        },
      },
      {
        Header: "가족관계",
        accessor: "fgFamily",
        width: "8%",
        id: "fgFamily",
        Cell: ({ cell: { value }, row: { original } }) => {
          const [inputValue, setInputValue] = React.useState(value || ""); // value가 null일 경우 빈 문자열로 초기화

          const handleInputChange = (e) => {
            if (original == null) {
              // insert
              console.log("****************");
              handleSendEmpCodeInsertFamilyData(
                cdEmp,
                "fgFamily",
                e.target.value,
              );
              console.log("수정요청");
              handleSendEmpCodeGetFamilyData(cdEmp);
              setInputValue(e.target.value);
            } else {
              // update
              handleSendEmpCodeUpdateFamilyData(
                original.seqFamily,
                "fgFamily",
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
              value={inputValue}
              placeholder={"선택"}
              onChange={handleInputChange}
            />
          );
        },
      },
      {
        Header: "학력",
        accessor: "fgEducation",
        id: "fgEducation",
        width: "9%",
        Cell: ({ cell: { value }, row: { original } }) => {
          const [inputValue, setInputValue] = React.useState(value || ""); // value가 null일 경우 빈 문자열로 초기화
          const handleInputChange = (e) => {
            if (original == null) {
              // insert
              console.log("****************");
              handleSendEmpCodeInsertFamilyData(
                cdEmp,
                "fgEducation",
                e.target.value,
              );
              console.log("수정요청");
              handleSendEmpCodeGetFamilyData(cdEmp);
              setInputValue(e.target.value);
            } else {
              // update
              handleSendEmpCodeUpdateFamilyData(
                original.seqFamily,
                "fgEducation",
                e.target.value,
                value,
              );
              console.log("수정요청");
              setInputValue(e.target.value);
            }
          };

          return (
            <CustomSelect
              className={"hrDetailSelect"}
              options={[
                { value: "0", label: "중학교" },
                { value: "1", label: "고등학교" },
                { value: "3", label: "2년제" },
                { value: "4", label: "3년제" },
                { value: "5", label: "4년제" },
              ]}
              value={inputValue}
              placeholder={"선택"}
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
          const [inputValue, setInputValue] = React.useState(value || "");

          const handleInputChange = (e) => {
            if (original == null) {
              // insert
              console.log("****************");
              handleSendEmpCodeInsertFamilyData(
                cdEmp,
                "fgGraduate",
                e.target.value,
              );
              console.log("수정요청");
              handleSendEmpCodeGetFamilyData(cdEmp);
              setInputValue(e.target.value);
            } else {
              // update
              handleSendEmpCodeUpdateFamilyData(
                original.seqFamily,
                "fgGraduate",
                e.target.value,
                value,
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
                { value: "2", label: "휴학" },
              ]}
              value={inputValue}
              placeholder={"선택"}
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
            if (original == null) {
              // insert
              console.log("****************");
              handleSendEmpCodeInsertFamilyData(
                cdEmp,
                "fgCohabitation",
                e.target.value,
              );
              console.log("수정요청");
              handleSendEmpCodeGetFamilyData(cdEmp);
              setInputValue(e.target.value);
            } else {
              // update
              handleSendEmpCodeUpdateFamilyData(
                original.seqFamily,
                "fgCohabitation",
                e.target.value,
                value,
              );
              console.log("수정요청");
              setInputValue(e.target.value);
            }
          };

          return (
            <CustomSelect
              className={"hrDetailSelect"}
              options={[
                { value: "0", label: "여" },
                { value: "1", label: "부" },
              ]}
              value={inputValue}
              placeholder={"선택"}
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
            if (original == null) {
              // insert
              console.log("****************");
              handleSendEmpCodeInsertFamilyData(
                cdEmp,
                "fgSolarLunar",
                e.target.value,
              );
              console.log("수정요청");
              handleSendEmpCodeGetFamilyData(cdEmp);
              setInputValue(e.target.value);
            } else {
              // update
              console.log("양음 업데이트 ~~~~~~~~~");
              handleSendEmpCodeUpdateFamilyData(
                original.seqFamily,
                "fgSolarLunar",
                e.target.value,
                value,
              );
              console.log("수정요청");
              setInputValue(e.target.value);
            }
          };
          return (
            <CustomSelect
              className={"hrDetailSelect"}
              options={[
                { value: "0", label: "양" },
                { value: "1", label: "음" },
              ]}
              value={inputValue}
              placeholder={"선택"}
              onChange={handleInputChange}
            />
          );
        },
      },
      {
        Header: "생년월일",
        accessor: "dtBirth",
        id: "dtBirth",
        width: "10%",
        Cell: ({ cell: { value }, row: { original } }) => {
          const handleInputChange = (e) => {
            const seqFamilyValue = original ? original.seqFamily : null;
            handleDateChange(e, "dtBirth", seqFamilyValue);
          };
          return (
            <CustomCalender
              className="hrInfoBaseInput"
              value={value || ""}
              name="dtBirth"
              readOnly={true}
              onChange={handleInputChange}
            />
          );
        },
      },
      {
        Header: "직업",
        accessor: "nmJob",
        id: "nmJob",
        width: "5%",
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
              handleSendEmpCodeInsertFamilyData(cdEmp, "nmJob", e.target.value);
              handleSendEmpCodeGetFamilyData(cdEmp);
              setInputValue(e.target.value);
            } else {
              // update
              handleSendEmpCodeUpdateFamilyData(
                original.seqFamily,
                "nmJob",
                e.target.value,
                value,
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
              //onBlur={handleInputOnBlur}
              onKeyDown={handleInputOnBlur}
            />
          );
        },
      },
      {
        Header: "직장명",
        accessor: "nmCompany",
        id: "nmCompany",
        width: "9%",
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
                value,
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
              onKeyDown={handleInputOnBlur}
            />
          );
        },
      },
      {
        Header: "직급",
        accessor: "nmPosition",
        id: "nmPosition",
        width: "5%",
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
                value,
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
              onKeyDown={handleInputOnBlur}
            />
          );
        },
      },
      {
        Header: "삭제",
        accessor: "",
        width: "5%",
        Cell: ({ cell: { value }, row: { original } }) => {
          return (
            <CustomButton
              text="삭제"
              color="white"
              backgroundColor="var(--color-primary-gray)"
              className="hrInfoBaseProfileImgBtn"
              onClick={() => {
                if (original) {
                  handleDeleteFamily(original.seqFamily);
                }
              }}
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
      //scrollHeight={"700"}
    />
  );
};

export default React.memo(HrFamily);
