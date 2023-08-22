import React, { Component } from "react";
import Setting from "../images/pages/common/setting.png";
import Calc from "../images/pages/common/calc.png";
import Print from "../images/pages/common/print.png";
import Delete from "../images/pages/common/delete.png";

import "../styles/css/pages/EmployeeRegister.css";

class EmployeeRegister extends Component {
  render() {
    return (
      <>
        <div className="pageHeader">
          <div className="innerBox fxSpace">
            <h2 className="pageHeaderName">사원등록</h2>
            <div className="fxAlignCenter">
              <div className="btnWrapper textBtnWrap">
                <button>버튼</button>
                <button>사원조회하기</button>
                <button>빠른조회</button>
              </div>
              <div className="iconBtnWrap">
                <button className="print">
                  <img src={Print} alt="프린트" />
                </button>
                <button className="delete">
                  <img src={Delete} alt="삭제" />
                </button>
                <button className="calc">
                  <img src={Calc} alt="계산기" />
                </button>
                <button className="setting">
                  <img src={Setting} alt="설정" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <section className="section erSection">

            
            <div className="erGrid">
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
              </table>
            </div>

            <div className="erGrid">
              <div className="erGrid2">
                <table>
                  <tbody>
                    <tr>
                      <th className="erHeaderStyle">입사일자</th>
                      <td className="erCellStyle">
                        <input type="date" className="erInputStyle" />
                      </td>
                    </tr>
                    <tr>
                      <th className="erHeaderStyle">주민번호</th>
                      <td className="erCellStyle">
                        <input type="text" className="erInputStyle" />
                      </td>
                      <td className="erCellStyle">
                        <input type="text" className="erInputStyle" />
                      </td>
                      <td className="erCellStyle">
                        <input type="text" className="erInputStyle" />
                      </td>
                    </tr>
                    <tr>
                      <th className="erHeaderStyle">주소</th>
                      <td className="erCellStyle">
                        <input type="text" className="erInputStyle" />
                      </td>
                      <td colSpan="2" className="erCellStyle">
                        <input type="text" className="erInputStyle" />
                      </td>
                      <td className="erCellStyle">
                        <button className="erSearchButton">검색</button>
                      </td>
                    </tr>
                    <tr>
                      <th className="erHeaderStyle">상세주소</th>
                      <td colSpan="5" className="erCellStyle">
                        <input type="text" className="erInputStyle" />
                      </td>
                    </tr>
                    <tr>
                      <th className="erHeaderStyle">전화번호</th>
                      <td className="erCellStyle">
                        <input type="text" className="erInputStyle" />
                      </td>
                      <td className="erCellStyle">
                        <input type="text" className="erInputStyle" />
                      </td>
                      <td className="erCellStyle">
                        <input type="text" className="erInputStyle" />
                      </td>
                    </tr>
                    <tr>
                      <th className="erHeaderStyle">휴대폰번호</th>
                      <td className="erCellStyle">
                        <input type="text" className="erInputStyle" />
                      </td>
                      <td className="erCellStyle">
                        <input type="text" className="erInputStyle" />
                      </td>
                      <td className="erCellStyle">
                        <input type="text" className="erInputStyle" />
                      </td>
                    </tr>
                    <tr>
                      <th className="erHeaderStyle">이메일</th>
                      <td className="erCellStyle">
                        <input type="text" className="erInputStyle" />
                      </td>
                      <td className="erCellStyle">
                        <input type="text" className="erInputStyle" />
                      </td>
                      <td className="erCellStyle">
                        <input type="text" className="erInputStyle" />
                      </td>
                    </tr>
                    <tr>
                      <th className="erHeaderStyle">부서</th>
                      <td className="erCellStyle">
                        <input type="text" className="erInputStyle" />
                      </td>
                    </tr>
                    <tr>
                      <th className="erHeaderStyle">직급</th>
                      <td className="erCellStyle">
                        <input type="text" className="erInputStyle" />
                      </td>
                      <td className="erCellStyle">
                        <input type="text" className="erInputStyle" />
                      </td>
                    </tr>
                    <tr>
                      <th className="erHeaderStyle">퇴사일자</th>
                      <td className="erCellStyle">
                        <input type="date" className="erInputStyle" />
                      </td>
                    </tr>
                    <tr>
                      <th className="erHeaderStyle">급여이체은행</th>
                      <td className="erCellStyle">
                        <input type="text" className="erInputStyle" />
                      </td>
                      <td className="erCellStyle">
                        <input type="text" className="erInputStyle" />
                      </td>
                      <td className="erCellStyle">
                        <input type="text" className="erInputStyle" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            

        </section>
        
      </>
    );
  }
}

export default EmployeeRegister;
