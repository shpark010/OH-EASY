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




const WorkContract = () => { 

  const apiRequest = useApiRequest();
  const [tabState,setTab] = useState("0");
  const [checkColumn,setCheckColumn] = useState([]);  //checkColumn 담는 배열
  const [employeeData, setEmployeeData] = useState([]);

  const tabClick = (e,tabState) =>{
    
    setTab(e.target.value)
    
  
  };

  const tabComponent = () =>{

    switch(tabState){
      case "0" :

        return (<WorkContractCreate  
          // deleteEvent={deleteEmp} 
          checkColumn={checkColumn}
          setCheckColumn = {setCheckColumn}
          handleCheckboxChange={handleCheckboxChange}  
          employeeData = {employeeData}
          setEmployeeData = {setEmployeeData}
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
            data: checkColumn,  // checkColumn 배열을 직접 전송
        });

        //삭제 후 empList 초기화 하는데 2가지 방법 1. 전체API 불러오기, 2. Frontend에서 해결하기.
        const updatedEmpList = employeeData.filter(emp => !checkColumn.includes(emp.cdEmp));
        setEmployeeData(updatedEmpList);


        // 요청이 성공적으로 수행되었다면 checkColumn 상태를 초기화
        setCheckColumn([]);

        

    } 
    catch (error) {
        console.error("Failed to delete emp data:", error);
    }
};



    
    return (
      
      <>

        <div className="pageHeader">
          <div className="innerBox fxSpace">
          <PageHeaderName text="표준근로계약서" />
            <div className="fxAlignCenter">
              <div className="btnWrapper textBtnWrap">
                  
                <PageHeaderTextButton text="전자서명 메일 보내기" onClick={""} />
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
                onClick={deleteEmp}
                
              />
              <PageHeaderIconButton
                btnName="calc wcMouseOver"
                imageSrc={Calc}
                altText="계산기"
              />
              <PageHeaderIconButton
                btnName="setting "
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
        
      </>
    );
  }
export default WorkContract;