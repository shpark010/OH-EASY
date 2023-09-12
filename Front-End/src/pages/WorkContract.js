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

const WorkContract = () => {


  const [tabState,setTab] = useState("wcCreate");

  const tabClick = (tabState) =>{
    setTab(tabState)
  };

  const tabComponent = () =>{
    console.log(tabState)

    switch(tabState){
      case "wcCreate" :
        return (<WorkContractCreate />);
      
      case "wcSelect" :
        return <WorkContractSelect />;

      default : 
      return null;

    }
    
  };

//   const tab = [
//     { id: "wcCreate", label: "계약서 작성", component: WorkContractCreate },
//     { id: "wcSelect", label: "계약서 조회", component: WorkContractSelect },

// ]

    
    return (
      
      <>

        <div className="pageHeader">
          <div className="innerBox fxSpace">
            <h2 className="pageHeaderName">표준근로계약서</h2>
            <div className="fxAlignCenter">
              <div className="btnWrapper textBtnWrap">
              <PageHeaderTextButton text="사원 불러오기" onClick={" "} />
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
          className={`wcTab1 ${tabState === "wcCreate" ? "on" : ""}`}
          onClick={ () => tabClick("wcCreate")}> 계약서 작성</button>  

          <button 
          className={`wcTab2 ${tabState === "wcSelect" ? "on" : ""}`} 
          onClick={ ()=>tabClick("wcSelect")} > 계약서 조회</button>
        </div> 
        
        {/* <ul className="pageTab">
                {tab.map((tab) => (
                  <li
                    key={tab.id}
                    className={tabState === tab.id ? "on" : ""}
                    onClick={() => tabComponent(tab.id)}
                  >
                    {tab.label}
                  </li>
                ))}
              </ul> */}
        
         <div>{tabComponent()}</div> 
        
      </>
    );
  }
export default WorkContract;