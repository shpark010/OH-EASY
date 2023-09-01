import React, { Component } from "react";
import axios from "axios";
import Setting from "../images/pages/common/setting.png";
import Calc from "../images/pages/common/calc.png";
import Print from "../images/pages/common/print.png";
import Delete from "../images/pages/common/delete.png";

import "../styles/css/pages/EmployeeRegister.css";
import PageHeaderIconButton from "../components/PageHeader/PageHeaderIconButton";
import PageHeaderName from "../components/PageHeader/PageHeaderName";
import PageHeaderTextButton from "../components/PageHeader/PageHeaderTextButton";
import CustomCalendar from "../components/Contents/CustomCalendar";
import CustomInput from "../components/Contents/CustomInput";
import SearchBarBox from "../components/SearchBar/SearchBarBox";
import CustomButton from "../components/Contents/CustomButton";
import DaumPostcode from 'react-daum-postcode';

class EmployeeRegister extends Component {

    constructor(props) {
      super(props);
      this.state = {
        employeeData: [],
        openPostcode: false,
      };
    }

    componentDidMount() {
      this.fetchEmployeeData();
    }
  
    fetchEmployeeData = () => {
      axios.get("/api/getEmployeeData")
        .then(response => {
          this.setState({ employeeData: response.data });
        })
        .catch(error => {
          console.error("Error fetching employee data:", error);
        });
    }

    handleAddressButtonClick = () => {
      this.setState({ openPostcode: true });
    }
  
    handleAddressSelect = (data) => {
      console.log(`
          주소: ${data.address},
          우편번호: ${data.zonecode}
      `);
      this.setState({ openPostcode: false });
    }
    
    closeModal = () => {
      this.setState({ openPostcode: false });
    }
    
