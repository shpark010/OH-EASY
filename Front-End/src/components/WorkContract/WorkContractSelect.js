import React, { useState, useMemo, useEffect } from "react";
import "../../styles/css/pages/WorkContract.css";
import CustomCalendar from "../../components/Contents/CustomCalendar";
import CustomInput from "../../components/Contents/CustomInput";
import CustomButton from "../../components/Contents/CustomButton";
import SearchBarBox from "../../components/SearchBar/SearchBarBox";
import Table from "../../components/TablesLib/Table";
import Input from "../Contents/Input";
import useApiRequest from "../Services/ApiRequest";
import CustomSelect from "../../components/Contents/CustomSelect";
import SweetAlert from "../Contents/SweetAlert";

const WorkContractSelect = () => {
  const apiRequest = useApiRequest();
  const [employeeData, setEmployeeData] = useState([]);
  const [belongingDate, setBelongingDate] = useState(""); //년월 달력 상태 관리.
  const [belongingDate2, setBelongingDate2] = useState(""); //년월 달력 상태 관리 끝 날짜.
  const [searchOrder, setSearchOrder] = useState("1"); // 정렬 방법 관리 State
  const [paramGetEmpList, setParamGetEmpList] = useState([]); // code로 가져온 표준근로계약서 사원
  const [clickCode, setClickCode] = useState([]);
  const [highlightFirstRow1, setHighlightFirstRow1] = useState(true); //첫번째 행 표시를 위해
  //paramgetEmpList1 은 Create Tab
  const [showAlert, setShowAlert] = React.useState(false); // sweetalret

  // const handleBelongingDateChange = (newDate) => {

  //   newDate = newDate.replace(/-/g, "");
  //   setBelongingDate(newDate);

  // }; // 년월 달력 변경 이벤트시 작동하는 함수. 시작날짜
  const handleBelongingDateChange = async (newDate) => {
    const formattedDate = newDate.replace(/-/g, "");
    setBelongingDate(formattedDate);

    if (belongingDate2) {
      if (formattedDate <= belongingDate2) {
        setEmployeeData([]);
        // setHighlightFirstRow1(false);
        try {
          const responseData = await apiRequest({
            method: "GET",
            url: `/api2/wc/getEmpList?creDate=${formattedDate}&creDate2=${belongingDate2}&orderValue=${searchOrder}`,
          });

          const firstCdEmp =
            responseData && responseData[0] ? responseData[0].cdEmp : null;
          setClickCode(firstCdEmp);
          if (firstCdEmp) {
            const responseData2 = await apiRequest({
              method: "GET",
              url: `/api2/wc/getCodeParamEmpList?code=${firstCdEmp}`,
            });
            setParamGetEmpList(responseData2);
          }

          const modifiedresponseData = responseData.map((responseData) => {
            const originalDate = responseData.dtCreated;
            const year = originalDate.slice(0, 4);
            const month = originalDate.slice(4, 6);
            const formattedDate = `${year}년 ${month}월`;
            responseData.dtCreated = formattedDate;
            return responseData;
          });
          setEmployeeData(modifiedresponseData);
        } catch (error) {
          console.error("Failed to fetch emp data:", error);
        }
      } else {
        setShowAlert(true);
        return;
      }
    }
  };

  const handleBelongingDateChange2 = async (newDate) => {
    const formattedDate = newDate.replace(/-/g, "");
    setBelongingDate2(formattedDate);

    if (belongingDate) {
      if (belongingDate <= formattedDate) {
        setEmployeeData([]);
        // setHighlightFirstRow1(false);
        try {
          const responseData = await apiRequest({
            method: "GET",
            url: `/api2/wc/getEmpList?creDate=${belongingDate}&creDate2=${formattedDate}&orderValue=${searchOrder}`,
          });

          const firstCdEmp =
            responseData && responseData[0] ? responseData[0].cdEmp : null;
          setClickCode(firstCdEmp);
          if (firstCdEmp) {
            const responseData2 = await apiRequest({
              method: "GET",
              url: `/api2/wc/getCodeParamEmpList?code=${firstCdEmp}`,
            });
            setParamGetEmpList(responseData2);
          }

          const modifiedresponseData = responseData.map((responseData) => {
            const originalDate = responseData.dtCreated;
            const year = originalDate.slice(0, 4);
            const month = originalDate.slice(4, 6);
            const formattedDate = `${year}년 ${month}월`;
            responseData.dtCreated = formattedDate;
            return responseData;
          });
          setEmployeeData(modifiedresponseData);
          console.log(employeeData);
        } catch (error) {
          console.error("Failed to fetch emp data:", error);
        }
      } else {
        setShowAlert(true);
        return;
      }
    }
  };

  // 년월 달력 변경 이벤트시 작동하는 함수. 끝 날짜
  //e 넣으면 오류뜸 why? 함수하나로 분기처리 하고싶은데 안됨.

  const data = useMemo(
    () =>
      employeeData.map((emp) => ({
        dtCreated: emp.dtCreated,
        cdEmp: emp.cdEmp,
        nmEmp: emp.nmEmp,
        noResident: emp.noResident,
        cntnJob: emp.cntnJob,
      })),
    [employeeData],
  );

  // 사원코드 순 eventhandler
  const searchOrderOption = async (e) => {
    const orderValue = e.target.value;
    setSearchOrder(orderValue);
    setEmployeeData([]); //backgroundcolor 지우기 위한
    // 두 달력의 상태값이 모두 있을 경우 API 요청을 보냅니다.
    if (belongingDate && belongingDate2) {
      // setHighlightFirstRow1(false);
      try {
        const responseData = await apiRequest({
          method: "GET",
          url: `/api2/wc/getEmpList?creDate=${belongingDate}&creDate2=${belongingDate2}&orderValue=${orderValue}`,
        });

        const firstCdEmp =
          responseData && responseData[0] ? responseData[0].cdEmp : null; // responseData의 첫 번째 항목에서 cdEmp 값을 가져옵니다.
        setClickCode(firstCdEmp);
        if (firstCdEmp) {
          // 두 번째 API 요청

          const responseData2 = await apiRequest({
            method: "GET",
            url: `/api2/wc/getCodeParamEmpList?code=${firstCdEmp}`,
          });

          setParamGetEmpList(responseData2); // 오른쪽 table 보여줄 data set
        }

        const modifiedresponseData = responseData.map((responseData) => {
          const originalDate = responseData.dtCreated;
          const year = originalDate.slice(0, 4);
          const month = originalDate.slice(4, 6);
          const formattedDate = `${year}년 ${month}월`;
          responseData.dtCreated = formattedDate;

          return responseData;
        });

        setEmployeeData(modifiedresponseData);
      } catch (error) {
        console.error("Failed to fetch emp data:", error);
      }
    }
  };

  useEffect(() => {
    console.log(employeeData);
  }, [employeeData]); // 변경될때만 실행.

  const handleInputClick = async (e) => {
    setParamGetEmpList([]);

    // setHighlightFirstRow1(false);

    const code = e.target.parentElement.parentElement.querySelector(
      "td:nth-child(2) input",
    );
    const param = code.value;

    try {
      const responseData = await apiRequest({
        method: "GET",
        url: `/api2/wc/getCodeParamEmpList?code=${param}`,
      });
      setParamGetEmpList(responseData);
    } catch (error) {
      console.error("Failed to fetch emp data:", error);
    }
  };

  //왼쪽 Table 아무영역 눌렀을때 발생시킬 event
  // 방법 1 : 조건조회할때 미리 다 가져와 뿌리기. 사람이 많아졌을때 고려하면 x
  // 방법 2 : 필요한 VO만 가져온후 왼쪽 Table 누를 경우 api 보내기

  useEffect(() => {
    console.log(paramGetEmpList);
  }, [paramGetEmpList]); // 변경될때만 실행.

  const columns = useMemo(
    () => [
      {
        Header: "작성년월",
        accessor: "dtCreated",
        id: "dtCreated",
        width: "20%",
        Cell: ({ cell: { value }, row: { original, index } }) => {
          return (
            <>
              <Input
                style={
                  {
                    // background: index === 0 && highlightFirstRow1 ? '#92c5ff' : 'transparent'
                  }
                }
                value={original?.dtCreated || ""}
                onClick={handleInputClick}
              />
            </>
          );
        },
      },
      {
        Header: "Code",
        accessor: "cdEmp",
        id: "cdEmp",
        width: "20%",
        Cell: ({ cell: { value }, row: { original, index } }) => {
          return (
            <Input
              style={
                {
                  // background: index === 0 && highlightFirstRow1 ? '#92c5ff' : 'transparent'
                }
              }
              value={original?.cdEmp || ""}
              onClick={handleInputClick}
            />
          );
        },
      },
      {
        Header: "사원명",
        accessor: "nmEmp",
        id: "nmEmp",
        width: "20%",
        Cell: ({ cell: { value }, row: { original, index } }) => {
          return (
            <Input
              style={
                {
                  // background: index === 0 && highlightFirstRow1 ? '#92c5ff' : 'transparent'
                }
              }
              value={original?.nmEmp || ""}
              onClick={handleInputClick}
            />
          );
        },
      },
      {
        Header: "주민번호",
        accessor: "noResident",
        id: "noResident",
        Cell: ({ cell: { value }, row: { original, index } }) => {
          return (
            <Input
              style={
                {
                  // background: index === 0 && highlightFirstRow1 ? '#92c5ff' : 'transparent'
                }
              }
              value={original?.noResident || ""}
              onClick={handleInputClick}
            />
          );
        },
      },
    ],
    [], //이 상태가 바뀌기 전까지는 전의 data 유지.
  );

  return (
    <>
      <div className="searchBar">
        <div className="innerBox fxSpace">
          <div className="selectWrapper">
            <div className="searchBarName">작성년월</div>
            <CustomCalendar
              width="150"
              type="month"
              value={belongingDate}
              onChange={handleBelongingDateChange}
              id="creDateStart"
              readOnly
            />
            <b>~</b>
            <CustomCalendar
              width="150"
              type="month"
              value={belongingDate2}
              onChange={handleBelongingDateChange2}
              id="creDateEnd"
              readOnly
            />

            <SearchBarBox
              label="정렬"
              id="wc-order"
              options={[
                { value: "1", label: "사원코드 순" },
                { value: "2", label: "사원이름 순" },
                { value: "3", label: "작성일자 순" },
              ]}
              defaultValue="1"
              onChange={searchOrderOption}
            />
          </div>
          <div className="btnWrapper">
            {/* <SearchSubmitButton onClick={conditionSearch} text="조회" /> */}
          </div>
        </div>
      </div>

      <section className="section wcSection">
        <div className="wcGrid">
          <div className="wclistArea">
            <div className="namePickerBox">
              <Table
                columns={columns}
                data={data}

                // bottomFocus={true}
              />
            </div>
            <table className="wcGridBottomTable">
              <tbody>
                <tr>
                  <td>조회된 사원</td>
                  <td>{data.length}명</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="wcGrid2">
          <div className="borderbuttonBoldBlack">
            <h1 className="wcRightHead">근로계약서</h1>
          </div>
          <div className="wcScroll">
            <table className="">
              <tbody>
                <tr>
                  <th className="wcHeaderStyle"> 근로계약기간 </th>
                  <td className="wcCellStyle">
                    <CustomCalendar
                      width="181"
                      id="startDate"
                      disabled
                      value={paramGetEmpList.dtStartCont || ""}
                    />
                  </td>
                  <td className="wcCellStyle">
                    <CustomCalendar
                      width="181"
                      id="endDate"
                      disabled
                      value={paramGetEmpList.dtEndCont || ""}
                    />
                  </td>
                </tr>
                <tr>
                  <th className="wcHeaderStyle">근무장소 </th>
                  <td className="wcCellStyle">
                    <CustomInput
                      value={paramGetEmpList.noWorkPost || ""}
                      width={180}
                      readOnly
                    />
                  </td>
                  <td className="wcCellStyle">
                    <CustomInput
                      readOnly
                      width={415}
                      value={paramGetEmpList.addrWork || ""}
                    />
                    <CustomButton
                      className="wcRightCellSearchButton"
                      text="주소검색"
                      color="black"
                      disabled={true}
                    />
                  </td>

                  <td className="wcRightGridTableRightTd3"></td>
                </tr>
                <tr>
                  <th className="wcHeaderStyle">상세주소 </th>
                  <td className="wcCellStyle" colSpan="2">
                    <CustomInput
                      width={638}
                      readOnly
                      value={paramGetEmpList.addrWorkDtl || ""}
                    />
                  </td>
                </tr>
                <tr>
                  <th className="wcHeaderStyle">업무의 내용 </th>

                  <td className="wcCellStyle" colSpan="2">
                    <CustomInput
                      width="638"
                      readOnly
                      value={paramGetEmpList.cntnJob || ""}
                    />
                  </td>
                </tr>
                <tr>
                  <th className="wcHeaderStyle">소정근로시간 </th>
                  <td className="wcCellStyle">
                    <CustomInput
                      readOnly
                      value={paramGetEmpList.tmStartRegularWork || ""}
                    />
                  </td>
                  <td className="wcCellStyle">
                    <CustomInput
                      readOnly
                      value={paramGetEmpList.tmEndRegularWork || ""}
                    />
                  </td>
                </tr>
                <tr>
                  <th className="wcHeaderStyle">휴게시간 </th>
                  <td className="wcCellStyle">
                    <CustomInput
                      readOnly
                      value={paramGetEmpList.tmStartBreak || ""}
                    />
                  </td>
                  <td className="wcCellStyle">
                    <CustomInput
                      readOnly
                      value={paramGetEmpList.tmEndBreak || ""}
                    />
                  </td>
                </tr>
                <tr>
                  <th className="wcHeaderStyle">근무일 </th>
                  <td className="wcCellStyle">
                    <CustomSelect
                      disabled
                      options={[
                        { value: "0", label: " 미작성 " },
                        { value: "1", label: "1주에 1일" },
                        { value: "2", label: "1주에 2일" },
                        { value: "3", label: "1주에 3일" },
                        { value: "4", label: "1주에 4일" },
                        { value: "5", label: "1주에 5일" },
                        { value: "6", label: "1주에 6일" },
                        { value: "7", label: "1주에 7일" },
                      ]}
                      className={"wcSelect1"}
                      value={paramGetEmpList.ddWorking || 0}
                    />
                  </td>
                  <td className="wcCellStyle"></td>
                </tr>
                <tr>
                  <th className="wcHeaderStyle">주휴일 </th>
                  <td className="wcCellStyle">
                    <CustomSelect
                      disabled
                      options={[
                        { value: "0", label: " 미작성 " },
                        { value: "1", label: "매주 월요일" },
                        { value: "2", label: "매주 화요일" },
                        { value: "3", label: "매주 수요일" },
                        { value: "4", label: "매주 목요일" },
                        { value: "5", label: "매주 금요일" },
                        { value: "6", label: "매주 토요일" },
                        { value: "7", label: "매주 일요일" },
                      ]}
                      value={paramGetEmpList.dotw || 0}
                      className={"wcSelect1"}
                    />
                  </td>
                  <td className="wcCellStyle"></td>
                </tr>
                <tr>
                  <th className="wcHeaderStyle">임금유형 </th>
                  <td className="wcCellStyle">
                    <CustomSelect
                      disabled
                      options={[
                        { value: "0", label: " 미작성 " },
                        { value: "1", label: " 월급 " },
                        { value: "2", label: " 일급 " },
                        { value: "3", label: " 시급 " },
                      ]}
                      value={paramGetEmpList.tpSal || 0}
                      className={"wcSelect2"}
                    />
                  </td>
                  <td className="wcCellStyle">
                    <CustomInput
                      width={180}
                      readOnly
                      value={paramGetEmpList.amtSal || ""}
                    />
                    <b> 원</b>
                  </td>
                </tr>
                <tr>
                  <th className="wcHeaderStyle">임금지급일 </th>
                  <td className="wcCellStyle">
                    <CustomSelect
                      disabled
                      options={[
                        { value: "0", label: " 미작성 " },
                        { value: "1", label: " 매월 " },
                        { value: "2", label: " 매주 " },
                        { value: "3", label: " 매일 " },
                      ]}
                      value={paramGetEmpList.tpPayDtSal || 0}
                      className={"wcSelect2"}
                    />
                  </td>
                  <td className="wcCellStyle">
                    <CustomInput
                      width={180}
                      readOnly
                      value={paramGetEmpList.ddPaySal || ""}
                    />
                    <b> 일 </b>
                  </td>
                </tr>
                <tr>
                  <th className="wcHeaderStyle">지급방법 </th>
                  <td className="wcCellStyle">
                    <CustomSelect
                      disabled
                      options={[
                        { value: "0", label: " 미작성 " },
                        { value: "1", label: " 예금통장에 입금 " },
                        { value: "2", label: " 직접지급 " },
                      ]}
                      value={paramGetEmpList.methodPay || 0}
                      className="wcSelect3"
                    />
                  </td>
                  <td className="wcCellStyle"></td>
                </tr>
                <tr>
                  <th className="wcHeaderStyle"> 고용보험 </th>
                  <td className="wcCellStyle">
                    <CustomSelect
                      disabled
                      options={[
                        { value: "0", label: " 미작성 " },
                        { value: "1", label: " 여 " },
                        { value: "2", label: " 부 " },
                      ]}
                      value={paramGetEmpList.ynEmpInsurance || 0}
                      className="wcSelect3"
                    />
                  </td>
                  <td className="wcCellStyle"></td>
                </tr>
                <tr>
                  <td className="wcHeaderStyle"> 산재보험 </td>
                  <td className="wcCellStyle">
                    <CustomSelect
                      disabled
                      options={[
                        { value: "0", label: " 미작성 " },
                        { value: "1", label: " 여 " },
                        { value: "2", label: " 부 " },
                      ]}
                      value={paramGetEmpList.ynIndustrialAccidentInsurance || 0}
                      className="wcSelect3"
                    />
                  </td>
                  <td className="wcCellStyle"></td>
                </tr>
                <tr>
                  <th className="wcHeaderStyle"> 국민연금 </th>
                  <td className="wcCellStyle">
                    <CustomSelect
                      disabled
                      options={[
                        { value: "0", label: " 미작성 " },
                        { value: "1", label: " 여 " },
                        { value: "2", label: " 부 " },
                      ]}
                      value={paramGetEmpList.ynNationalPension || 0}
                      className="wcSelect3"
                    />
                  </td>
                  <td className="wcCellStyle"></td>
                </tr>
                <tr>
                  <th className="wcHeaderStyle"> 건강보험 </th>
                  <td className="wcCellStyle">
                    <CustomSelect
                      disabled
                      options={[
                        { value: "0", label: " 미작성 " },
                        { value: "1", label: " 여 " },
                        { value: "2", label: " 부 " },
                      ]}
                      value={paramGetEmpList.ynHealthInsurance || 0}
                      className="wcSelect3"
                    />
                  </td>
                  <td className="wcCellStyle"></td>
                </tr>
                <tr>
                  <th className="wcHeaderStyle"> 서명여부 </th>
                  <td className="wcCellStyle">
                    <CustomSelect
                      disabled
                      options={[
                        { value: "0", label: " 미작성 " },
                        { value: "1", label: " 여 " },
                        { value: "2", label: " 부 " },
                      ]}
                      value={paramGetEmpList.stSign || 0}
                      className="wcSelect3"
                    />
                  </td>
                  <td className="wcCellStyle"></td>
                </tr>
                <tr>
                  <th className="wcHeaderStyle">작성일자 </th>
                  <td className="wcCellStyle">
                    <CustomCalendar
                      value={paramGetEmpList.dtCreated || ""}
                      disabled
                      className={"wcCreatedDateCalander"}
                      width="180"
                      id="createDate"
                    />
                  </td>
                  <td className="wcCellStyle"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {showAlert && (
        <SweetAlert
          text=" 조회기간을 정확히 입력해주세요. "
          //type="success"
          type="warning"
          //type="error"
          //type="question"
          onConfirm={() => {
            setShowAlert(false);
          }}
        />
      )}
    </>
  );
};

export default WorkContractSelect;
