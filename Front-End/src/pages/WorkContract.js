import React from 'react';
import { useState } from 'react';
import Delete from '../images/pages/common/delete.png';
import '../styles/css/pages/WorkContract.css';
import PageHeaderIconButton from '../components/PageHeader/PageHeaderIconButton';
import PageHeaderTextButton from '../components/PageHeader/PageHeaderTextButton';
import CustomCalendar from '../components/Contents/CustomCalendar';
import Input from '../components/Contents/Input';
import WorkContractCreate from '../components/WorkContract/WorkContractCreate';
import WorkContractSelect from '../components/WorkContract/WorkContractSelect';
import useApiRequest from '../components/Services/ApiRequest';
import PageHeaderName from '../components/PageHeader/PageHeaderName';

const WorkContract = () => {

  const apiRequest = useApiRequest();
  const [tabState,setTab] = useState("0");
  const [empList,setEmpList] = useState([]); //작성Tab state
  const [wcEmpList,setWcEmpList] = useState([]); //조회Tab state


  const tabClick = (tabState) =>{
    setTab(tabState)
    console.log({tabState})
  };

  const tabComponent = () =>{

    switch(tabState){
      case "0" :
        
        return (<WorkContractCreate empList={empList} />);
        // 계약서 작성 Tab Click
      
      case "1" :
        
        return <WorkContractSelect wcEmpList={wcEmpList}  />;
        // 계약서 조회 Tab Click

      default : 
      return null;

    }
    
  };


const getEmpList = async () => { 


  
  try {
    const responseData = await apiRequest({
      method: "GET",
      url: `/api2/wc/getEmpList?tabState=${tabState}`,
    });
    if(tabState==="0"){
      setEmpList(responseData);
      
    }
    else if(tabState==="1"){
      setWcEmpList(responseData);
      
    }
    
  } catch (error) {
    console.error("Failed to fetch emp data:", error);
  }


};


    
    return (
      
      <>

        <div className="pageHeader">
          <div className="innerBox fxSpace">
          <PageHeaderName text="표준근로계약서" />
            <div className="fxAlignCenter">
              <div className="btnWrapper textBtnWrap">
              <PageHeaderTextButton text="사원 불러오기" 
              onClick={getEmpList} />
                <PageHeaderTextButton text="전자서명 메일 보내기" onClick={""} />
              </div>
              <div className="iconBtnWrap">
                <PageHeaderIconButton btnName="delete" imageSrc={Delete} altText="삭제" />
              </div>
            </div>
          </div>
        </div>

    
         <div className='borderbuttonBold'>
          <button 
          className={`wcTab1 ${tabState === "0" ? "on" : ""}`}
          onClick={ () => tabClick("0")}> 계약서 작성
          </button>  

          <button 
          className={`wcTab2 ${tabState === "1" ? "on" : ""}`} 
          onClick={ ()=>tabClick("1")} > 계약서 조회
          </button>
        </div> 
        
        
         <div>{tabComponent()}</div> 
        
      </>
    );
  }
export default WorkContract;