  render() {
    const { employeeData, openPostcode } = this.state;
    
    return (
      <>
        <div className="pageHeader">
          <div className="innerBox fxSpace">
            <PageHeaderName text="사원등록" />
            <div className="fxAlignCenter">
              <div className="btnWrapper textBtnWrap">
                <PageHeaderTextButton text="사원검색" />
                <PageHeaderTextButton text="조건검색" />
                <PageHeaderTextButton text="데이터정렬" />
              </div>
              <div className="iconBtnWrap">
                <PageHeaderIconButton
                  btnName="print"
                  imageSrc={Print}
                  altText="프린트"
                />
                <PageHeaderIconButton
                  btnName="delete"
                  imageSrc={Delete}
                  altText="삭제"
                />
                <PageHeaderIconButton
                  btnName="calc"
                  imageSrc={Calc}
                  altText="계산기"
                />
                <PageHeaderIconButton
                  btnName="setting"
                  imageSrc={Setting}
                  altText="세팅"
                />
              </div>
            </div>
          </div>
        </div>

        <section className="section erSection">

            {/* 첫번째 그리드 */}
            <div className="erGrid">
              {/* 첫번째 테이블 */}
              <table className="erGridTable">
                <thead>
                  <tr className="erHeaderStyle">
                    <th></th>
                    <th>v</th>
                    <th>Code</th>
                    <th>사원명</th>
                    <th>내/외</th>
                    <th>주민번호</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td className="erLightGreen">1</td>
                    <td>
                      <input type="checkbox" />
                    </td>
                    <td>1111</td>
                    <td>김의진</td>
                    <td>0.내</td>
                    <td>123123-*******</td>
                  </tr>
                  <tr>
                    <td className="erLightGreen">2</td>
                    <td>
                      <input type="checkbox" />
                    </td>
                    <td>2222</td>
                    <td>의진</td>
                    <td>0.내</td>
                    <td>123123-*******</td>
                  </tr>
                  <tr>
                    <td className="erLightGreen">3</td>
                    <td>
                      <input type="checkbox" />
                    </td>
                    <td>3333</td>
                    <td>의진킴</td>
                    <td>0.내</td>
                    <td>123123-*******</td>
                  </tr>
                  <tr>
                    <td className="erLightGreen">4</td>
                    <td>
                      <input type="checkbox" />
                    </td>
                    <td>4444</td>
                    <td>진의김</td>
                    <td>0.내</td>
                    <td>123123-*******</td>
                  </tr>
                  <tr>
                    <td className="erLightGreen">5</td>
                    <td>
                      <input type="checkbox" />
                    </td>
                    <td>5555</td>
                    <td>진의킴</td>
                    <td>0.내</td>
                    <td>123123-*******</td>
                  </tr>
                </tbody>

                {/* <tbody>
                  {employeeData.map(employee => (
                    <tr key={employee.CD_EMP}>
                      <td className="erLightGreen">{employee.CD_EMP}</td>
                      <td>
                        <input type="checkbox" />
                      </td>
                      <td>{employee.CODE}</td>
                      <td>{employee.NM_EMP}</td>
                      <td>{employee.FG_FOREIGN}</td>
                      <td>{employee.NO_RESIDENT}</td>
                    </tr>
                  ))}
                </tbody> */}
              </table>

              {/* 두번째 테이블 */}
              <table className="erGridTable erGridBottom">
                <tbody>
                  <tr>
                    <td>재직 / 전체</td>
                    <td>{employeeData.length}명 / {employeeData.length}명</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 두번째 그리드 */}
            <div className="erGrid2">

                {/* 제목 탭 테이블 */}
                <table className="erGrid2Top">
                  <th className="erGrid2TopCell">기초자료</th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                </table>

              {/* 탭 내용 테이블 */}
              <table>
                <tbody>
                  <tr>
                    <th className="erHeaderStyle">입사일자</th>
                    <td className="erCellStyle">
                      <CustomCalendar width="170" id="erDate1" />
                    </td>
                  </tr>
                  <tr>
                    <th className="erHeaderStyle">주민번호</th>
                    <td className="erCellStyle">
                    <SearchBarBox
                        className="erSelectBox"
                        options={[
                          { value: "0", label: "내국인" },
                          { value: "1", label: "외국인" },
                        ]}
                        defaultValue="0"
                        />
                    </td>
                    <td className="erCellStyle">
                      <CustomInput />
                    </td>
                    <td className="erCellStyle">
                    <SearchBarBox
                        className="erSelectBox"
                        options={[
                          { value: "0", label: "남자" },
                          { value: "1", label: "여자" },
                        ]}
                        defaultValue="0"
                      />
                    </td>
                  </tr>
                  <tr>
                    <th className="erHeaderStyle">주소</th>
                    <td className="erCellStyle">
                      <CustomInput />
                    </td>
                    <td className="erCellStyle" colSpan="2">
                      <CustomInput width={375}/>
                    </td>
                    <td className="erCellStyle">
                    <CustomButton text="검색" color="black" onClick={this.handleAddressButtonClick} />
                    </td>
                  </tr>
                  <tr>
                  <th className="erHeaderStyle">상세주소</th>
                    <td className="erCellStyle" colSpan="5">
                      <CustomInput width={915} />
                    </td>
                  </tr>
                  <tr>
                    <th className="erHeaderStyle">전화번호</th>
                    <td className="erCellStyle">
                      <CustomInput />
                    </td>
                    <td className="erCellStyle">
                      <CustomInput />
                    </td>
                    <td className="erCellStyle">
                      <CustomInput />
                    </td>
                  </tr>
                  <tr>
                    <th className="erHeaderStyle">휴대폰번호</th>
                    <td className="erCellStyle">
                      <CustomInput />
                    </td>
                    <td className="erCellStyle">
                      <CustomInput />
                    </td>
                    <td className="erCellStyle">
                      <CustomInput />
                    </td>

                    {/* disabled */}
                    <td className="erCellStyle">
                      <input type="text" disabled className="erInputDisabledStyle" />
                    </td>
                    <td className="erCellStyle">
                      <input type="text" disabled className="erInputDisabledStyle" />
                    </td>

                  </tr>
                  <tr>
                    <th className="erHeaderStyle">이메일</th>
                    <td className="erCellStyle">
                      <div>
                        <CustomInput />
                      </div>
                    </td>
                    <td className="erCellStyle">
                      <div className="email-cell">
                        <div className="at-sign">@</div>
                        <CustomInput className="input-cell" width="10" />
                      </div>
                    </td>

                    <td className="erCellStyle">
                      <SearchBarBox
                        className="erSelectBox"
                        options={[
                          { value: "0", label: "직접입력" },
                          { value: "1", label: "gmail.com" },
                          { value: "2", label: "naver.com" },
                          { value: "3", label: "daum.net" },
                        ]}
                        defaultValue="0"
                      />
                    </td>
                  </tr>
                  <tr>
                    <th className="erHeaderStyle">부서</th>
                    <td className="erCellStyle">
                      <CustomInput />
                    </td>
                  </tr>
                  <tr>
                    <th className="erHeaderStyle">직급</th>
                    <td className="erCellStyle">
                      <SearchBarBox 
                      className="erSelectBox"
                      options={[{values:"0", label:"기본직급"}]} 
                      defaultValue="0" 
                      />
                    </td>
                    <td className="erCellStyle">
                      <SearchBarBox
                        className="erSelectBox"
                        options={[
                          { value: "0", label: "직급없음" },
                          { value: "1", label: "회장" },
                          { value: "2", label: "사장" },
                          { value: "3", label: "부사장" },
                        ]}
                        defaultValue="0"
                      />
                    </td>
                  </tr>
                  <tr>
                    <th className="erHeaderStyle">퇴사일자</th>
                    <td className="erCellStyle">
                      <CustomCalendar width="170" id="erDate2" />
                    </td>
                  </tr>
                  <tr>
                    <th className="erHeaderStyle">급여이체은행</th>
                    <td className="erCellStyle">
                      <CustomInput />
                    </td>
                    <td className="erCellStyle">
                      <CustomInput />
                    </td>
                    <td className="erCellStyle">
                      <CustomInput />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

              {/* 모달 창 */}
              {openPostcode && (
                <div className="modalOverlay" onClick={this.closeModal}>
                  <div className="modalContent" onClick={(e) => e.stopPropagation()}>
                    <DaumPostcode 
                      onComplete={this.handleAddressSelect}  
                      autoClose={false} 
                    />
                  </div>
                </div>
              )}

        </section>
        
      </>
    );
  }
}

export default EmployeeRegister;
