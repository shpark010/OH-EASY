import React,{ useState,useRef, useMemo, useEffect }  from 'react';
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






const WorkContractCreate = ({empList}) => {
  const apiRequest = useApiRequest();
  const [employeeData, setEmployeeData] = useState([]);
  const [openPostcode, setOpenPostcode] = useState(false);
  const [zonecode, setZonecode] = useState("");
  const [address, setAddress] = useState("");
  const [checkColumn,setCheckColumn] = useState([]);
  const [checkBoxState,setCheckBoxState] = useState();
  const [codeArr, setCodeArr] = useState([]);
  const schangeCheck2 = (e, originalCode) => {
    const checkedValue = e.target.checked;

    if (checkedValue) {
      setCodeArr(prevCodeArr => [...prevCodeArr, originalCode]);
    } else {
      setCodeArr(prevCodeArr => prevCodeArr.filter(code => code !== originalCode));
    }
  };
  useEffect(() => {
    console.log("codeArr 변경됨:", codeArr);
  }, [codeArr]); // codeArr이 변경될 때만 실행
  const checkRef = useRef(); // checkbox 용 useRef

  
 const changeCheck = (e) =>{
  const checkedValue = e.target.checked;
  const codeArr = [];
  console.log(e.target.cdEmp);
  // empList.forEach(emp => {
  //     if (checkedValue) {
  //     console.log("code : " + emp.cdEmp);
  //     console.log("truefalse : " + checkedValue);
  
  //     codeArr.push(emp.cdEmp);
  //   } else {
  //     return null; // 혹은 다른 값을 반환하여 해당 요소를 건너뜁니다.
  //   }
  // });
  // const codeArr = empList.map((emp) => {
  //   if (checkedValue === true) {
  //     console.log("code : " + emp.cdEmp);
  //     console.log("truefalse : " + checkedValue);
  
  //     // return {
  //     //   code : emp.cdEmp,
  //     // };
  //   } else {
  //     return null; // 혹은 다른 값을 반환하여 해당 요소를 건너뜁니다.
  //   }
  // });
  console.log(codeArr);
 
}


 const selectCheckBox = () =>{
  checkRef.current.checked = true

 }; // Checkbox all select 되도록하는 함수


  const addrButtonClick= () => {
    setOpenPostcode(true);
  };

  const closeModal = () => {
    setOpenPostcode(false);
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
  };


  const data = useMemo(
    () =>
      empList.map((emp) => ({
        checkbox: false,
        code: emp.cdEmp,
        employee: emp.nmEmp,
        resident: emp.noResident,
      })),
    [empList]
  );
  const columns = useMemo(
    () => [

      {
        Header:(<input 
          type='checkbox'
    
          onChange={selectCheckBox}
          />),
        accessor: "checkbox",
        id: "checkbox",
        width:"10%",
        Cell: ({ cell: { value }, row :{original} }) =>{ 

          const onCell = () =>{
            console.log("checkBox Click");
            console.log(original.code);

          }

          const changeCheck2 = (e) => {
            schangeCheck2(e, original.code);
          }
        return(
          <>
        <input type="checkbox" onChange={changeCheck2} />

        </>
        );
      
      }
      }
      ,
      {
        Header: "Code",
        accessor: "code",
        id: "code",
        width: "20%",
        Cell: ({ cell: { value }, row :{original} }) => {
          const [inputValue, setInputValue] = useState(value);
          const [modalApper,setModalApper] = useState("off")
  


          const handleInputChange = (e) => {
            setInputValue(e.target.value);
          };

          const handleInputClick = (e) => {
            const ele = e.target.parentElement.parentElement.parentElement.querySelector('tr:nth-child(1)');
            ele.style.backgroundColor = 'var(--color-secondary-blue)';
          };

          const inputBlur = (e) => {
            const ele = e.target.parentElement.parentElement.parentElement.querySelector('tr:nth-child(1)');
             ele.style.backgroundColor = '';
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
        accessor: "employee",
        id: "employee",
        width: "20%",
        Cell: ({ cell: { value }, row :{original}  }) => {
          const [inputValue, setInputValue] = React.useState(value);
          

          const handleInputClick = (e) => {
            const ele = e.target.parentElement.parentElement.parentElement.querySelector('tr:nth-child(1)');
             ele.style.backgroundColor = 'var(--color-secondary-blue)';
        
          }; // input tag Click시 발생할 event

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
        accessor: "resident",
        id: "resident",
        Cell: ({ cell: { value }, row :{original} } ) => {
          const [inputValue, setInputValue] = React.useState(value);

          const handleInputClick = (e) => {
            const ele = e.target.parentElement.parentElement.parentElement.querySelector('tr:nth-child(1)');
            ele.style.backgroundColor = 'var(--color-secondary-blue)';
          };

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
  
  


  const submitButtonClick= async () => {

    console.log(empList)
    
    // try {
    //   const responseData = await apiRequest({
    //     method: "PUT",
    //     url: `/api2/wc/updateEmpList`,
    //   });

      
    //   alert('작성이 완료되었습니다.');
      
    // } 
    // catch (error) {
    //   console.error("Failed to fetch emp data:", error);
    // }
  }
// 작성완료 Button을 눌렀을때 event 
// 사원Table의 근로계약서 작성여부가 0->1로 udpate되는 query를 날림.
// 그 후 setEmpList를 통해 List를 갱신.




    return (
      <>
        <div className="searchBar">
          <div className="innerBox fxSpace">
            <div className="selectWrapper">
              
              <div className="searchBarName">작성년월</div>
              <CustomCalendar width={130}
              
              />
              
             
                

                <SearchBarBox
                  label="정렬"
                  id="wc-order"
                      options={[
                        { value: '1', label: '사원코드 순' },
                        { value: '2', label: '사원이름 순' },
                       
                      ]}
                      defaultValue="1"
                      
                    />

             
            </div>
            <div className="btnWrapper">
            <SearchSubmitButton text="조회" />
            </div>
          </div>
        </div>


        
        <section className="section">
          <div className="wcGridContainer">
            <div className="wcGridCellItem1">
            
              <Table
                columns={columns}
                data={data}
                showInsertRow={true}
                checkboxWidth={"10%"}
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
                    <CustomCalendar width="167" id="startDate" /> 
                  </td>
                  <td className="wcRightGridTableRightTd2">
                    <CustomCalendar width="167" id="endDate" />
                  </td>
                </tr>
                <tr>
                  <td className="wcRightGridTableLeftTd">근무장소  </td>
                  <td className="wcRightGridTableRightTd1">
                    <CustomInput />
                  </td>
                  <td className="wcRightGridTableRightTd2">
                    <CustomInput width={425} />
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
                    <CustomInput width={605} onBlur = {""} />
                  </td>
                </tr>
                <tr>
                  <td className="wcRightGridTableLeftTd">업무의 내용 </td>

                  <td className="wcRightGridTableRightTd1" colSpan="2">
                    <CustomInput width="605"/>
                  </td>
                </tr>
                <tr>
                  <td className="wcRightGridTableLeftTd">소정근로시간 </td>
                  <td className="wcRightGridTableRightTd1">
                    <CustomInput></CustomInput>
                  </td>
                  <td className="wcRightGridTableRightTd2">
                    <CustomInput></CustomInput>
                  </td>
                </tr>
                <tr>
                  <td className="wcRightGridTableLeftTd">휴게시간 </td>
                  <td className="wcRightGridTableRightTd1">
                    <CustomInput></CustomInput>
                  </td>
                  <td className="wcRightGridTableRightTd2">
                    <CustomInput></CustomInput>
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
                      defaultValue="5"
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
                      defaultValue="7"
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
                      defaultValue="1"
                      className="searchBarBox2"
                    />
                  </td>
                  <td className="wcRightGridTableRightTd2">
                    <CustomInput width={100} /> 
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
                      defaultValue="1"
                      className="searchBarBox2"
                    />
                  </td>
                  <td className="wcRightGridTableRightTd2">
                    <CustomInput width={40}/>
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
                      defaultValue="1"
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
                      defaultValue="1"
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
                      defaultValue="1"
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
                      defaultValue="1"
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
                      defaultValue="1"
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
                      defaultValue="2"
                      className="searchBarBox3"
                    />
                  </td>
                  <td className="wcRightFirstTableRightTd2"></td>
                </tr>
                <tr>
                  <td className="wcRightGridTableLeftTd">작성일자 </td>
                  <td className="wcRightGridTableRightTd1">
                    <CustomCalendar className={'wcCreatedDateCalander'} width="170" id="createDate" />
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
      </>
    );
  }

export default WorkContractCreate;