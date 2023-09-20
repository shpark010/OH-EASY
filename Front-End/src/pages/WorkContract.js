import React from 'react';
import { useState } from 'react';
import Delete from '../images/pages/common/delete.png';
import Setting from "../images/pages/common/setting.png";
import Calc from "../images/pages/common/calc.png";
import Print from "../images/pages/common/print.png";

import '../styles/css/pages/WorkContract.css';
import PageHeaderIconButton from '../components/PageHeader/PageHeaderIconButton';
import PageHeaderTextButton from '../components/PageHeader/PageHeaderTextButton';
import WorkContractCreate from '../components/WorkContract/WorkContractCreate';
import WorkContractSelect from '../components/WorkContract/WorkContractSelect';
import PageHeaderName from '../components/PageHeader/PageHeaderName';




const WorkContract = () => { 

  const [tabState,setTab] = useState("0");
  


  const tabClick = (e,tabState) =>{
    
    setTab(e.target.value)
    
  
  };

  const tabComponent = () =>{

    switch(tabState){
      case "0" :

        return (<WorkContractCreate />);

        // 계약서 작성 Tab Click
      case "1" :
        return <WorkContractSelect />;
        // 계약서 조회 Tab Click
      default : 
      return null;

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