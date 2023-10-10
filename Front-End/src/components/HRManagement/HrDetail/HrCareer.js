import React, { useRef, useState, useEffect, useMemo } from "react";
import Table from "../../TablesLib/Table";
import CustomCalender from "../../Contents/CustomCalendar";
import useApiRequest from "../../Services/ApiRequest";
import Input from "../../Contents/InputTest";
import CustomSelect from "../../Contents/CustomSelect";
import CustomButton from "../../Contents/CustomButton";

const HrCareer = ({ cdEmp }) => {
  const apiRequest = useApiRequest();
  const [careerList, setCareerList] = useState([]);
  const [showInsertRow, setShowInsertRow] = useState(false);

  const isFirstRender = useRef(true);

  useEffect(() => {
    // 첫 렌더링인지 체크
    // if (isFirstRender.current) {
    //   isFirstRender.current = false;
    //   return;
    // }
    // cdEmp가 undefined일 때는 아무것도 하지 않고 리턴
    if (cdEmp === undefined || cdEmp === "" || cdEmp === null) {
      setCareerList([]);
      return;
    }
    setShowInsertRow(false);
    handleSendEmpCodeGetCareerData(cdEmp);
  }, [cdEmp]);

  const handleSendEmpCodeGetCareerData = async (cdEmp) => {
    if (cdEmp == null || cdEmp === "" || cdEmp === undefined) {
      return;
    }
    try {
      const responseData = await apiRequest({
        method: "GET",
        url: `/api2/hr/getCareerDataList?cdEmp=${cdEmp}`,
      });
      setCareerList(Array.isArray(responseData) ? responseData : []); // 배열 확인
      setShowInsertRow(false);
    } catch (error) {
      console.error("api 요청 실패:", error);
    }
  };
  const calculateWorkDuration = (dtHire, dtResign) => {
    const hireDate = new Date(
      parseInt(dtHire.substring(0, 4)),
      parseInt(dtHire.substring(4, 6)) - 1,
      parseInt(dtHire.substring(6, 8)),
    );
    const resignDate = dtResign
      ? new Date(
          parseInt(dtResign.substring(0, 4)),
          parseInt(dtResign.substring(4, 6)) - 1,
          parseInt(dtResign.substring(6, 8)),
        )
      : new Date();

    const diffTime = Math.abs(resignDate - hireDate);
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30.44)); // Average days in month considered as 30.44
    return diffMonths;
  };
  const handleDateChange = async (value, name, seqCareer) => {
    console.log("handleDateChange ******************");

    if (cdEmp == null || cdEmp === "" || cdEmp === undefined) {
      return;
    }
    value = value.replace(/-/g, "");
    let updatedCareerList = [...careerList];

    let careerItem = updatedCareerList.find(
      (career) => career.seqCareer === seqCareer,
    );

    if (careerItem) {
      careerItem[name] = value;
    }

    if (careerItem && careerItem.dtHire && careerItem.dtResign) {
      const workDuration = calculateWorkDuration(
        careerItem.dtHire,
        careerItem.dtResign,
      );
      careerItem.monthWork = workDuration.toString();
      // 근무기간이 변경될 때 API 요청을 발송
      await handleSendEmpCodeUpdateCareerData(
        seqCareer,
        "monthWork",
        careerItem.monthWork,
      );
    }

    setCareerList(updatedCareerList);

    if (seqCareer === null || seqCareer === undefined || seqCareer === "") {
      try {
        const responseData = await apiRequest({
          method: "GET",
          url: `/api2/hr/insertCareerData?cdEmp=${cdEmp}&${name}=${value}`,
        });
        console.log("요청성공!!!!!!!!!!!!!!!!");
      } catch (error) {
        console.error("api 요청 실패:", error);
      }
      handleSendEmpCodeGetCareerData(cdEmp);
    } else {
      console.log("요청 전!!!!!!!!!!!!!!!!!!!!!!");
      try {
        const responseData = await apiRequest({
          method: "GET",
          url: `/api2/hr/updateCareerData?seqCareer=${seqCareer}&${name}=${value}`,
        });
        console.log("요청성공!!!!!!!!!!!!!!!!");
      } catch (error) {
        console.error("Failed to fetch emp data:", error);
      }
      updateCareerListItem(seqCareer, name, value);
    }
  };

  const handleSendEmpCodeUpdateCareerData = async (
    seqCareer,
    accessor,
    inputValue,
    value,
  ) => {
    if (!cdEmp || !seqCareer || !inputValue || inputValue === value) {
      return;
    }

    try {
      const responseData = await apiRequest({
        method: "GET",
        url: `/api2/hr/updateCareerData?seqCareer=${seqCareer}&${accessor}=${inputValue}`,
      });
    } catch (error) {
      console.error("api 요청 실패:", error);
    }
    updateCareerListItem(seqCareer, accessor, inputValue);
  };
  // 1. `careerList`의 특정 항목을 업데이트하는 helper 함수
  const updateCareerListItem = (seqCareer, name, value) => {
    const updatedCarrerList = careerList.map((career) => {
      if (career.seqCareer === seqCareer) {
        let updatedCareer = {
          ...career,
          [name]: value,
        };
        if (updatedCareer.dtHire && updatedCareer.dtResign) {
          const workDuration = calculateWorkDuration(
            updatedCareer.dtHire,
            updatedCareer.dtResign,
          );
          updatedCareer.monthWork = workDuration.toString();
        }
        return updatedCareer;
      }
      return career;
    });
    setCareerList(updatedCarrerList);
  };
  const handleSendEmpCodeInsertCareerData = async (
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
        url: `/api2/hr/insertCareerData?cdEmp=${cdEmp}&${accessor}=${inputValue}`,
      });
    } catch (error) {
      console.error("api 요청 실패:", error);
    }
    handleSendEmpCodeCareerData(cdEmp);
  };
  const handleSendEmpCodeCareerData = async (cdEmp) => {
    if (!cdEmp) {
      return;
    }
    console.log(cdEmp);
    try {
      const responseData = await apiRequest({
        method: "GET",
        url: `/api2/hr/getCareerDataList?cdEmp=${cdEmp}`,
      });
      console.log(responseData);
      setCareerList(Array.isArray(responseData) ? responseData : []); // 배열 확인
      setShowInsertRow(false);
    } catch (error) {
      console.error("api 요청 실패:", error);
    }
  };

  const handleDeleteCareer = async (seqCareer) => {
    if (!seqCareer) {
      return;
    }

    try {
      const responseData = await apiRequest({
        method: "POST",
        url: `/api2/hr/deleteCareerData`,
        data: {
          seqCareer: seqCareer,
        },
      });
      console.log("요청성공!!!!!!!!!!!!!!!!");
      setCareerList((prevCareerList) =>
        prevCareerList.filter((Career) => Career.seqCareer !== seqCareer),
      );
    } catch (error) {
      console.error("api 요청 실패:", error);
    }
  };

  const data = React.useMemo(
    () =>
      careerList.map((career) => ({
        seqCareer: career.seqCareer, // 경력 고유값
        cdEmp: career.cdEmp, // 사원코드
        dtHire: career.dtHire, // 입사일
        dtResign: career.dtResign, // 퇴사일
        monthWork: career.monthWork, // 근무기간
        nmCompany: career.nmCompany, // 직장명
        dcDuty: career.dcDuty, // 담당업무
        nmPosition: career.nmPosition, // 직급
        amtPay: career.amtPay, // 급여
        dcRetr: career.dcRetr, // 퇴직사유
      })),
    [careerList],
  );
  const columns = useMemo(
    () => [
      {
        Header: "입사일",
        accessor: "dtHire",
        id: "dtHire",
        Cell: ({ cell: { value }, row: { original } }) => {
          const handleInputChange = (e) => {
            console.log(original);
            const seqCareerValue = original ? original.seqCareer : null;
            handleDateChange(e, "dtHire", seqCareerValue);
          };
          return (
            <CustomCalender
              className="hrInfoBaseInput"
              value={value || ""}
              name="dtHire"
              readOnly={true}
              onChange={handleInputChange}
            />
          );
        },
      },
      {
        Header: "퇴사일",
        accessor: "dtResign",
        id: "dtResign",
        Cell: ({ cell: { value }, row: { original } }) => {
          const handleInputChange = (e) => {
            const seqCareerValue = original ? original.seqCareer : null;
            handleDateChange(e, "dtResign", seqCareerValue);
          };
          return (
            <CustomCalender
              className="hrInfoBaseInput"
              value={value || ""}
              readOnly={true}
              name="dtResign"
              onChange={handleInputChange}
            />
          );
        },
      },
      {
        Header: "근무기간",
        accessor: "monthWork",
        id: "monthWork",
        Cell: ({ cell: { value }, row: { original } }) => {
          //const [inputValue, setInputValue] = React.useState(value || ""); // value가 null일 경우 빈 문자열로 초기화
          const generateOptions = () => {
            let options = [];

            options.push({ value: 0, label: "0개월" });
            for (let i = 1; i <= 600; i++) {
              let years = Math.floor(i / 12);
              let months = i % 12;
              if (years === 0) {
                options.push({ value: `${i}`, label: `${months}개월` });
              } else if (months === 0) {
                options.push({ value: `${i}`, label: `${years}년` });
              } else {
                options.push({
                  value: `${i}`,
                  label: `${years}년 ${months}개월`,
                });
              }
            }

            return options;
          };
          return (
            <CustomSelect
              options={generateOptions()}
              placeholder="선택"
              value={value || 0}
              readOnly={true}
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
            if (inputValue === "") {
              return;
            }
            if (original == null) {
              // insert
              handleSendEmpCodeInsertCareerData(
                cdEmp,
                "nmCompany",
                e.target.value,
              );
              handleSendEmpCodeCareerData(cdEmp);
              setInputValue(e.target.value);
            } else {
              // update
              handleSendEmpCodeUpdateCareerData(
                original.seqCareer,
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
              //onBlur={handleInputOnBlur}
              onKeyDown={handleInputOnBlur}
              className={"doubleLine"}
            />
          );
        },
      },
      {
        Header: "담당업무",
        accessor: "dcDuty",
        id: "dcDuty",
        Cell: ({ cell: { value }, row: { original } }) => {
          const [inputValue, setInputValue] = React.useState(value || ""); // value가 null일 경우 빈 문자열로 초기화

          const handleInputChange = (e) => {
            setInputValue(e.target.value);
          };

          const handleInputOnBlur = (e) => {
            if (original == null) {
              // insert
              handleSendEmpCodeInsertCareerData(
                cdEmp,
                "dcDuty",
                e.target.value,
              );
              handleSendEmpCodeCareerData(cdEmp);
              setInputValue(e.target.value);
            } else {
              // update
              if (original.dcDuty !== inputValue) {
                handleSendEmpCodeUpdateCareerData(
                  original.seqCareer,
                  "dcDuty",
                  e.target.value,
                  value,
                );
                setInputValue(e.target.value);
              }
            }
          };

          return (
            <Input
              value={inputValue || ""}
              onChange={handleInputChange}
              isDoubleClick={true}
              //onBlur={handleInputOnBlur}
              onKeyDown={handleInputOnBlur}
              className={"doubleLine"}
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
              handleSendEmpCodeInsertCareerData(
                cdEmp,
                "nmPosition",
                e.target.value,
              );
              handleSendEmpCodeCareerData(cdEmp);
              setInputValue(e.target.value);
            } else {
              // update
              if (original.nmPosition !== inputValue) {
                handleSendEmpCodeUpdateCareerData(
                  original.seqCareer,
                  "nmPosition",
                  e.target.value,
                  value,
                );
                setInputValue(e.target.value);
              }
            }
          };

          return (
            <Input
              value={inputValue || ""}
              onChange={handleInputChange}
              isDoubleClick={true}
              //onBlur={handleInputOnBlur}
              onKeyDown={handleInputOnBlur}
              className={"doubleLine"}
            />
          );
        },
      },
      {
        Header: "급여(연봉)",
        accessor: "amtPay",
        id: "amtPay",
        Cell: ({ cell: { value }, row: { original } }) => {
          const [inputValue, setInputValue] = React.useState(value || ""); // value가 null일 경우 빈 문자열로 초기화

          const handleInputChange = (e) => {
            setInputValue(e.target.value);
          };

          const handleInputOnBlur = (e) => {
            if (e.target.value === "" || e.target.value === null) {
              e.target.value = 0;
            }
            if (original == null) {
              // insert
              handleSendEmpCodeInsertCareerData(
                cdEmp,
                "amtPay",
                e.target.value,
              );
              handleSendEmpCodeCareerData(cdEmp);
              setInputValue(e.target.value);
            } else {
              // update
              if (original.amtPay !== inputValue) {
                handleSendEmpCodeUpdateCareerData(
                  original.seqCareer,
                  "amtPay",
                  e.target.value,
                  value,
                );
                setInputValue(e.target.value);
              }
            }
          };

          return (
            <>
              <Input
                type={"price"}
                value={inputValue || ""}
                onChange={handleInputChange}
                isDoubleClick={true}
                //onBlur={handleInputOnBlur}
                onKeyDown={handleInputOnBlur}
                className={"doubleLine"}
                width={"50%"}
              />
              <span>만원</span>
            </>
          );
        },
      },
      {
        Header: "퇴직사유",
        accessor: "dcRetr",
        id: "dcRetr",
        Cell: ({ cell: { value }, row: { original } }) => {
          const [inputValue, setInputValue] = React.useState(value || ""); // value가 null일 경우 빈 문자열로 초기화

          const handleInputChange = (e) => {
            setInputValue(e.target.value);
          };

          const handleInputOnBlur = (e) => {
            if (original == null) {
              // insert
              handleSendEmpCodeInsertCareerData(
                cdEmp,
                "dcRetr",
                e.target.value,
              );
              handleSendEmpCodeCareerData(cdEmp);
              setInputValue(e.target.value);
            } else {
              // update
              if (original.dcRetr !== inputValue) {
                handleSendEmpCodeUpdateCareerData(
                  original.seqCareer,
                  "dcRetr",
                  e.target.value,
                  value,
                );
                setInputValue(e.target.value);
              }
            }
          };

          return (
            <>
              <Input
                value={inputValue || ""}
                onChange={handleInputChange}
                isDoubleClick={true}
                //onBlur={handleInputOnBlur}
                onKeyDown={handleInputOnBlur}
                className={"doubleLine"}
              />
            </>
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
                  handleDeleteCareer(original.seqCareer);
                }
              }}
            />
          );
        },
      },
    ],
    [careerList],
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

export default HrCareer;
