import React,{ useState } from 'react';
// import '../styles/css/pages/WorkContract.css';
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




const WorkContractSelect = ({sleEmpList}) => {

  const apiRequest = useApiRequest();
  const [employeeData, setEmployeeData] = useState([]);
  const [openPostcode, setOpenPostcode] = useState(false);
  const [zonecode, setZonecode] = useState("");
  const [address, setAddress] = useState("");
  const [addr,setAddr] = useState("");

  const addrButtonClick= () => {
    setOpenPostcode(true);
  };

  const closeModal = () => {
    setOpenPostcode(false);
  }

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

  const getEmpData = async (data) => {
    console.log("눌리긴하네요");
      try {
        const responseData = await apiRequest({
          method: "GET",
          url: `/api2/wc/getWcData?code=${data}`,
        });
        
        setAddr(responseData);
        console.log(responseData);
        console.log(addr.addrWorkDtl);
        
      } catch (error) {
        console.error("Failed to fetch emp data:", error);
      }
    };

  


  const data = React.useMemo(
    () =>
      sleEmpList.map((emp) => ({
        checkbox: false,
        code: emp.cdEmp,
        employee: emp.nmEmp,
        resident: emp.noResident,
      })),
    [sleEmpList]
  );
  const columns = React.useMemo(
    () => [
      {
        Header: "✓",
        accessor: "checkbox",
        id: "checkbox",
        width:"10%",
        Cell: ({ cell: { value } }) =>{ 
          
        return(
          <>
        
        <input type="checkbox" />

        </>
        );
      
      },
      },
      {
        Header: "Code",
        accessor: "code",
        id: "code",
        width: "20%",
        Cell: ({ cell: { value },row: { original } }) => {
          const [inputValue, setInputValue] = React.useState(value);
          const [modalApper,setModalApper] = useState("off")

          const handleInputChange = (e) => {
            setInputValue(e.target.value);
          };
          const handleInputClick = (e) => {

            console.log("코드 컬럼 클릭 이벤트 실행 **********");
            getEmpData(value); //
           
          };

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
              onChange={handleInputChange}
              onMouseOver={mouseOverModalOn}
              onMouseOut= {mouseOutModalOff}
              modalRender = {modalApperFunc}
            
            />

          );

        },
      },
      {
        Header: "사원명",
        accessor: "employee",
        id: "employee",
        width: "20%",
        Cell: ({ cell: { value } ,row: { original }}) => {
          const [inputValue, setInputValue] = React.useState(value);

          const handleInputChange = (e) => {
            setInputValue(e.target.value);
          };

          const handleInputClick = (e) => {
            console.log("사원명 Click Event 실행*****");
            getEmpData(original.code);
             
          };

          return (
            <Input
              value={inputValue}
              onChange={handleInputChange}
              onClick={handleInputClick}

            />
          );
        },
      },
      
      {
        Header: "주민번호",
        accessor: "resident",
        id: "resident",
        Cell: ({ cell: { value },row: { original } }) => {
          const [inputValue, setInputValue] = React.useState(value);

          const handleInputChange = (e) => {
            setInputValue(e.target.value);
          };

          const handleInputClick = (e) => {
            console.log("주민번호 Click Event 실행*****");
            getEmpData(original.code);
             
          };

          return (
            <Input
              value={inputValue}
              onChange={handleInputChange}
              onClick={handleInputClick}
            />
          );
        },
      },
    ],
    []
  );
  
  const onBlur = () => {
    

    
  }




    return (
      <>
        <div className="searchBar">
          <div className="innerBox fxSpace">
            <div className="selectWrapper">
              
              <div className="searchBarName">작성년도</div>
              <CustomCalendar width={130}/>
              <b>~</b>
              <CustomCalendar width={130}/>
              
             
                

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
                  <td className="wcRightGridTableLeftTd">근무주소  </td>
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
                    <CustomInput width={605} value={addr.addrWorkDtl} />
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

        




        </section>
      </>
    );
  }
export default WorkContractSelect;