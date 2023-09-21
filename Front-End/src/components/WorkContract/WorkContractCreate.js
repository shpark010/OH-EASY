import React,{ useState, useMemo, useEffect }  from 'react';
import '../../styles/css/pages/WorkContract.css';
import CustomCalendar from '../../components/Contents/CustomCalendar';
import CustomInput from '../../components/Contents/CustomInput';
import CustomButton from '../../components/Contents/CustomButton';
import SearchBarBox from '../../components/SearchBar/SearchBarBox';
import Table from '../../components/TablesLib/Table';
import Input from '../Contents/Input';
import DaumPostcode from 'react-daum-postcode';
import SearchSubmitButton from '../SearchBar/SearchSubmitButton';
import useApiRequest from '../Services/ApiRequest';
import CustomModal from '../../components/Contents/CustomModal';
import PageHeaderName from "../../components/PageHeader/PageHeaderName";




const WorkContractCreate = () => {

  const apiRequest = useApiRequest();
  const [employeeData, setEmployeeData] = useState([]); //왼쪽table사원 data
  const [openPostcode, setOpenPostcode] = useState(false); // 주소모달 상태
  const [zonecode, setZonecode] = useState("");
  const [address, setAddress] = useState("");
  const [checkColumn,setCheckColumn] = useState([]); 
  const [isChecked, setIsChecked] = useState(false); // checked 상태 관리
  const [belongingDate, setBelongingDate] = useState(""); //조건조회시 년월 달력 상태 관리.
  const [searchOrder,setSearchOrder] = useState("1"); // 정렬 방법 관리 State
  const [paramGetEmpList1,setParamGetEmpList1] = useState({
    dtStartCont: '',
    dtEndCont: '',
    noWorkPost: '',
    addrWork: '',
    addrWorkDtl: '',
    cntnJob: '',
    tmStartRegularWork: '',
    tmEndRegularWork: '',
    tmStartBreak: '',
    tmEndBreak: '',
    ddWorking: '',
    dotw: '',
    tpSal: '',
    amtSal: '',
    tpPayDtSal: '',
    ddPaySal: '',
    methodPay: '',
    ynEmpInsurance: '',
    ynIndustrialAccidentInsurance: '',
    ynNationalPension: '',
    ynHealthInsurance: '',
    stSign: '',
    dtCreated: '',
  }) // 오른쪽 table 상태관리
  const [clickCode,setClickCode] = useState(""); //code click시 값을 저장할 state
  const [showInsertRow, setShowInsertRow] = useState(false); // 테이블의 insertRow의 상태
  const [modalEmpList, setModalEmpList] = useState([]); // 모달창에 넣을 사원 정보
  const [modalIsOpen2, setModalIsOpen2] = useState(false); // 추가 모달 on off 상태
  const [clickModalEmpCode, setClickModalEmpCode] = useState(null); // 현재 클릭한 cdEmp 저장하는 상태



  
  const contractPeriodCalendar1 = async(newDate,e) => {

    

    newDate = newDate.replace(/-/g, "");
    const cdEmp = clickCode
    const data = newDate
    const colum = "dtStartCont"
    if (cdEmp == null || cdEmp === "" || cdEmp === undefined || data === "") {
      return;
    }
    console.log(cdEmp);
    console.log(data);
    console.log(colum);

    setParamGetEmpList1({ ...paramGetEmpList1, dtStartCont: data })

    try {
      const responseData = await apiRequest({
        method: "PUT",
        url: `/api2/wc/updateEmpList?cdEmp=${cdEmp}&colum=${colum}&data=${data}`,
      });
    } 
    catch (error) {
      console.error("Failed to fetch emp data:", error);
    }
    
  }// 이벤트를 동시에 받은다음에 값이 더작은걸 1에할당 더큰것을 2에할당. e로 식별불가.
  
  const contractPeriodCalendar2 = async(newDate) => {

    newDate = newDate.replace(/-/g, "");
    const cdEmp = clickCode
    const data = newDate
    const colum = "dtEndCont"
    if (cdEmp == null || cdEmp === "" || cdEmp === undefined || data === "") {
      return;
    }
    console.log(cdEmp);
    console.log(data);
    console.log(colum);

    setParamGetEmpList1({ ...paramGetEmpList1, dtEndCont: data })

    try {
      const responseData = await apiRequest({
        method: "PUT",
        url: `/api2/wc/updateEmpList?cdEmp=${cdEmp}&colum=${colum}&data=${data}`,
      });
    } 
    catch (error) {
      console.error("Failed to fetch emp data:", error);
    }
    
  }

  const contractPeriodCalendar3 = async(newDate) => {
    newDate = newDate.replace(/-/g, "");
    const cdEmp = clickCode
    const data = newDate
    const colum = "dtCreated"
    if (cdEmp == null || cdEmp === "" || cdEmp === undefined || data === "") {
      return;
    }
    console.log(cdEmp);
    console.log(data);
    console.log(colum);

    setParamGetEmpList1({ ...paramGetEmpList1, dtCreated: data })

    try {
      const responseData = await apiRequest({
        method: "PUT",
        url: `/api2/wc/updateEmpList?cdEmp=${cdEmp}&colum=${colum}&data=${data}`,
      });
    } 
    catch (error) {
      console.error("Failed to fetch emp data:", error);
    }
    


  }


  
  const inputOnChange = (e) =>{
    const cdEmp = clickCode;
    const data = e.target.value;
    if (cdEmp == null || cdEmp === "" || cdEmp === undefined || data === "") {
      return;
    }
    console.log(e.target.id); //select box, input은 name, id 다 들어가니 id로 받으면됨.
    setParamGetEmpList1({...paramGetEmpList1,
    [e.target.id] : data
      })
  } // input tag에 변화가 발생했을때 상태를 복사하고 바뀐값만 변경하는 set함수 호출
  // 상태만 변경하는 함수.

  
  const inputOnBlur = async (e) =>{ //onBlur시 put 요청을 보낼 함수.
    
     const cdEmp = clickCode
     const colum = e.target.id
     const data = e.target.value
     if (cdEmp == null || cdEmp === "" || cdEmp === undefined || data === "") {
      return;
    }
     console.log(cdEmp);
     console.log(colum);
     console.log(data); //잘 가져옴.

     try {
      const responseData = await apiRequest({
        method: "PUT",
        url: `/api2/wc/updateEmpList?cdEmp=${cdEmp}&colum=${colum}&data=${data}`,
      });
    } 
    catch (error) {
      console.error("Failed to fetch emp data:", error);
    }

  }

  
  // const schangeCheck2 = (e, originalCode) => {
    //   const checkedValue = e.target.checked;
    
    //   if (checkedValue) {
      //     setCodeArr(prevCodeArr => [...prevCodeArr, originalCode]);
      //   } else {
        //     setCodeArr(prevCodeArr => prevCodeArr.filter(code => code !== originalCode));
        //   }
        // };
        // useEffect(() => {
          //   console.log("codeArr 변경됨:", codeArr);
          // }, [codeArr]); // codeArr이 변경될 때만 실행
          
          
          
      const handleBelongingDateChange = (newDate) => {
    newDate = newDate.replace(/-/g, "");
    setBelongingDate(newDate);
    console.log(belongingDate);//202310
       }; // 작성년월로 조건조회할 때 onchange이벤트시 호출할 함수.
  
  
  



 

  const dataModalEmpList = useMemo(
    () =>
      modalEmpList.map((emp) => ({
        cdEmp: emp.cdEmp,
        nmEmp: emp.nmEmp,
        noResident : emp.noResident,
      })),
    [modalEmpList],
  );

  // 모달창 닫으면 바로 사원 인서트
  const closeModalAndEmpInsert = async () => {
    closeModal2();


    try {
      const responseData = await apiRequest({
        method: "GET", //GET으로 가져와서 State set해주면됨.
        url: `/api2/wc/getModalData?cdEmp=${clickModalEmpCode}`,
      });
      //서버에서 넘어온 데이터
      // HRManagement.js:68 {cdEmp: 'CD046', nmEmp: '장영호'}
      //setEmpList(responseData);
      setShowInsertRow(false);
      console.log("서버에서 넘어온 데이터 ");
      console.log(responseData);
      setEmployeeData((prevEmployeeData) => [...prevEmployeeData, responseData]);
      setClickCode(clickModalEmpCode);
    } catch (error) {
      console.error("Failed to fetch emp data:", error);
    }





  };

  const handleAddressSelect = (addr) => {
    console.log(`
        우편번호: ${addr.zonecode}
        주소: ${addr.address}
    `);
    // // 주소와 우편번호 값을 가져온 데이터로 설정
    // const address = addr.address;
    // const zipcode = addr.zipcode;
  
    // // 상태를 업데이트하여 주소와 우편번호를 입력란에 설정
    // setEmpList((prevEmpList) => [
      //   ...prevEmpList,
      //   {
    //     // 이전 데이터 유지하고 주소와 우편번호 추가
    //     address: address, // 주소 상태 값 사용
    //     zipcode: zipcode, // 우편번호 상태 값 사용
    //   },
    // ]);
    setZonecode(addr.zonecode); // 선택된 우편번호로 우편번호 상태 업데이트
    setAddress(addr.address); // 선택된 주소로 주소 상태 업데이트
    setOpenPostcode(false); // 모달 닫기
  };
  

  const data = useMemo(
    () =>
    employeeData.map((emp) => ({
        checkbox: emp.checkbox,
        cdEmp: emp.cdEmp,
        nmEmp: emp.nmEmp,
        noResident: emp.noResident,
      })),
    [employeeData]
  );

  useEffect(() => {
    console.log("employeeData 변경됨:", employeeData);
  }, [employeeData]); //  변경될 때만 실행
  
  

  const selectAllCheckBox = (e) =>{

    
    // const newEmpList = empList.map(emp=>({
    //   checkbox : e.target.checked,
    //   cdEmp: emp.cdEmp,
    //   nmEmp: emp.nmEmp,
    //   noResident: emp.noResident,
    // }));
    // console.log(newEmpList);

    

    const allInputs = e.target.parentElement.parentElement.parentElement.parentElement.querySelectorAll('input');
  //   // 모든 Table까지 가서 모든 input tag select 하면 배열로 return
  //   console.log(e.target.checked); // 현재 누른 이벤트 check 값
    
    if (e.target.checked){
    allInputs.forEach(input => {
      input.checked = true;
    }); // 배열로 return 한 input tag checked 값 true 할당. 여기까지만 하면 상태변화가 감지되지 않음.
    setIsChecked(true)
    
  }

  else if (!e.target.checked){
    allInputs.forEach(input => {
      input.checked = false;
    }); // 배열로 return 한 input tag checked 값 true 할당. 여기까지만 하면 상태변화가 감지되지 않음.
    setIsChecked(false)
    console.log(isChecked);
  }
    //useRef 사용이 안됨. Ref가 모든 data를 순회하며 input tag에 걸려야 하는데 그게 안됨.
    
    
  }

  const conditionSearch = async () => { // 작성년월과 조회 날짜를 받아 조회하는 버튼
    setEmployeeData([]);
    
    console.log(belongingDate);
    try {
     
      const responseData = await apiRequest({
        method: "GET",
        url: `/api2/wc/getEmpList?creDate=${belongingDate}&orderValue=${searchOrder}`, //내 Table에서 가져올 것들, update 및 삭제용
      });
     
      setEmployeeData(responseData)
      console.log(employeeData);
    
    } catch (error) {
      console.error("Failed to fetch emp data:", error);
    }

    
  }//조건조회


  const searchOrderOption = (e) =>{
    setSearchOrder(e.target.value)
  } // 정렬 option button 변경시 호출하는 이벤트
  useEffect(() => {
    console.log(searchOrder);
  }, [searchOrder]); //codeArr이 변경될때만 실행.





  const handleInputClick = async(e) => { //왼쪽 Table 클릭시 호출되는 함수.
    // 1. parametr로 보낼 code state로 관리하기, 모든 cell에서 눌렀을때 code를 가져와야함. 
    // 2. e.target으로 찾기.
    // 어차피 e.target을 통해 찾아야 함.
    setParamGetEmpList1([]);
    const code = e.target.parentElement.parentElement.querySelector('td:nth-child(2) input');

    if(code.value){
    
    const param = code.value
    setClickCode(param);
    console.log(param); //잘가져옴
    try {
     
      const responseData = await apiRequest({
        method: "GET",
        url: `/api2/wc/getCodeParamEmpList?code=${param}`, 
      });
     
      setParamGetEmpList1(responseData) //code get emplist
  
      
    } catch (error) {
      console.error("Failed to fetch emp data:", error);
    }
  }
  else{
    console.log("**들어갑니까?**");
    openModal2(e);
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
  
  

  }; //왼쪽 Table 아무영역 눌렀을때 발생시킬 event 
  // 방법 1 : 조건조회할때 미리 다 가져와 뿌리기. 사람이 많아졌을때 고려하면 x
  // 방법 2 : 필요한 VO만 가져온후 왼쪽 Table 누를 경우 api 보내기

  useEffect(() => {
    console.log(paramGetEmpList1);
  }, [paramGetEmpList1]); // 변경될때만 실행. 가져온 VO확인용



  const addrButtonClick= () => {
    setOpenPostcode(true);
  }; //모달열기

  const closeModal = () =>{
    setOpenPostcode(false);
  }


  const openModal2 = () => {
    setModalIsOpen2(true);
  };

  const closeModal2 = () => {
    setModalIsOpen2(false);
  };
// 사원추가 모달 끄고 닫기.


  const columns = useMemo(
    () => [

      {
        Header:
        
          ()=>{

            

            return(
            <input 
          type='checkbox'
          
          onClick={selectAllCheckBox}
          />)
          }
        ,
        accessor: "checkbox",
        id: "checkbox",
        width:"10%",
        Cell: ({ cell: { value }, row :{original} }) =>{ 
          
         const getCodeArr = (e) =>{
           const codeValue = e.target.parentElement.parentElement.querySelector('td:nth-child(2) input');
          console.log(codeValue);


  
         }

          
        return(
          <>
        <input 
        type="checkbox"  
        onChange={getCodeArr}
        className = {"doubleLine"}
          />
        
        </>
        );
      
      }
      }
      ,
      {
        Header: "Code",
        accessor: "cdEmp",
        id: "cdEmp",
        width: "20%",
        Cell: ({ cell: { value }, row :{original} }) => {
          const [inputValue, setInputValue] = useState(value);
          const [modalApper,setModalApper] = useState("")
  


          const handleInputChange = (e) => {
            setInputValue(e.target.value);
          };

          // const handleInputClick = (e) => {
          //   // const ele = e.target.parentElement.parentElement.parentElement.querySelector('tr:nth-child(1)');
          //   // ele.style.backgroundColor = 'var(--color-secondary-blue)';
          // };

          const inputBlur = (e) => {
            // const ele = e.target.parentElement.parentElement.parentElement.querySelector('tr:nth-child(1)');
            //  ele.style.backgroundColor = '';
          }


          /*Code input에서 mouse 올라오면 state 변경하는 함수 */
          const mouseOverModalOn = ()=>{
            setModalApper("on");
          };

          /*Code input에서 mouse 나갈시 state 변경하는 함수*/ 
          const mouseOutModalOff = ()=>{
            setModalApper("off");
          };

          /*Code input에 code 도우미 render 함수*/ 
          const modalApperFunc = () =>{
            if(modalApper === "on"){
              return null;
            }
            else return null;

          };

          return (
            <Input
              value={inputValue}
              onClick={handleInputClick }
              onBlur={inputBlur}
              onChange={handleInputChange}
              onMouseOver={mouseOverModalOn}
              onMouseOut= {mouseOutModalOff}
              modalRender = {modalApperFunc}
              className = {"doubleLine"}
              
            
            />

          );

        },
      },
      {
        Header: "사원명",
        accessor: "nmEmp",
        id: "nmEmp",
        width: "20%",
        Cell: ({ cell: { value }, row :{original}  }) => {
          const [inputValue, setInputValue] = React.useState(value);
          

          // const handleInputClick = (e) => {
          //   // const ele = e.target.parentElement.parentElement.parentElement.querySelector('tr:nth-child(1)');
          //   //  ele.style.backgroundColor = 'var(--color-secondary-blue)';
        
          // }; // input tag Click시 발생할 event

          const inputBlur = (e) => {
            const ele = e.target.parentElement.parentElement.parentElement.querySelector('tr:nth-child(1)');
             ele.style.backgroundColor = '';
          }
      

          const handleInputChange = (e) => {
            setInputValue(e.target.value);
          };

          return (
            <Input
              value={inputValue}
              onClick={handleInputClick}
              onBlur={inputBlur}
              onChange={handleInputChange}
              className = {"doubleLine"}
              
              
            />
          );
        },
      },
      
      {
        Header: "주민번호",
        accessor: "noResident",
        id: "noResident",
        Cell: ({ cell: { value }, row :{original} } ) => {
          const [inputValue, setInputValue] = React.useState(value);

          // const handleInputClick = (e) => {
          //   // const ele = e.target.parentElement.parentElement.parentElement.querySelector('tr:nth-child(1)');
          //   // ele.style.backgroundColor = 'var(--color-secondary-blue)';
          // };

          const inputBlur = (e) => {
            const ele = e.target.parentElement.parentElement.parentElement.querySelector('tr:nth-child(1)');
             ele.style.backgroundColor = '';
          }

          const handleInputChange = (e) => {
            setInputValue(e.target.value);
          };

          return (
            <Input
              value={inputValue}
              onChange={handleInputChange}
              onClick={handleInputClick}
              onBlur={inputBlur}
              className ={"doubleLine"}
            />
          );
        },
      },
    ],
    []
  );
  const columnsModal = useMemo(
    () => [
      {
        Header: "사원코드",
        accessor: "cdEmp",
        width: "45%",
        id: "cdEmp",
        Cell: ({ cell: { value }, row: { original } }) => {
          const handleInputClick = (e) => {
            console.log(e.target.value);
            setClickModalEmpCode(original.cdEmp);
          };
          return (
            <Input
              value={original?.cdEmp || ""}
              onClick={handleInputClick}
              className={"doubleLine"}
            />
          );
        },
      },
      {
        Header: "사원명",
        accessor: "nmEmp",
        id: "nmEmp",
        Cell: ({ cell: { value }, row: { original } }) => {
          const handleInputClick = (e) => {
            console.log(e.target.value);
            setClickModalEmpCode(original.cdEmp);
          };
          return (
            <Input
              value={original?.nmEmp || ""}
              onClick={handleInputClick}
              className={"doubleLine"}
            />
          );
        },
      },
      {
        Header: "주민번호",
        accessor: "noResident",
        id: "noResident",
        Cell: ({ cell: { value }, row: { original } }) => {
          const handleInputClick = (e) => {
            console.log(e.target.value);
            setClickModalEmpCode(original.cdEmp);
          };
          return (
            <Input
              value={original?.noResident || ""}
              onClick={handleInputClick}
              className={"doubleLine"}
            />
          );
        },
      },
    ],
    [modalEmpList],
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
                  />
              
             
                

                <SearchBarBox
                  label="정렬"
                  id="wc-order"
                      options={[
                        { value: '1', label: '사원코드 순' },
                        { value: '2', label: '사원이름 순' },
                        
                      ]}
                      defaultValue="1"
                      onChange={searchOrderOption}
                      
                    />

             
            </div>
            <div className="btnWrapper">
            <SearchSubmitButton onClick={conditionSearch} text="조회" />
            </div>
          </div>
        </div>


        
        <section className="section">
          <div className="wcGridContainer">
            <div className="wcGridCellItem1">
            
              <Table
                columns={columns}
                data={data}   
                checkboxWidth={"10%"}
                insertRow={true}
                showInsertRow={showInsertRow}
                setShowInsertRow={setShowInsertRow}
              />

              <table className="wcBottomTable">
                <tr>
                  <th>조회된 사원</th>
                  <th>{data.length}명</th>
                </tr>
              </table>
            </div>

            <div className="wcGridCellItem2">
              <h1 className="wcRightHead">근로계약서</h1>
              <table className="wcRightGridTable">
                <tr>
                  <td className="wcRightGridTableLeftTd"> 근로계약기간  </td>
                  <td className="wcRightGridTableRightTd1">
                    <CustomCalendar 
                    width="180" 
                    id={"dtStartCont"}
                    value={paramGetEmpList1.dtStartCont}
                    onChange={contractPeriodCalendar1}
                    
                    
                     /> 
                  </td>
                  <td className="wcRightGridTableRightTd2">
                    <CustomCalendar 
                    width="180" 
                    id={"dtEndCont"}
                    value={paramGetEmpList1.dtEndCont}
                    onChange={contractPeriodCalendar2}

                    />
                  </td>
                </tr>
                <tr>
                  <td className="wcRightGridTableLeftTd">근무장소  </td>
                  <td className="wcRightGridTableRightTd1">
                    <CustomInput 
                    
                    value={paramGetEmpList1.noWorkPost}
                    id={"NO_WORK_POST"}

                     />
                  </td>
                  <td className="wcRightGridTableRightTd2">
                    <CustomInput 
                    width={415}
                    id={"ADDR_WORK"}

                    value={paramGetEmpList1.addrWork}
                    
                    />
                    <CustomButton
                      className="wcRightCellSearchButton"
                      text="주소검색"
                      color="black"
                      onClick={addrButtonClick}
                      
                    />
                  </td>

                  <td className="wcRightGridTableRightTd3">
                    
                  </td>
                </tr>
                <tr>
                  <td className="wcRightGridTableLeftTd">상세주소  </td>
                  <td className="wcRightGridTableRightTd1" colSpan="2">
                    <CustomInput 
                    width={605} 
                    value={paramGetEmpList1.addrWorkDtl}
                    id={"addrWorkDtl"}
                    onChange={inputOnChange}
                    onBlur={inputOnBlur}

                     />
                  </td>
                </tr>
                <tr>
                  <td className="wcRightGridTableLeftTd">업무의 내용 </td>

                  <td className="wcRightGridTableRightTd1" colSpan="2">
                    <CustomInput 
                    width="605"
                    value={paramGetEmpList1.cntnJob}
                    id={"cntnJob"}
                    onChange={inputOnChange}
                    onBlur={inputOnBlur}
                    maxlength="4"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="wcRightGridTableLeftTd">소정근로시간 </td>
                  <td className="wcRightGridTableRightTd1">
                    <CustomInput 
                    value={paramGetEmpList1.tmStartRegularWork}
                    id={"tmStartRegularWork"}
                    onChange={inputOnChange}
                    onBlur={inputOnBlur}
                    maxlength="4"
                    >
                      
                    </CustomInput>
                  </td>
                  <td className="wcRightGridTableRightTd2">
                    <CustomInput
                    value={paramGetEmpList1.tmEndRegularWork}
                    id={"tmEndRegularWork"}
                    name={"tmEndRegularWork"}
                    onChange={inputOnChange}
                    onBlur={inputOnBlur}
                    >
                    </CustomInput>

                  </td>
                </tr>
                <tr>
                  <td className="wcRightGridTableLeftTd">휴게시간 </td>
                  <td className="wcRightGridTableRightTd1">
                    <CustomInput
                     value={paramGetEmpList1.tmStartBreak}
                     id={"tmStartBreak"}
                    onChange={inputOnChange}
                    onBlur={inputOnBlur}
                    >

                    </CustomInput>
                  </td>

                  <td className="wcRightGridTableRightTd2">
                    <CustomInput
                     value={paramGetEmpList1.tmEndBreak}
                    id={"tmEndBreak"}
                     
                     onChange={inputOnChange}
                     onBlur={inputOnBlur}

                    ></CustomInput>
                  </td>
                </tr>
                <tr>
                  <td className="wcRightGridTableLeftTd">근무일  </td>
                  <td className="wcRightGridTableRightTd1">
                    <SearchBarBox
                      
                      options={[
                        { value: '1', label: '1주에 1일' },
                        { value: '2', label: '1주에 2일' },
                        { value: '3', label: '1주에 3일' },
                        { value: '4', label: '1주에 4일' },
                        { value: '5', label: '1주에 5일' },
                        { value: '6', label: '1주에 6일' },
                        { value: '7', label: '1주에 7일' },
                      ]}
                      value={paramGetEmpList1.ddWorking}
                      id={"ddWorking"}
                     
                     onChange={inputOnChange}
                     onBlur={inputOnBlur}
                      
                    />
                  </td>
                  <td className="wcRightFirstTableRightTd2"></td>
                </tr>
                <tr>
                  <td className="wcRightGridTableLeftTd">주휴일 </td>
                  <td className="wcRightGridTableRightTd1">
                    <SearchBarBox
                      options={[
                        { value: '1', label: '매주 월요일' },
                        { value: '2', label: '매주 화요일' },
                        { value: '3', label: '매주 수요일' },
                        { value: '4', label: '매주 목요일' },
                        { value: '5', label: '매주 금요일' },
                        { value: '6', label: '매주 토요일' },
                        { value: '7', label: '매주 일요일' },
                      ]}
                      value={paramGetEmpList1.dotw}

                      id={"dotw"}
                     onChange={inputOnChange}
                     onBlur={inputOnBlur}
                    />
                  </td>
                  <td className="wcRightFirstTableRightTd2"></td>
                </tr>
                <tr>
                  <td className="wcRightGridTableLeftTd">임금유형 </td>
                  <td className="wcRightGridTableRightTd1">
                    <SearchBarBox
                      options={[
                        { value: '1', label: ' 월급 ' },
                        { value: '2', label: ' 일급 ' },
                        { value: '3', label: ' 시급 ' },
                      ]}
                      value={paramGetEmpList1.tpSal}
                      className="searchBarBox2"

                      name={"tpSal"}
                     onChange={inputOnChange}
                     onBlur={inputOnBlur}
                    />
                  </td>
                  <td className="wcRightGridTableRightTd2">
                    <CustomInput 
                    width={100}
                    value={paramGetEmpList1.amtSal}
                    id ={"amtSal"}
                    
                    onChange={inputOnChange}
                    onBlur={inputOnBlur}

                     /> 
                    <b>원</b>
                  </td>
                </tr>
                <tr>
                  <td className="wcRightGridTableLeftTd">임금지급일 </td>
                  <td className="wcRightGridTableRightTd1">
                    <SearchBarBox
                      options={[
                        { value: '1', label: ' 매월 ' },
                        { value: '2', label: ' 매주 ' },
                        { value: '3', label: ' 매일 ' },
                      ]}
                      value={paramGetEmpList1.tpPayDtSal}
                      className="searchBarBox2"
                      id={"tpPayDtSal"}
                      
                    onChange={inputOnChange}
                    onBlur={inputOnBlur}

                    />
                  </td>
                  <td className="wcRightGridTableRightTd2">
                    <CustomInput 
                    width={40}
                    value={paramGetEmpList1.ddPaySal}
                    id ={"ddPaySal"}
                    
                    onChange={inputOnChange}
                    onBlur={inputOnBlur}

                    />
                    <b>일</b>
                  </td>
                </tr>
                <tr>
                  <td className="wcRightGridTableLeftTd">지급방법  </td>
                  <td className="wcRightGridTableRightTd1">
                    <SearchBarBox
                      options={[
                        { value: '1', label: ' 예금통장에 입금 ' },
                        { value: '2', label: ' 직접지급 ' },
                      ]}
                      value={paramGetEmpList1.methodPay}
                      id={`methodPay`}
                      
                      onChange={inputOnChange}
                     onBlur={inputOnBlur}

                    />
                  </td>
                  <td className="wcRightGridTableRightTd2"></td>
                </tr>
                <tr>
                  <td className="wcRightGridTableLeftTd"> 고용보험  </td>
                  <td className="wcRightGridTableRightTd1">
                    <SearchBarBox
                      options={[
                        { value: '1', label: ' 여 ' },
                        { value: '2', label: ' 부 ' },
                      ]}
                      value={paramGetEmpList1.ynEmpInsurance}
                      id={"ynEmpInsurance"}
                      
                      onChange={inputOnChange}
                     onBlur={inputOnBlur}

                      className="searchBarBox3"
                    />
                  </td>
                  <td className="wcRightGridTableRightTd2"></td>
                </tr>
                <tr>
                  <td className="wcRightGridTableLeftTd"> 산재보험  </td>
                  <td className="wcRightGridTableRightTd1">
                    <SearchBarBox
                      options={[
                        { value: '1', label: ' 여 ' },
                        { value: '2', label: ' 부 ' },
                      ]}
                      value={paramGetEmpList1.ynIndustrialAccidentInsurance}
                      id={"ynIndustrialAccidentInsurance"}
                    
                      onChange={inputOnChange}
                     onBlur={inputOnBlur}

                      className="searchBarBox3"
                    />
                  </td>
                  <td className="wcRightGridTableRightTd2"></td>
                </tr>
                <tr>
                  <td className="wcRightGridTableLeftTd"> 국민연금  </td>
                  <td className="wcRightGridTableRightTd1">
                    <SearchBarBox
                      options={[
                        { value: '1', label: ' 여 ' },
                        { value: '2', label: ' 부 ' },
                      ]}
                      value={paramGetEmpList1.ynNationalPension}
                      id={"ynNationalPension"}
                      
                      onChange={inputOnChange}
                     onBlur={inputOnBlur}

                      className="searchBarBox3"
                    />
                  </td>
                  <td className="wcRightFirstTableRightTd2"></td>
                </tr>
                <tr>
                  <td className="wcRightGridTableLeftTd"> 건강보험  </td>
                  <td className="wcRightGridTableRightTd1">
                    <SearchBarBox
                      options={[
                        { value: '1', label: ' 여 ' },
                        { value: '2', label: ' 부 ' },
                      ]}
                      value={paramGetEmpList1.ynHealthInsurance}
                      id={"ynHealthInsurance"}
                      
                      onChange={inputOnChange}
                     onBlur={inputOnBlur}

                      className="searchBarBox3"
                    />
                  </td>
                  <td className="wcRightFirstTableRightTd2"></td>
                </tr>
                <tr>
                  <td className="wcRightGridTableLeftTd"> 서명여부  </td>
                  <td className="wcRightGridTableRightTd1">
                    <SearchBarBox
                      options={[
                        { value: '1', label: ' 여 ' },
                        { value: '2', label: ' 부 ' },
                      ]}
                      value={paramGetEmpList1.stSign}
                      id={"stSign"}
                      
                      onChange={inputOnChange}
                     onBlur={inputOnBlur}

                      className="searchBarBox3"
                    />
                  </td>
                  <td className="wcRightFirstTableRightTd2"></td>
                </tr>
                <tr>
                  <td className="wcRightGridTableLeftTd">작성일자 </td>
                  <td className="wcRightGridTableRightTd1">
                    <CustomCalendar 
                    className={'wcCreatedDateCalander'} 
                    width="170" 
                    id="createDate"
                    value={paramGetEmpList1.dtCreated}

                    name={"dtCreated"}
                    onChange={contractPeriodCalendar3}
                     

                    />
                  </td>
                  <td className="wcRightGridTableRightTd2"></td>
                </tr>
                
              </table>
              
            </div>
          </div>

         {/* 모달 창 */}
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




        </section>

        <CustomModal
        isOpen={modalIsOpen2}
        onRequestClose={closeModal2}
        overlayStyle={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        contentStyle={{
          backgroundColor: "white",
          border: "1px solid gray",
        }}
      >
        <PageHeaderName text="추가목록" />
        <div className="test2">
          <Table columns={columnsModal} data={dataModalEmpList} />
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
      </>
    );
  }

export default WorkContractCreate;