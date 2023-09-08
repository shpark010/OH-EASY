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

  const [employeeData, setEmployeeData] = useState([]);
  const [openPostcode, setOpenPostcode] = useState(false);
  const [empList, setEmpList] = useState([]);
  const [zonecode, setZonecode] = useState("");
  const [address, setAddress] = useState("");
  const [tab,setTab] = useState("wcCreate");

  const tabClick = (tabState) =>{
    setTab(tabState)
    
  };

  const tabComponent = () =>{

    switch(tab){
      case "wcCreate" :
        return <WorkContractCreate data = {data} columns={columns} />;
      
      case "wcSelect" :
        return <WorkContractSelect data = {data} columns={columns}  />;
      default : 
      return null;

    }
    
  };


  const handleAddressButtonClick = () => {
    setOpenPostcode(true);
  };

  const handleAddressSelect = (addr) => {
    console.log(`
        우편번호: ${addr.zonecode}
        주소: ${addr.address}
    `);
    // // 주소와 우편번호 값을 가져온 데이터로 설정
    // const address = data.address;
    // const zipcode = data.zipcode;
  
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
  }
  const data = React.useMemo(
    () =>
      empList.map((emp) => ({
        checkbox: false,
        code: emp.cdEmp,
        employee: emp.nmEmp,
        foreign: emp.fgForeign,
        resident: emp.noResident,
      })),
    [empList]
  );
  const columns = React.useMemo(
    () => [
      {
        Header: "✓",
        accessor: "checkbox",
        id: "checkbox",
        Cell: ({ cell: { value } }) => <input type="checkbox" />,
      },
      {
        Header: "Code",
        accessor: "code",
        id: "code",
        width: "20%",
        Cell: ({ cell: { value } }) => {
          const [inputValue, setInputValue] = React.useState(value);

          const handleInputChange = (e) => {
            setInputValue(e.target.value);
          };
          const handleInputClick = (e) => {
            console.log(e.target);
          };

          return (
            <Input
              value={inputValue}
              onClick={handleInputClick}
              onChange={handleInputChange}
            />
          );
        },
      },
      {
        Header: "사원명",
        accessor: "employee",
        id: "employee",
        width: "20%",
        Cell: ({ cell: { value } }) => {
          const [inputValue, setInputValue] = React.useState(value);

          const handleInputChange = (e) => {
            setInputValue(e.target.value);
          };

          return (
            <Input
              value={inputValue}
              onChange={handleInputChange}
            />
          );
        },
      },
      
      {
        Header: "주민번호",
        accessor: "resident",
        id: "resident",
        Cell: ({ cell: { value } }) => {
          const [inputValue, setInputValue] = React.useState(value);

          const handleInputChange = (e) => {
            setInputValue(e.target.value);
          };

          return (
            <Input
              value={inputValue}
              onChange={handleInputChange}
            />
          );
        },
      },
    ],
    []
  );
  
  

    
    return (
      
      <>

        <div className="pageHeader">
          <div className="innerBox fxSpace">
            <h2 className="pageHeaderName">표준근로계약서</h2>
            <div className="fxAlignCenter">
              <div className="btnWrapper textBtnWrap">
                <PageHeaderTextButton text="전자서명 메일 보내기" /*onClick={''}*/ />
              </div>
              <div className="iconBtnWrap">
                <PageHeaderIconButton btnName="delete" imageSrc={Delete} altText="삭제" />
              </div>
            </div>
          </div>
        </div>

    
         <div className='borderbuttonBold'>
          <button 
          className={`wcTab1 ${tab === "wcCreate" ? "on" : ""}`}
          onClick={ () => tabClick("wcCreate")}> 계약서 작성</button>  

          <button 
          className={`wcTab2 ${tab === "wcSelect" ? "on" : ""}`}x 
          onClick={()=>tabClick("wcSelect")} > 계약서 조회</button>
        </div> 
        
      


        <div>{tabComponent()}</div>
        
      </>
    );
  }
export default WorkContract;