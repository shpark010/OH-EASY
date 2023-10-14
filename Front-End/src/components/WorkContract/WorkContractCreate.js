import React, { useState, useMemo, useEffect, useRef } from "react";
import "../../styles/css/pages/WorkContract.css";
import CustomCalendar from "../../components/Contents/CustomCalendar";
import CustomInput from "../../components/Contents/CustomInput";
import CustomButton from "../../components/Contents/CustomButton";
import SearchBarBox from "../../components/SearchBar/SearchBarBox";
import Table from "../../components/TablesLib/Table";
import Input from "../Contents/InputTest";
import DaumPostcode from "react-daum-postcode";
import useApiRequest from "../Services/ApiRequest";
import CustomModal from "../../components/Contents/CustomModal";
import PageHeaderName from "../../components/PageHeader/PageHeaderName";
import CustomSelect from "../../components/Contents/CustomSelect";
import SweetAlert from "../Contents/SweetAlert";

const WorkContractCreate = ({
  clickCode,
  setClickCode,
  checkColumn,
  setCheckColumn,
  handleCheckboxChange,
  employeeData,
  setEmployeeData,
  paramGetEmpList1,
  setParamGetEmpList1,
  highlightFirstRow,
  setHighlightFirstRow,
  showInsertRow,
  setShowInsertRow,
}) => {
  const apiRequest = useApiRequest();
  const [openPostcode, setOpenPostcode] = useState(false); // 주소모달 상태
  const [selectAll, setSelectAll] = useState(false); // checkbox가 모두 check된 상태 관리
  const [belongingDate, setBelongingDate] = useState(""); //조건조회시 년월 달력 상태 관리.
  const [searchOrder, setSearchOrder] = useState("1"); // 정렬 방법 관리 State
  // const [paramGetEmpList1,setParamGetEmpList1] = useState({
  //   dtStartCont: '',
  //   dtEndCont: '',
  //   noWorkPost: '',
  //   addrWork: '',
  //   addrWorkDtl: '',
  //   cntnJob: '',
  //   tmStartRegularWork: '',
  //   tmEndRegularWork: '',
  //   tmStartBreak: '',
  //   tmEndBreak: '',
  //   ddWorking: '',
  //   dotw: '',
  //   tpSal: '',
  //   amtSal: '',
  //   tpPayDtSal: '',
  //   ddPaySal: '',
  //   methodPay: '',
  //   ynEmpInsurance: '',
  //   ynIndustrialAccidentInsurance: '',
  //   ynNationalPension: '',
  //   ynHealthInsurance: '',
  //   stSign: '',
  //   dtCreated: '',
  // }) // 오른쪽 table 상태관리
  // const [clickCode,setClickCode] = useState(""); //code click시 값을 저장할 state
  // const [showInsertRow, setShowInsertRow] = useState(false); // 테이블의 insertRow의 상태
  const [modalEmpList, setModalEmpList] = useState([]); // 모달창에 넣을 사원 정보
  const [modalIsOpen2, setModalIsOpen2] = useState(false); // 추가 모달 on off 상태
  const [clickModalEmpCode, setClickModalEmpCode] = useState(null); // 현재 클릭한 cdEmp 저장하는 상태
  const [payState, setPayState] = useState("on"); // 임금지급일에 따른 style 상태 관리, 초기값 on
  const [showAlert, setShowAlert] = React.useState(false); // sweetalret
  const [showAlert2, setShowAlert2] = React.useState(false); // sweetalret
  const [showAlert3, setShowAlert3] = React.useState(false); // sweetalret
  const [showAlert4, setShowAlert4] = React.useState(false); // sweetalret
  const [showAlert5, setShowAlert5] = React.useState(false); // sweetalret
  const [showAlert6, setShowAlert6] = React.useState(false); // sweetalret
  const [showAlert7, setShowAlert7] = React.useState(false); // sweetalret
  const [showAlert8, setShowAlert8] = React.useState(false); // sweetalret
  // const [highlightFirstRow, setHighlightFirstRow] = useState(true); //첫번째 행 표시를 위해
  const [highlightLastRow, setHighlightLastRow] = useState(false); //마지막째 행 표시를 위해
  const [highLightModal, setHighLightModal] = useState(false); // 사원코드에 하이라이트 상태
  const [highLightModal2, setHighLightModal2] = useState(false); // 사원명에 하이라이트 상태
  const [highLightModal3, setHighLightModal3] = useState(false); // 주민번호에 하이라이트 상태

  const [validate, setValidate] = useState({
    addrWorkDtl: "",
    cntnJob: "",
    tmStartRegularWork: "",
    tmEndRegularWork: "",
    tmStartBreak: "",
    tmEndBreak: "",
  }); //get, update후 최초값과 비교하기 위해 사용할 state

  // const prevParamGetEmpList1Ref = useRef(paramGetEmpList1);

  // useEffect(() => {
  //   prevParamGetEmpList1Ref.current = paramGetEmpList1;
  // });

  const contractPeriodCalendar1 = async (newDate) => {
    newDate = newDate.replace(/-/g, "");
    const cdEmp = clickCode;
    const data = newDate;
    const colum = "dtStartCont";

    if (!cdEmp || data === "") return;

    // 만약 dtEndCont 값이 있고, dtStartCont가 dtEndCont보다 크다면 오류를 표시합니다.
    if (paramGetEmpList1.dtEndCont && data > paramGetEmpList1.dtEndCont) {
      setShowAlert(true);
      return; //시작 근로계약 기간은 종료 근로계약 기간보다 빠를 수 없습니다
    }

    setParamGetEmpList1({ ...paramGetEmpList1, dtStartCont: data });

    try {
      const responseData = await apiRequest({
        method: "PUT",
        url: `/api2/wc/updateEmpList?cdEmp=${cdEmp}&colum=${colum}&data=${data}`,
      });
    } catch (error) {
      console.error("Failed to fetch emp data:", error);
    }
  };

  const contractPeriodCalendar2 = async (newDate) => {
    newDate = newDate.replace(/-/g, "");
    const cdEmp = clickCode;
    const data = newDate;
    const colum = "dtEndCont";

    if (!cdEmp || data === "") return;

    // 만약 dtStartCont 값이 있고, dtEndCont가 dtStartCont보다 작다면 오류를 표시합니다.
    if (paramGetEmpList1.dtStartCont && data < paramGetEmpList1.dtStartCont) {
      setShowAlert2(true);
      return;
    }

    setParamGetEmpList1({ ...paramGetEmpList1, dtEndCont: data });

    try {
      const responseData = await apiRequest({
        method: "PUT",
        url: `/api2/wc/updateEmpList?cdEmp=${cdEmp}&colum=${colum}&data=${data}`,
      });
    } catch (error) {
      console.error("Failed to fetch emp data:", error);
    }
  };

  const contractPeriodCalendar3 = async (newDate) => {
    newDate = newDate.replace(/-/g, "");
    const cdEmp = clickCode;
    const data = newDate;
    const colum = "dtCreated";
    if (!paramGetEmpList1.dtStartCont || !paramGetEmpList1.dtEndCont) {
      return;
    }
    if (cdEmp == null || cdEmp === "" || cdEmp === undefined || data === "") {
      return;
    }
    if (belongingDate === null || belongingDate === "") {
      setEmployeeData([]);
      setParamGetEmpList1([]);
      return;
    }
    console.log(cdEmp);
    console.log(data);
    console.log(colum);

    setParamGetEmpList1({ ...paramGetEmpList1, dtCreated: data });

    try {
      const responseData = await apiRequest({
        method: "PUT",
        url: `/api2/wc/updateEmpList?cdEmp=${cdEmp}&colum=${colum}&data=${data}`,
      });

      const empListResponseData = await apiRequest({
        method: "GET",
        url: `/api2/wc/getEmpList?creDate=${belongingDate}&orderValue=${searchOrder}`,
      });

      setEmployeeData(empListResponseData);

      const lastTwoCharsNewDate = newDate.slice(4, 6);
      const lastTwoCharsBelongingDate = belongingDate.slice(-2);
      console.log(lastTwoCharsNewDate);
      console.log(lastTwoCharsBelongingDate);

      if (lastTwoCharsNewDate !== lastTwoCharsBelongingDate) {
        const firstCdEmp =
          empListResponseData && empListResponseData[0]
            ? empListResponseData[0].cdEmp
            : null; // responseData의 첫 번째 항목에서 cdEmp 값을 가져옵니다.
        setClickCode(firstCdEmp);
        if (firstCdEmp) {
          // 두 번째 API 요청

          const responseData2 = await apiRequest({
            method: "GET",
            url: `/api2/wc/getCodeParamEmpList?code=${firstCdEmp}`,
          });

          setParamGetEmpList1(responseData2); // 오른쪽 table 보여줄 data set
          setValidate(responseData2); //  초기값을 담을 state validate에 사용할 data set
          setHighlightFirstRow(true);
          setHighlightLastRow(false);
          setShowInsertRow(false);
        }
      } //작성일자의 월과 작성년월의 월이 다르면 empList 또한 update 됨. 그래서 맨위의 cdEmp 바로 표시
    } catch (error) {
      console.error("Failed to fetch emp data:", error);
    }
  };

  // 온체인지
  const inputOnChange = async (e) => {
    // select tag나 건드릴수 없는 input tag의 경우만. put api날리고 나머지는 set만 set한건 onBlur에서 put api날릴 것

    const cdEmp = clickCode;
    const data = e.target.value;
    const colum = e.target.id;

    console.log(cdEmp);

    if (!paramGetEmpList1.dtStartCont || !paramGetEmpList1.dtEndCont) {
      return;
    }

    if (cdEmp === null || cdEmp === "" || cdEmp === undefined) {
      return;
    } // code값이 공백이면 종료

    if (data === "") {
      //맨앞자리가 지워지지않는 것때문에
      setParamGetEmpList1({
        ...paramGetEmpList1,
        [e.target.id]: data,
      });
      return;
    }

    if (
      colum === "tmStartRegularWork" ||
      colum === "tmEndRegularWork" ||
      colum === "tmStartBreak" ||
      colum === "tmEndBreak"
    ) {
      //시간 관련된 validation
      if (2400 < data) {
        // 시간이 2400을 넘기면 변경x
        return;
      }
      const onlyNumbers = /^[0-9]*$/;

      // 입력값이 숫자로만 이루어져 있지 않으면 변경하지 않음
      if (!onlyNumbers.test(data)) {
        return;
      }
    }

    if (colum === "amtSal") {
      // 임금금액 validation
      const modifyData = e.target.value.replace(/\D/g, ""); // 숫자이외제거, 숫자만 입력되게
      const data = modifyData.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

      setParamGetEmpList1({ ...paramGetEmpList1, [e.target.id]: data });
      return;
    }

    // if(colum === "tpPayDtSal"){ //임금지급일 미지급 매주 매일 일경우 off
    //   if(e.target.value ==="0" ||
    //   e.target.value ==="2" ||
    //   e.target.value ==="3" ){
    //     setPayState("off")
    //   }
    //   else{
    //     setPayState("on")
    //   }
    // }

    if (colum === "ddPaySal" && payState === "on") {
      // 32일이 넘으면 변경x
      if (data > 31 || data == 0) {
        return;
      }
    }

    //   if(colum ==="addrWorkDtl" ||
    //   colum ==="cntnJob"){
    //     const forbiddenCharacters = /[!@#$%^&*]/;
    // // 입력값이 특수문자를 포함하고 있으면 변경하지 않음
    // if (forbiddenCharacters.test(data)) {
    //   return;
    // }
    //   }

    if (colum === "addrWorkDtl" || colum === "cntnJob") {
      const forbiddenCharacters = /^[a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ가-힣\s]*$/;

      if (!forbiddenCharacters.test(data)) {
        return;
      }
    }

    setParamGetEmpList1({ ...paramGetEmpList1, [e.target.id]: data });

    if (
      colum === "noWorkPost" ||
      colum === "addrWork" ||
      colum === "ddWorking" ||
      colum === "dotw" ||
      colum === "tpSal" ||
      colum === "tpPayDtSal" ||
      colum === "methodPay" ||
      colum === "ynEmpInsurance" ||
      colum === "ynIndustrialAccidentInsurance" ||
      colum === "ynNationalPension" ||
      colum === "ynHealthInsurance" ||
      colum === "stSign"
    ) {
      try {
        const responseData = await apiRequest({
          method: "PUT",
          url: `/api2/wc/updateEmpList?cdEmp=${cdEmp}&colum=${colum}&data=${data}`,
        });
      } catch (error) {
        console.error("Failed to fetch emp data:", error);
      }
    }
  }; // input tag에 변화가 발생했을때 상태를 복사하고 바뀐값만 변경하는 set함수 호출
  // 상태만 변경하는 함수.

  //온블러
  const inputOnBlur = async (e) => {
    const cdEmp = clickCode;
    const colum = e.target.id;
    const data = e.target.value;

    if (!cdEmp) return; //null이 들어와도 update돼야함. 값이 있다가 다지웠을때도 update돼야 하기 때문.

    if (!paramGetEmpList1.dtStartCont || !paramGetEmpList1.dtEndCont) {
      return;
    }

    if (validate[colum] === data || (!validate[colum] && !data)) {
      console.log("들어온값이 초기값과 같다면 종료");
      console.log(validate[colum]);
      console.log(data);
      return;
    }

    const validateTimeDifference = (startTime, endTime) => {
      if (
        startTime &&
        endTime &&
        startTime.length === 4 &&
        endTime.length === 4
      ) {
        if (startTime > endTime) {
          return false;
        }
      }
      return true;
    };

    const isValidTime = (timeStr) => {
      const hour = parseInt(timeStr.substring(0, 2), 10);
      const minute = parseInt(timeStr.substring(2, 4), 10);

      return hour < 24 && minute < 60;
    };

    if (colum === "tmStartRegularWork" || colum === "tmEndRegularWork") {
      if (data && data.length !== 4) {
        setShowAlert3(true);
        return;
      }

      if (data && !isValidTime(data)) {
        setShowAlert4(true);
        return;
      }

      // 정기 근무 시간 검증
      if (
        !validateTimeDifference(
          paramGetEmpList1.tmStartRegularWork,
          paramGetEmpList1.tmEndRegularWork,
        )
      ) {
        setShowAlert5(true);
        return;
      }
    } else if (colum === "tmStartBreak" || colum === "tmEndBreak") {
      if (data && data.length !== 4) {
        setShowAlert3(true);
        return;
      }

      if (data && !isValidTime(data)) {
        setShowAlert4(true);
        return;
      }

      // 휴식 시간 검증
      if (
        !validateTimeDifference(
          paramGetEmpList1.tmStartBreak,
          paramGetEmpList1.tmEndBreak,
        )
      ) {
        setShowAlert6(true);
        return;
      }

      // 휴식 시간이 정기 근무 시간 사이에 있는지 검증
      if (
        paramGetEmpList1.tmStartBreak < paramGetEmpList1.tmStartRegularWork ||
        paramGetEmpList1.tmEndBreak > paramGetEmpList1.tmEndRegularWork
      ) {
        setShowAlert7(true);
        return;
      }
    }

    try {
      console.log("onBlur진입 put");
      const responseData = await apiRequest({
        method: "PUT",
        url: `/api2/wc/updateEmpList?cdEmp=${cdEmp}&colum=${colum}&data=${data}`,
      });

      const responseData2 = await apiRequest({
        //update된 값 가져와서 Validatae set하기 위해
        method: "GET",
        url: `/api2/wc/getCodeParamEmpList?code=${clickCode}`,
      });
      setValidate(responseData2);
    } catch (error) {
      console.error("Failed to fetch emp data:", error);
    }
  };

  //작성년월 이벤트핸들러
  const handleBelongingDateChange = async (newDate) => {
    newDate = newDate.replace(/-/g, "");
    if (newDate !== belongingDate) {
      setHighlightFirstRow(true);
      setHighlightLastRow(false);
    }

    setParamGetEmpList1([]);
    setBelongingDate(newDate);
    setCheckColumn([]);
    setShowInsertRow(false);

    try {
      // 첫 번째 API 요청
      const responseData = await apiRequest({
        method: "GET",
        url: `/api2/wc/getEmpList?creDate=${newDate}&orderValue=${searchOrder}`,
      });
      setEmployeeData(responseData);

      const firstCdEmp =
        responseData && responseData[0] ? responseData[0].cdEmp : null; // responseData의 첫 번째 항목에서 cdEmp 값을 가져옵니다.
      setClickCode(firstCdEmp);
      if (firstCdEmp) {
        // 두 번째 API 요청

        const responseData2 = await apiRequest({
          method: "GET",
          url: `/api2/wc/getCodeParamEmpList?code=${firstCdEmp}`,
        });

        setParamGetEmpList1(responseData2); // 오른쪽 table 보여줄 data set
        setValidate(responseData2); //  초기값을 담을 state validate에 사용할 data set
      }
    } catch (error) {
      console.error("Failed to fetch emp data:", error);

      //     const lastCdEmp = responseData && responseData.length > 0 ? responseData[responseData.length - 1].cdEmp : null;
      //     setClickCode(lastCdEmp);

      //     if (lastCdEmp) {
      //         // 두 번째 API 요청
      //         const responseData2 = await apiRequest({
      //             method: "GET",
      //             url: `/api2/wc/getCodeParamEmpList?code=${lastCdEmp}`,
      //         });

      //         setParamGetEmpList1(responseData2); // 오른쪽 table 보여줄 data set
      //         setValidate(responseData2); // 초기값을 담을 state validate에 사용할 data set
      //     }
      // } catch (error) {
      //     console.error("Failed to fetch emp data:", error);
    }
    // }
  };

  const dataModalEmpList = useMemo(
    () =>
      modalEmpList.map((emp) => ({
        cdEmp: emp.cdEmp,
        nmEmp: emp.nmEmp,
        noResident: emp.noResident,
      })),
    [modalEmpList],
  );

  // 모달창에서 추가하기 하면 꺼지면서 사원 인서트 그냥 추가하기
  const closeModalAndEmpInsert = async () => {

    if(!clickModalEmpCode){
      return
    }
    closeModal2();

    setParamGetEmpList1([]);
    setClickCode(clickModalEmpCode);
    try {
      const responseData = await apiRequest({
        method: "GET", //get이지만 insert
        url: `/api2/wc/getModalData?cdEmp=${clickModalEmpCode}`,
      });

      setShowInsertRow(false);
      setEmployeeData((prevEmployeeData) => [
        ...prevEmployeeData,
        responseData,
      ]);

      // if (clickModalEmpCode) {
      //     // 두 번째 API 요청 Table.js에 의해서 무조건 맨위의 code를 오른쪽 Table에 표시해야함.

      //     const responseData2 = await apiRequest({
      //         method: "GET",
      //         url: `/api2/wc/getCodeParamEmpList?code=${employeeData[0].cdEmp}`,
      //     });
      //     console.log(responseData2);
      //     setParamGetEmpList1(responseData2); // 오른쪽 table 보여줄 data set
      //     setValidate(responseData2); //  초기값을 담을 state validate에 사용할 data set
      // }
      if (clickModalEmpCode) {
        // employeeData의 마지막 항목에서 cdEmp 값을 가져옵니다.

        // 두 번째 API 요청
        const responseData2 = await apiRequest({
          method: "GET",
          url: `/api2/wc/getCodeParamEmpList?code=${clickModalEmpCode}`,
        });
        console.log(responseData2);
        setParamGetEmpList1(responseData2); // 오른쪽 table 보여줄 data set
        setValidate(responseData2); // 초기값을 담을 state validate에 사용할 data set
      }
    } catch (error) {
      console.error("Failed to fetch emp data:", error);
    }
  };

  // 더블클릭시 모달창에서 추가하기 하면 꺼지면서 사원 인서트
  const closeModalAndEmpInsert2 = async (cdEmp) => {
    closeModal2();

    setParamGetEmpList1([]);
    setClickCode(cdEmp); //더블클릭한 code set
    try {
      const responseData = await apiRequest({
        method: "GET", //get이지만 insert
        url: `/api2/wc/getModalData?cdEmp=${cdEmp}`,
      });

      setShowInsertRow(false);

      setEmployeeData((prevEmployeeData) => [
        ...prevEmployeeData,
        responseData,
      ]);
      setHighlightLastRow(true);

      // if (cdEmp) {
      //     // 두 번째 API 요청

      //     const responseData2 = await apiRequest({
      //       method: "GET",
      //       url: `/api2/wc/getCodeParamEmpList?code=${employeeData[0].cdEmp}`,
      //   });
      //   console.log(responseData2);
      //   setParamGetEmpList1(responseData2); // 오른쪽 table 보여줄 data set
      //   setValidate(responseData2); //  초기값을 담을 state validate에 사용할 data set
      // }

      if (cdEmp) {
        // 두 번째 API 요청
        const responseData2 = await apiRequest({
          method: "GET",
          url: `/api2/wc/getCodeParamEmpList?code=${cdEmp}`,
        });
        console.log(responseData2);
        setParamGetEmpList1(responseData2); // 오른쪽 table 보여줄 data set
        setValidate(responseData2); // 초기값을 담을 state validate에 사용할 data set
      }
    } catch (error) {
      console.error("Failed to fetch emp data:", error);
    }
  };

  const handleAddressSelect = async (addr) => {
    console.log(addr.address);
    console.log(addr.jibunAddress);

    // 상태를 업데이트하여 주소와 우편번호를 입력란에 설정
    setParamGetEmpList1((prevState) => ({
      ...prevState,
      noWorkPost: addr.zonecode,
      addrWork: addr.address,
    }));

    const cdEmp = clickCode;
    const colum1 = "noWorkPost";
    const colum2 = "addrWork";

    try {
      const responseData = await apiRequest({
        method: "PUT",
        url: `/api2/wc/updateEmpList?cdEmp=${cdEmp}&colum=${colum1}&data=${addr.zonecode}`, // 실제 주소 값에 맞게 수정해야 함
      });
    } catch (error) {
      console.error("Failed to update address:", error);
    }

    try {
      const responseData = await apiRequest({
        method: "PUT",
        url: `/api2/wc/updateEmpList?cdEmp=${cdEmp}&colum=${colum2}&data=${addr.address}`, // 실제 주소 값에 맞게 수정해야 함
      });
    } catch (error) {
      console.error("Failed to update address:", error);
    }

    setOpenPostcode(false);
  };

  const data = useMemo(
    () =>
      employeeData.map((emp) => ({
        cdEmp: emp.cdEmp,
        nmEmp: emp.nmEmp,
        noResident: emp.noResident,
      })),
    [employeeData],
  );

  useEffect(() => {
    console.log("employeeData 변경됨:", employeeData);
  }, [employeeData]); //  변경될 때만 실행

  //delete 맨위 체크박스 all selcet의 이벤트 핸들러
  const selectAllCheckBox = (e) => {
    if (selectAll) {
      setCheckColumn([]); // 모두 해제
    } else {
      setCheckColumn(data.map((d) => d.cdEmp)); // 모든 cdEmp 값을 배열에 넣음
    }
    setSelectAll(!selectAll); // selectAll 상태 토글
  };

  const searchOrderOption = async (e) => {
    setSearchOrder(e.target.value);
    setEmployeeData([]);
    setHighlightFirstRow(true);
    setHighlightLastRow(false);
    setShowInsertRow(false);
    setCheckColumn([]); //정렬 바꿀때 check 비우기
    if (belongingDate) {
      // 달력에 값이 있는지 확인
      try {
        const responseData = await apiRequest({
          method: "GET",
          url: `/api2/wc/getEmpList?creDate=${belongingDate}&orderValue=${e.target.value}`,
        });

        // const lastCdEmp = responseData && responseData.length > 0 ? responseData[responseData.length - 1].cdEmp : null;    // responseData의 마지막 항목에서 cdEmp 값을 가져옵니다.
        // setClickCode(lastCdEmp);
        // if (lastCdEmp) {
        //     // 두 번째 API 요청
        //     const responseData2 = await apiRequest({
        //         method: "GET",
        //         url: `/api2/wc/getCodeParamEmpList?code=${lastCdEmp}`,
        //     });

        //     setParamGetEmpList1(responseData2); // 오른쪽 table 보여줄 data set
        // }

        const firstCdEmp =
          responseData && responseData[0] ? responseData[0].cdEmp : null; // responseData의 첫 번째 항목에서 cdEmp 값을 가져옵니다.
        setClickCode(firstCdEmp);
        if (firstCdEmp) {
          // 두 번째 API 요청

          const responseData2 = await apiRequest({
            method: "GET",
            url: `/api2/wc/getCodeParamEmpList?code=${firstCdEmp}`,
          });

          setParamGetEmpList1(responseData2); // 오른쪽 table 보여줄 data set
          setEmployeeData(responseData);
          setValidate(responseData2); //  초기값을 담을 state validate에 사용할 data set
        }
      } catch (error) {
        console.error("Failed to fetch emp data:", error);
      }
    }
  };

  //온클릭
  // 이렇게 맨위로 하나로 빼면 e.target 써야되고 안에 각각 써주면 original로 접근간능
  const handleInputClick = async (e) => {
    //왼쪽 Table 클릭시 호출되는 함수.
    // 1. parametr로 보낼 code state로 관리하기, 모든 cell에서 눌렀을때 code를 가져와야함.
    // 2. e.target으로 찾기.

    // 1. cell에서 library parameter사용하기 -> 값은 제대로 가져오는데 공통 Component에 porp 전달이 안된다던가 하는 문제가 생김

    const code = e.target.parentElement.parentElement.querySelector(
      "td:nth-child(2) input",
    );

    //   document.querySelectorAll('td').forEach(td => {
    //     td.style.backgroundcolor =#92c5ff;
    // }); 모든 td에 적용

    setHighlightFirstRow(false); //클릭 발생시 highlight 끄기
    setHighlightLastRow(false); // 클릭 발생시 마지막 행 highlight 끄기

    if (code.value) {
      const param = code.value;
      setClickCode(param);
      console.log(param); //잘가져옴
      try {
        const responseData = await apiRequest({
          method: "GET",
          url: `/api2/wc/getCodeParamEmpList?code=${param}`,
        });

        setParamGetEmpList1(responseData); //code get emplist
        setValidate(responseData); //server에서 가져온 초기값 저장.
      } catch (error) {
        console.error("Failed to fetch emp data:", error);
      }
    } else {
      openModal2(e); //눌렀는데 cdemp가 값이 없으면 insert 하는 modal opne해라.
      try {
        const responseData = await apiRequest({
          method: "GET",
          url: "/api2/wc/getModalEmpList",
        });
        setModalEmpList(responseData);
      } catch (error) {
        console.error("Failed to fetch emp data:", error);
      }
    }
  };
  //왼쪽 Table 아무영역 눌렀을때 발생시킬 event
  // 방법 1 : 조건조회할때 미리 다 가져와 뿌리기. 사람이 많아졌을때 고려하면 x
  // 방법 2 : 필요한 VO만 가져온후 왼쪽 Table 누를 경우 api 보내기

  useEffect(() => {
    console.log(paramGetEmpList1);
  }, [paramGetEmpList1]); // 변경될때만 실행. 가져온 VO확인용, set이 제대로 반영됐는지 안됐는지 확인할때 쓰는 용

  useEffect(() => {
    console.log(checkColumn);
  }, [checkColumn]); //

  const addrButtonClick = () => {
    setOpenPostcode(true);
  }; //모달열기

  const closeModal = () => {
    setOpenPostcode(false);
  };

  const openModal2 = () => {
    setModalIsOpen2(true);
    setHighLightModal(false);
    setHighLightModal2(false);
    setHighLightModal3(false);
  };

  const closeModal2 = () => {
    setModalIsOpen2(false);
  };
  // 사원추가 모달 끄고 닫기.

  const chekcBoxHighLigt = () => {
    setHighlightFirstRow(false);
    setHighlightLastRow(false);
  }; //checkbox 클릭시 background 없애기 위한 EventHandler

  const dataLength = data.length; //마지막 행의 code
  const columns = useMemo(
    () => [
      {
        Header: () => {
          return (
            <input
              type="checkbox"
              onChange={selectAllCheckBox}
              // belongingDate && clickCode && data.length===checkColumn.length
              checked={
                clickCode
                  ? data.length === checkColumn.length && checkColumn.length > 0
                  : belongingDate &&
                    data.length === checkColumn.length &&
                    (belongingDate !== null || data.length > 0) &&
                    checkColumn.length > 0
              }
            />
          );
        },
        accessor: "checkbox",
        id: "checkbox",
        width: "10%",
        Cell: ({ cell: { value }, row: { original, index } }) => {
          return (
            <>
              {/* <div className={
  index === 0 && highlightFirstRow 
      ? 'wcFirstRowHighlight' 
      : index === dataLength-1 && highlightLastRow 
          ? 'wchighlightLastRow' 
          :  ''
}> 
</div> */}
              <input
                type="checkbox"
                onChange={(e) => handleCheckboxChange(e, original?.cdEmp)}
                checked={
                  original &&
                  original.cdEmp &&
                  checkColumn.includes(original?.cdEmp)
                }
                //props로 checkColumn을 넘겨받은 뒤 checkColumn.includes(origianl.cdEmp)평가시점이 달라져 null을 자꾸 가져와서  그것을 방지하기 위해 작성한 code
                onClick={chekcBoxHighLigt}
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
        Cell: ({ cell: { value }, row: { original, index }, rows, data }) => {
          return (
            // <div className={index === 0 && highlightFirstRow ? 'wcFirstRowHighlight' :
            //                 index === dataLength-1 && highlightLastRow ? 'wchighlightLastRow' :
            // ''}>
            //     <Input
            //         value={original?.cdEmp || ""}
            //          onClick={handleInputClick}

            //     />
            // </div>
            <Input
              //   style={{
              //     background: index === 0 && highlightFirstRow
              //         ? '#92c5ff'
              //         : index === dataLength-1 && highlightLastRow
              //             ? '#92c5ff'
              //             : 'transparent'
              // }}
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
              //   style={{
              //     background: index === 0 && highlightFirstRow
              //         ? '#92c5ff'
              //         : index === dataLength-1 && highlightLastRow
              //             ? '#92c5ff'
              //             : 'transparent'
              // }}
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
              //   style={{
              //     background: index === 0 && highlightFirstRow
              //         ? '#92c5ff'
              //         : index === dataLength-1 && highlightLastRow
              //             ? '#92c5ff'
              //             : 'transparent'
              // }}
              value={original?.noResident || ""}
              onClick={handleInputClick}
            />
          );
        },
      },
    ],
    [checkColumn, handleCheckboxChange, paramGetEmpList1], //checkColum 변경시마다 check해제 되도록
  );

  // 모달 조건 검색 이벤트 핸들러
  const modalSearch = async (e) => {
    setHighLightModal(false);
    setHighLightModal2(false);
    setHighLightModal3(false);
    const searchValue = e.target.value.trim(); // 공백을 제거해줍니다.

    const allowedChars = /^[a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ가-힣\s]*$/;

    if (!allowedChars.test(searchValue)) {
      // 값이 허용되지 않는 경우 원래의 값을 유지
      setShowAlert8(true);
      return;
    }

    // 정규 표현식을 사용하여 문자열 판별
    const hasEnglish = /[a-zA-Z]/.test(searchValue);
    const hasNumbers = /\d/.test(searchValue);
    const hasKoreanSpelling = /^[ㄱ-ㅎㅏ-ㅣ]+$/.test(searchValue); //한글을 ㄱ도 인식하게
    const hasKorean = /^[가-힣]+$/.test(searchValue); // 한글 한글자 인식
    const hasKorean2 = /[가-힣]/.test(searchValue); // 완성된 한글
    const hasWhitespace = /\s/.test(searchValue);
    // const hasSpecialChars =  /[\u4E00-\u9FFF!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?＃＆＊＠§※☆★○]+/.test(searchValue);

    // if (!hasNumbers && !hasEnglish && !hasKoreanSpelling && !hasKorean && !hasKorean2 && !hasWhitespace){
    //   return;
    // }

    let data = {};

    if (hasKorean || hasKoreanSpelling || hasKorean2) {
      data["e.nm_emp"] = searchValue;
      setHighLightModal2(true);
    } else if (hasEnglish && hasNumbers) {
      data["e.cd_emp"] = searchValue;
      setHighLightModal(true);
    } else if (hasNumbers) {
      data["e.no_resident"] = searchValue;
      setHighLightModal3(true);
    } else if (hasEnglish) {
      data["e.nm_emp"] = searchValue;
      setHighLightModal2(true);
    }

    if (!searchValue || searchValue.length === 0) {
      setHighLightModal(false);
      setHighLightModal2(false);
      setHighLightModal3(false);
      try {
        const responseData = await apiRequest({
          method: "GET",
          url: "/api2/wc/getModalEmpList",
        });
        setModalEmpList(responseData);
      } catch (error) {
        console.error("Failed to fetch emp data:", error);
      }
      return;
    }

    try {
      const responseData = await apiRequest({
        method: "POST",
        url: "/api2/wc/getModalEmpListByName",
        data: data,
      });
      setModalEmpList(responseData);
    } catch (error) {
      console.error("Failed to fetch emp data:", error);
    }
  };

  const columnsModal = useMemo(
    () => [
      {
        Header: () => (
          <div className={highLightModal ? "wcMordalBackGround" : ""}>
            사원코드
          </div>
        ),

        accessor: "cdEmp",
        width: "45%",
        id: "cdEmp",
        Cell: ({ cell: { value }, row: { original } }) => {
          const handleInputClick = (e) => {
            console.log(e.target.value);
            setClickModalEmpCode(original.cdEmp);
          };
          const handleDoubleClick = (e) => {
            console.log("모달안 테이블 안에 더블 클릭 발생");
            console.log(original.cdEmp);
            setClickModalEmpCode(original.cdEmp);
            closeModalAndEmpInsert2(original.cdEmp);
          };
          return (
            <Input
              value={original?.cdEmp || ""}
              onClick={handleInputClick}
              className={"doubleLine"}
              onDoubleClick={handleDoubleClick}
            />
          );
        },
      },
      {
        Header: () => (
          <div className={highLightModal2 ? "wcMordalBackGround" : ""}>
            사원이름
          </div>
        ),
        accessor: "nmEmp",
        id: "nmEmp",
        Cell: ({ cell: { value }, row: { original } }) => {
          const handleInputClick = (e) => {
            console.log(e.target.value);
            setClickModalEmpCode(original.cdEmp);
          };
          const handleDoubleClick = (e) => {
            console.log("모달안 테이블 안에 더블 클릭 발생");
            console.log(original.cdEmp);
            setClickModalEmpCode(original.cdEmp);
            closeModalAndEmpInsert2(original.cdEmp);
          };
          return (
            <Input
              value={original?.nmEmp || ""}
              onClick={handleInputClick}
              className={"doubleLine"}
              onDoubleClick={handleDoubleClick}
            />
          );
        },
      },
      {
        Header: () => (
          <div className={highLightModal3 ? "wcMordalBackGround" : ""}>
            주민번호
          </div>
        ),
        accessor: "noResident",
        id: "noResident",
        Cell: ({ cell: { value }, row: { original } }) => {
          const handleInputClick = (e) => {
            console.log(e.target.value);
            setClickModalEmpCode(original.cdEmp);
          };
          const handleDoubleClick = (e) => {
            console.log("모달안 테이블 안에 더블 클릭 발생");
            console.log(original.cdEmp);
            setClickModalEmpCode(original.cdEmp);
            closeModalAndEmpInsert2(original.cdEmp);
          };
          return (
            <Input
              value={original?.noResident || ""}
              onClick={handleInputClick}
              className={"doubleLine"}
              onDoubleClick={handleDoubleClick}
            />
          );
        },
      },
    ],
    [modalEmpList],
  );

  const enterPress = (e) => {
    if (e.key === "Enter" || e.key === "Tab") {
      inputOnBlur(e); // 'Enter' 키가 눌렸을 때 inputOnBlur 함수를 호출합니다.
    } else {
    }
  };

  // const [emailAlert, setEmailAlert] = React.useState(false); // 이메일 발송 confirm alert
  // const [emailSendAlert, setEmailSendAlert] = React.useState(false);  // 이메일 발송 성공 alert

  // // 이메일 관련 alret set 이벤트 핸들러
  // const handleEmailCloseAlert = () => {
  //   setEmailAlert(false);
  // };
  // const handleEmailOpenAlert = () => { // 메일보내기 Button event Handler
  //   setEmailAlert(true);
  // };

  // const handleEmailConfirm = () => {
  //   if (checkColumn.length > 0) {
  //     const sendResult = handleSendEmail();
  //     console.log(sendResult);
  //     setCheckColumn([]);
  //   }
  //   handleEmailCloseAlert();
  //   setCheckColumn([]);
  // };

  // const handleEmailSendCloseAlert = () => {
  //   setEmailSendAlert(false);
  // };
  // const handleEmailSendOpenAlert = () => {
  //   setEmailSendAlert(true);
  // };

  // const handleEmailSendConfirm = () => {
  //   handleEmailSendCloseAlert();
  // };

  // const handleSendEmail = async () => {
  //   let sendResult = 0;
  //   try {
  //     // checkColumn을 기반으로 employeeData 필터링
  //     const selectedEmployees = employeeData.filter(emp => checkColumn.includes(emp.cdEmp));

  //     // 각 직원 데이터와 paramGetEmpList1을 조합
  //     const emailData = selectedEmployees.map(emp => ({
  //       cdEmp: emp.cdEmp,
  //       nmEmp: emp.nmEmp,
  //       noResident: emp.noResident,
  //       ...paramGetEmpList1,
  //     }));

  //     // API 요청
  //     const responseData = await apiRequest({
  //       method: "POST",
  //       url: "/api2/util/workContractEmail",
  //       data: {
  //         emailDataList: emailData,

  //       },
  //     });

  //     sendResult = responseData.sendResult;
  //     if (sendResult > 0) {
  //       handleEmailSendOpenAlert();
  //     }
  //   } catch (error) {
  //     console.error("Failed to fetch emp data:", error);
  //   }
  //   return sendResult;
  // };

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
            />

            <SearchBarBox
              label="정렬"
              id="wc-order"
              options={[
                { value: "1", label: "사원코드 순" },
                { value: "2", label: "사원이름 순" },
              ]}
              defaultValue="1"
              onChange={searchOrderOption}
            />
          </div>
        </div>
      </div>

      {/* 섹션 */}
      <section className="section wcSection">
        {/* 1번째 그리드 */}
        <div className="wcGrid">
          {/* 데이터 테이블 */}
          <div className="wclistArea">
            <div className="namePickerBox">
              <Table
                columns={columns}
                data={data}
                insertRow={true} //table 추가하기 on of
                showInsertRow={showInsertRow}
                setShowInsertRow={setShowInsertRow}
              />
            </div>
            {/* 두번째 테이블 사원 표시 */}
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

        {/* 두번째 그리드 */}

        <div className="wcGrid2 ">
          <div className="borderbuttonBoldBlack">
            <h1 className="wcRightHead">근로계약서</h1>
          </div>
          {/* 탭 내용 테이블 */}
          <div className="wcScroll">
            <table>
              <tbody className="">
                <tr>
                  <th className="wcHeaderStyle"> 근로계약기간 </th>
                  <td className="wcCellStyle">
                    <CustomCalendar
                      width="180"
                      id={"dtStartCont"}
                      value={paramGetEmpList1.dtStartCont}
                      onChange={contractPeriodCalendar1}
                      readOnly
                    />
                  </td>
                  <td className="wcCellStyle">
                    <CustomCalendar
                      width="180"
                      id={"dtEndCont"}
                      value={paramGetEmpList1.dtEndCont}
                      onChange={contractPeriodCalendar2}
                      readOnly
                    />
                  </td>
                </tr>
                <tr>
                  <th className="wcHeaderStyle">근무장소 </th>
                  <td className="wcCellStyle">
                    <CustomInput
                      placeholder={" 주소검색을 눌러주세요 "}
                      value={paramGetEmpList1.noWorkPost || ""}
                      id={"noWorkPost"}
                      readOnly
                      onChange={inputOnChange}
                      width={180}
                      onBlur={inputOnBlur}
                    />
                  </td>
                  <td className="wcCellStyle">
                    <CustomInput
                      width={415}
                      id={"addrWork"}
                      onChange={inputOnChange}
                      value={paramGetEmpList1.addrWork || ""}
                      readOnly
                      onBlur={inputOnBlur}
                    />

                    <CustomButton
                      className="wcRightCellSearchButton"
                      text="주소검색"
                      color="black"
                      onClick={addrButtonClick}
                    />
                  </td>

                  <td className="wcCellStyle"></td>
                </tr>
                <tr>
                  <th className="wcHeaderStyle">상세주소 </th>
                  <td className="wcCellStyle" colSpan="2">
                    <CustomInput
                      width={638}
                      value={paramGetEmpList1.addrWorkDtl || ""}
                      id={"addrWorkDtl"}
                      onChange={inputOnChange}
                      onBlur={inputOnBlur}
                      maxLength="100"
                      placeholder={"ex) 더존 APT 1동 101호 "}
                      onKeyDown={enterPress}
                    />
                  </td>
                </tr>
                <tr>
                  <th className="wcHeaderStyle">업무의 내용 </th>

                  <td className="wcCellStyle" colSpan="2">
                    <CustomInput
                      width="638"
                      value={paramGetEmpList1.cntnJob || ""}
                      id={"cntnJob"}
                      onChange={inputOnChange}
                      onKeyDown={enterPress}
                      onBlur={inputOnBlur}
                      maxLength="100"
                      placeholder={"ex) Platform 부서 refactoring 업무 "}
                    />
                  </td>
                </tr>

                <tr>
                  <th className="wcHeaderStyle">소정근로시간 </th>
                  <td className="wcCellStyle">
                    <CustomInput
                      value={paramGetEmpList1.tmStartRegularWork || ""}
                      id={"tmStartRegularWork"}
                      onChange={inputOnChange}
                      onKeyDown={enterPress}
                      maxLength="4"
                      placeholder={"ex) 0900 "}
                      width={180}
                      onBlur={inputOnBlur}
                    ></CustomInput>
                  </td>
                  <td className="wcCellStyle">
                    <CustomInput
                      value={paramGetEmpList1.tmEndRegularWork || ""}
                      id={"tmEndRegularWork"}
                      onChange={inputOnChange}
                      onKeyDown={enterPress}
                      maxLength="4"
                      placeholder={"ex) 1800 "}
                      onBlur={inputOnBlur}
                    ></CustomInput>
                  </td>
                </tr>
                <tr>
                  <th className="wcHeaderStyle">휴게시간 </th>
                  <td className="wcCellStyle">
                    <CustomInput
                      value={paramGetEmpList1.tmStartBreak || ""}
                      id={"tmStartBreak"}
                      onChange={inputOnChange}
                      onKeyDown={enterPress}
                      onBlur={inputOnBlur}
                      maxLength="4"
                      placeholder={"ex) 1200 "}
                      width={180}
                    ></CustomInput>
                  </td>

                  <td className="wcCellStyle">
                    <CustomInput
                      value={paramGetEmpList1.tmEndBreak || ""}
                      id={"tmEndBreak"}
                      placeholder={"ex) 1300 "}
                      onChange={inputOnChange}
                      onKeyDown={enterPress}
                      onBlur={inputOnBlur}
                      maxLength="4"
                    ></CustomInput>
                  </td>
                </tr>
                <tr>
                  <th className="wcHeaderStyle">근무일 </th>
                  <td className="wcCellStyle">
                    <CustomSelect
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
                      value={paramGetEmpList1.ddWorking || "0"}
                      id={"ddWorking"}
                      onChange={inputOnChange}
                      className={"wcSelect1"}
                    />
                  </td>
                  <td className="wcCellStyle"></td>
                </tr>
                <tr>
                  <th className="wcHeaderStyle">주휴일 </th>
                  <td className="wcCellStyle">
                    <CustomSelect
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
                      value={paramGetEmpList1.dotw || "0"}
                      id={"dotw"}
                      onChange={inputOnChange}
                      className={"wcSelect1"}
                    />
                  </td>
                  <td className="wcCellStyle"></td>
                </tr>
                <tr>
                  <th className="wcHeaderStyle">임금유형 </th>
                  <td className="wcCellStyle">
                    <CustomSelect
                      options={[
                        { value: "0", label: " 미작성 " },
                        { value: "1", label: " 월급 " },
                        { value: "2", label: " 일급 " },
                        { value: "3", label: " 시급 " },
                      ]}
                      value={paramGetEmpList1.tpSal || "0"}
                      id={"tpSal"}
                      onChange={inputOnChange}
                      className={"wcSelect2"}
                    />
                  </td>
                  <td className="wcCellStyle">
                    <CustomInput
                      className={"wcSelect2"}
                      value={paramGetEmpList1.amtSal || ""}
                      id={"amtSal"}
                      onChange={inputOnChange}
                      onKeyDown={enterPress}
                      onBlur={inputOnBlur}
                      maxLength="11"
                      placeholder={"ex) 10000000"}
                      type={"number"}
                    />
                    <b> 원 </b>
                  </td>
                </tr>
                <tr>
                  <th className="wcHeaderStyle">임금지급일 </th>
                  <td className="wcCellStyle">
                    <CustomSelect
                      options={[
                        { value: "0", label: " 미작성 " },
                        { value: "1", label: " 매월 " },
                      ]}
                      value={paramGetEmpList1.tpPayDtSal || "0"}
                      className={"wcSelect2"}
                      id={"tpPayDtSal"}
                      onChange={inputOnChange}
                    />
                  </td>

                  <td className="wcCellStyle">
                    <CustomInput
                      value={paramGetEmpList1.ddPaySal || ""}
                      id={"ddPaySal"}
                      onChange={inputOnChange}
                      onKeyDown={enterPress}
                      onBlur={inputOnBlur}
                      maxLength="2"
                      className={`wcSelect2 ${
                        payState === "off" ? "wcPayDayOff" : ""
                      } `}
                      placeholder={"ex) 17"}
                      type={"number"}
                    />
                    <b
                      className={`${payState === "off" ? "wcPayDayOff" : ""} `}
                    >
                      {" "}
                      일{" "}
                    </b>
                  </td>
                </tr>
                <tr>
                  <th className="wcHeaderStyle">지급방법 </th>
                  <td className="wcCellStyle">
                    <CustomSelect
                      options={[
                        { value: "0", label: " 미작성 " },
                        { value: "1", label: " 예금통장에 입금 " },
                        { value: "2", label: " 직접지급 " },
                      ]}
                      value={paramGetEmpList1.methodPay || "0"}
                      id={`methodPay`}
                      onChange={inputOnChange}
                      className="wcSelect3"
                    />
                  </td>
                  <td className="wcCellStyle"></td>
                </tr>
                <tr>
                  <th className="wcHeaderStyle"> 고용보험 </th>
                  <td className="wcCellStyle">
                    <CustomSelect
                      options={[
                        { value: "0", label: " 미작성 " },
                        { value: "1", label: " 여 " },
                        { value: "2", label: " 부 " },
                      ]}
                      value={paramGetEmpList1.ynEmpInsurance || "0"}
                      id={"ynEmpInsurance"}
                      onChange={inputOnChange}
                      className="wcSelect3"
                    />
                  </td>
                  <td className="wcCellStyle"></td>
                </tr>
                <tr>
                  <th className="wcHeaderStyle"> 산재보험 </th>
                  <td className="wcCellStyle">
                    <CustomSelect
                      options={[
                        { value: "0", label: " 미작성 " },
                        { value: "1", label: " 여 " },
                        { value: "2", label: " 부 " },
                      ]}
                      value={
                        paramGetEmpList1.ynIndustrialAccidentInsurance || "0"
                      }
                      id={"ynIndustrialAccidentInsurance"}
                      onChange={inputOnChange}
                      className="wcSelect3"
                    />
                  </td>
                  <td className="wcRightGridTableRightTd2"></td>
                </tr>
                <tr>
                  <th className="wcHeaderStyle"> 국민연금 </th>
                  <td className="wcCellStyle">
                    <CustomSelect
                      options={[
                        { value: "0", label: " 미작성 " },
                        { value: "1", label: " 여 " },
                        { value: "2", label: " 부 " },
                      ]}
                      value={paramGetEmpList1.ynNationalPension || "0"}
                      id={"ynNationalPension"}
                      onChange={inputOnChange}
                      className="wcSelect3"
                    />
                  </td>
                  <td className="wcCellStyle"></td>
                </tr>
                <tr>
                  <th className="wcHeaderStyle"> 건강보험 </th>
                  <td className="wcCellStyle">
                    <CustomSelect
                      options={[
                        { value: "0", label: " 미작성 " },
                        { value: "1", label: " 여 " },
                        { value: "2", label: " 부 " },
                      ]}
                      value={paramGetEmpList1.ynHealthInsurance || "0"}
                      id={"ynHealthInsurance"}
                      onChange={inputOnChange}
                      className="wcSelect3"
                    />
                  </td>
                  <td className="wcCellStyle"></td>
                </tr>
                <tr>
                  <th className="wcHeaderStyle"> 서명여부 </th>
                  <td className="wcCellStyle">
                    <CustomSelect
                      options={[
                        { value: "0", label: " 미작성 " },
                        { value: "1", label: " 여 " },
                        { value: "2", label: " 부 " },
                      ]}
                      value={paramGetEmpList1.stSign || "0"}
                      id={"stSign"}
                      onChange={inputOnChange}
                      className="wcSelect3"
                    />
                  </td>
                  <td className="wcCellStyle"></td>
                </tr>
                <tr>
                  <th className="wcHeaderStyle">작성일자 </th>
                  <td className="wcCellStyle">
                    <CustomCalendar
                      width="180"
                      id="createDate"
                      value={paramGetEmpList1.dtCreated || ""}
                      readOnly
                      name={"dtCreated"}
                      onChange={contractPeriodCalendar3}
                      position="up"
                    />
                  </td>
                  <td className="wcCellStyle"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {openPostcode && (
        <div className="wcModal1" onClick={closeModal}>
          <div className="wcModal2" onClick={(e) => e.stopPropagation()}>
            <DaumPostcode
              style={{ height: "100%" }}
              onComplete={handleAddressSelect}
              autoClose={false}
            />
          </div>
        </div>
      )}

      <CustomModal
        isOpen={modalIsOpen2}
        onRequestClose={closeModal2}
        overlayStyle={{
          backgroundColor: "rgba(0, 0, 0, 0.5)", // overlay의 배경색을 변경합니다.
        }}
        contentStyle={{
          backgroundColor: "white", // content의 배경색을 lightblue로 변경합니다.
          border: "1px solid gray", // content의 테두리 스타일을 변경합니다.
          padding: "20px", // content 내부에 패딩을 추가합니다.
          width: "1000px",
          height: "600px",
        }}
      >
        <PageHeaderName text="추가목록" />
        <div className="test2">
          <Table
            columns={columnsModal}
            data={dataModalEmpList}
            height="400px"
          />
        </div>
        {/* 모달 조건 검색 */}
        <div className="wcMordalContainer">
          <CustomInput
            placeholder={"ex)무엇이든 입력하세요"}
            onChange={modalSearch}
            width={500}
            className={"wcModalInput"}
          />
        </div>
        <div className="test">
          <CustomButton
            backgroundColor={"var(--color-primary-blue)"}
            color={"var(--color-primary-white)"}
            onClick={closeModalAndEmpInsert}
            text={"추가하기"}
          />
          <CustomButton
            backgroundColor={"var(--color-primary-gray)"}
            color={"var(--color-primary-white)"}
            onClick={closeModal2}
            text={"취소"}
          />
        </div>
      </CustomModal>

      {/* 공통 sweetalert  */}
      {showAlert && (
        <SweetAlert
          text=" 계약기간을 정확하게  입력해주세요. "
          //type="success"
          type="warning"
          //type="error"
          //type="question"
          onConfirm={() => {
            setShowAlert(false);
          }}
        />
      )}

      {showAlert2 && (
        <SweetAlert
          text=" 계약기간을 정확하게  입력해주세요. "
          // showCancel={true}
          //type="success"
          type="warning"
          //type="error"
          //type="question"
          onConfirm={() => {
            setShowAlert2(false);
          }}
        />
      )}

      {showAlert3 && (
        <SweetAlert
          text="시간은 4자리로 작성해야 합니다."
          // showCancel={true}
          //type="success"
          type="warning"
          //type="error"
          //type="question"
          onConfirm={() => {
            setShowAlert3(false);
          }}
        />
      )}

      {showAlert4 && (
        <SweetAlert
          text="59분을 초과할 수 없습니다."
          // showCancel={true}
          //type="success"
          type="warning"
          //type="error"
          //type="question"
          onConfirm={() => {
            setShowAlert4(false);
          }}
        />
      )}

      {showAlert5 && (
        <SweetAlert
          text="종료시간은 시작시간보다 빠를 수 없습니다."
          // showCancel={true}
          //type="success"
          type="warning"
          //type="error"
          //type="question"
          onConfirm={() => {
            setShowAlert5(false);
          }}
        />
      )}

      {showAlert6 && (
        <SweetAlert
          text="종료시간은 시작시간보다 빠를 수 없습니다."
          // showCancel={true}
          //type="success"
          type="warning"
          //type="error"
          //type="question"
          onConfirm={() => {
            setShowAlert6(false);
          }}
        />
      )}

      {showAlert7 && (
        <SweetAlert
          text="휴식시간은 근무시간 범위에 있어야 합니다."
          // showCancel={true}
          //type="success"
          type="warning"
          //type="error"
          //type="question"
          onConfirm={() => {
            setShowAlert7(false);
          }}
        />
      )}

      {showAlert8 && (
        <SweetAlert
          text="특수문자는 입력하실 수 없습니다."
          // showCancel={true}
          //type="success"
          type="warning"
          //type="error"
          //type="question"
          onConfirm={() => {
            setShowAlert8(false);
          }}
        />
      )}
    </>
  );
};

export default WorkContractCreate;
