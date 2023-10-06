import React from 'react';
import { useState } from 'react';
import Delete from '../images/pages/common/delete.png';
import Setting from "../images/pages/common/setting.png";
import Calc from "../images/pages/common/calc.png";
import Print from "../images/pages/common/print.png";
import useApiRequest from '../components/Services/ApiRequest';

import '../styles/css/pages/WorkContract.css';
import PageHeaderIconButton from '../components/PageHeader/PageHeaderIconButton';
import PageHeaderTextButton from '../components/PageHeader/PageHeaderTextButton';
import WorkContractCreate from '../components/WorkContract/WorkContractCreate';
import WorkContractSelect from '../components/WorkContract/WorkContractSelect';
import PageHeaderName from '../components/PageHeader/PageHeaderName';
import SweetAlert from "../components/Contents/SweetAlert";



const WorkContract = () => { 

  const apiRequest = useApiRequest();
  const [tabState,setTab] = useState("0");
  const [checkColumn,setCheckColumn] = useState([]);  //checkColumn 담는 배열
  const [employeeData, setEmployeeData] = useState([]);
  const [showAlert, setShowAlert] = React.useState(false); // sweetalret
  const [showAlert2, setShowAlert2] = React.useState(false); // sweetalret
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
  })
  const [highlightFirstRow, setHighlightFirstRow] = useState(true); //첫번째 행 표시를 위해
  const [clickCode,setClickCode] = useState("");
  const [showInsertRow, setShowInsertRow] = useState(false);

  const tabClick = (e,tabState) =>{
    
    setTab(e.target.value)
    setEmployeeData([]);  //tab전환시 table 초기화
  };

  const tabComponent = () =>{

    switch(tabState){
      case "0" :

        return (<WorkContractCreate  
          
          
          clickCode={clickCode}
          setClickCode={setClickCode}
          checkColumn={checkColumn}
          setCheckColumn = {setCheckColumn}
          handleCheckboxChange={handleCheckboxChange}  
          employeeData = {employeeData}
          setEmployeeData = {setEmployeeData}
          paramGetEmpList1 = {paramGetEmpList1}
          setParamGetEmpList1 = {setParamGetEmpList1}
          highlightFirstRow = {highlightFirstRow}
          setHighlightFirstRow = {setHighlightFirstRow}
          showInsertRow = {showInsertRow}
          setShowInsertRow = {setShowInsertRow}
          />);

        // 계약서 작성 Tab Click
      case "1" :
        return <WorkContractSelect />;
        // 계약서 조회 Tab Click
      default : 
      return null;

    }
    
  };

  const handleCheckboxChange = (e, code) => {
    console.log("check 상태 변경 진입");
    if (e.target.checked) {
      
      setCheckColumn(prevState => [...prevState, code]); // 체크됐을 때 추가
    } else {
      
      setCheckColumn(prevState => prevState.filter(item => item !== code)); // 체크 해제됐을 때 제거
    }
  };


  const deleteEmp = async () => {

    
    console.log("삭제할 항목들:", checkColumn);

    try {
        const responseData = await apiRequest({
            method: "DELETE",
            url: `/api2/wc/deleteEmpList`,
            data: checkColumn,  // checkColumn 배열을 직접 전송a
        });

        
        //삭제 후 empList 초기화 하는데 2가지 방법 1. 전체API 불러오기, 2. Frontend에서 해결하기.
        const updatedEmpList = employeeData.filter(emp => !checkColumn.includes(emp.cdEmp));
        setEmployeeData(updatedEmpList);
        const responseData2 = await apiRequest({
          method: "GET",
          url: `/api2/wc/getCodeParamEmpList?code=${updatedEmpList[0].cdEmp}`, 
      });
        // 요청이 성공적으로 수행되었다면 checkColumn 상태를 초기화
        setCheckColumn([]);
        setParamGetEmpList1(responseData2); // delete후 맨위의 사원 data 가져오기 위해
        setHighlightFirstRow(true);
        setClickCode();
        setShowInsertRow(false);

    } 
    catch (error) {
        console.error("Failed to delete emp data:", error);
    }
};

  
const handleDeleteClick = () => {
  if (checkColumn.length === 0) {
    alert("삭제할 사원을 선택해주세요!");
  } else {
    setShowAlert(true);
  }
};

const [emailAlert, setEmailAlert] = React.useState(false); // 이메일 발송 confirm alert
  const [emailSendAlert, setEmailSendAlert] = React.useState(false);  // 이메일 발송 성공 alert
  const [emailSendAlert2, setEmailSendAlert2] = React.useState(false);  // 이메일 발송 성공 alert


  // 이메일 관련 alret set 이벤트 핸들러
  const handleEmailCloseAlert = () => {
    setEmailAlert(false); 
  };
  const handleEmailOpenAlert = () => { // 메일보내기 Button event Handler
    setEmailAlert(true);
  };

  const handleEmailConfirm = () => {
    if (checkColumn.length > 0) {
      const sendResult = handleSendEmail();
      console.log(sendResult);
      setCheckColumn([]);
    }
    handleEmailCloseAlert();
    setCheckColumn([]);
  };

  const handleEmailSendCloseAlert = () => {
    setEmailSendAlert(false); 
  };
  const handleEmailSendOpenAlert = () => {
    setEmailSendAlert(true); 
  };

  const handleEmailSendConfirm = () => {
    handleEmailSendCloseAlert();
  };

const handleSendEmail = async () => {
  let sendResult = 0;
  try {
    // checkColumn을 기반으로 employeeData 필터링
    const selectedEmployees = employeeData.filter(emp => checkColumn.includes(emp.cdEmp));

    // 각 직원 데이터와 paramGetEmpList1을 조합
    const emailData = selectedEmployees.map(emp => ({
      cdEmp: emp.cdEmp,
      nmEmp: emp.nmEmp,
      // noResident: emp.noResident,
      
    }));

    // API 요청
    const responseData = await apiRequest({
      method: "POST",
      url: "/api2/util/workContractEmail",
      data: {
        emailDataList: emailData,
      },
    });
    console.log(responseData);
  
    if (responseData === "Emails sent successfully") {
      handleEmailSendOpenAlert();
    } else {
      setEmailSendAlert2(false);
    }
  } catch (error) {
    console.error("Failed to fetch emp data:", error);
  }
  return;
};

    
    return (
      
      <>

        <div className="pageHeader">
          <div className="innerBox fxSpace">
          <PageHeaderName text="표준근로계약서" />
            <div className="fxAlignCenter">
              <div className="btnWrapper textBtnWrap">
                {/* <PageHeaderTextButton text="PDF로 저장하기" onClick={""} />*/}
                <PageHeaderTextButton 
    text="전자서명 메일 보내기" 
    onClick={() => {
        if (checkColumn.length === 0) {
            // 체크된 사원이 없으면 emailAlert를 true로 설정하여 경고 알림을 보여줍니다.
            setEmailAlert(true);
        } else {            
            setEmailAlert(true);  // 이 경우에도 emailAlert를 true로 설정하여 질문 형태의 알림을 보여줍니다.
        }
    }}
/>
              </div>
              <div className="iconBtnWrap">
              <PageHeaderIconButton
                btnName="print wcMouseOver" //mouseover시 x
                imageSrc={Print}
                altText="프린트"
              />
              <PageHeaderIconButton
                btnName="delete "
                imageSrc={Delete}
                altText="삭제"
                onClick={ () => {
                  if (checkColumn.length === 0) {
                    setShowAlert2(true);
                  } else {
                    setShowAlert(true);
                  }
                }}               
              />
              <PageHeaderIconButton
                btnName="calc wcMouseOver"
                imageSrc={Calc}
                altText="계산기"
              />
              <PageHeaderIconButton
                btnName="setting wcMouseOver"
                imageSrc={Setting}
                altText="세팅"
              />

              
            </div>
            </div>
          </div>
        </div>

    
         <div className='borderbuttonBold'>
          <button 
          className={`wcTab1 ${tabState === "0" ? "wcOn" : ""}`}
          onClick={tabClick}
          value={0}> 계약서 작성
          </button>  

          <button 
          className={`wcTab2 ${tabState === "1" ? "wcOn" : ""}`} 
          onClick={ tabClick} 
          value={1}> 계약서 조회
          </button>
        </div> 
        
        
         <div>{tabComponent()}</div> 

         {showAlert && (
        <SweetAlert
          text="정말 삭제하시겠습니까?"
          showCancel={true}
          //type="success"
          type="warning"
          //type="error"
          //type="question"
          onConfirm={() => {
            deleteEmp()
            setShowAlert(false)
          }}
          onCancel={()=>setShowAlert(false)}
        />
      )}

        {showAlert2 && (
        <SweetAlert
          text="삭제할 사원을 선택해 주세요."
          // showCancel={true}
          //type="success"
          type="warning"
          //type="error"
          //type="question"
          onConfirm={() => {
            setShowAlert2(false)
          }}
          onCancel={()=>setShowAlert2(false)}
        />
          )}

{emailAlert && (
        <SweetAlert
        text={
            checkColumn.length > 0
            ? `선택한 ${checkColumn.length}명의 사원에게 변경한 급여메일을 발송하시겠습니까?`
            : "체크된 사원이 없습니다. 사원을 체크하시고 다시 시도해 주세요"
        }
        type={checkColumn.length > 0 ? "question" : "warning"}
        showCancel={checkColumn.length > 0} // 이 부분을 수정하여 조건에 따라 취소 버튼을 표시
        onConfirm={handleEmailConfirm}
        onCancel={handleEmailCloseAlert}
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
      
      {emailSendAlert2 && (
        <SweetAlert
          text={"메일 발송에 실패했습니다."}
          type="fail"
          onConfirm={handleEmailSendConfirm}
          showCancel={false}
          confirmText="확인"
        />
      )}
        
      </>
    );
  }
export default WorkContract;