import React, { Component } from "react";
import Setting from "../images/pages/common/setting.png";
import Calc from "../images/pages/common/calc.png";
import Print from "../images/pages/common/print.png";
import Delete from "../images/pages/common/delete.png";

import "../styles/css/pages/EmployeeRegister.css";
import PageHeaderIconButton from "../components/PageHeader/PageHeaderIconButton";
import PageHeaderName from "../components/PageHeader/PageHeaderName";
import PageHeaderTextButton from "../components/PageHeader/PageHeaderTextButton";
import CustomCalendar from "../components/Contents/CustomCalendar";

class EmployeeRegister extends Component {
  render() {
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
              </table>

              {/* 두번째 테이블 */}
              <table className="erGridTable erGridBottom">
                <tr>
                  <td>재직 / 전체</td>
                  <td>5명 / 5명</td>
                </tr>
              </table>
            </div>

            {/* 두번째 그리드 */}
            <div className="erGrid2">

                {/* 제목 탭 테이블 */}
                <table className="erGrid2Top">
                  <th className="erGrid2TopCell">기초자료</th>
                  <th className="erGrid2TopCell">공제등록</th>
                  <th className="erGrid2TopCell">부양가족</th>
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
                      <CustomCalendar width="130" id="erDate1" />
                    </td>
                  </tr>
                  <tr>
                    <th className="erHeaderStyle">주민번호</th>
                    <td className="erCellStyle">
                      <select className="erInputStyle erSelectBox">
                        <option value="0" selected>내국인</option>
                        <option value="1">외국인</option>
                      </select>
                    </td>
                    <td className="erCellStyle">
                      <input type="text" className="erInputStyle" />
                    </td>
                    <td className="erCellStyle">
                      <select className="erInputStyle erSelectBox">
                        <option value="0" selected>남자</option>
                        <option value="1">여자</option>
                      </select>
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
                    {/* <td className="erCellStyle">
                      <input type="text" disabled className="erInputStyle2" />
                    </td>
                    <td className="erCellStyle">
                      <input type="text" disabled className="erInputStyle2" />
                    </td> */}
                  </tr>
                  <tr>
                    <th className="erHeaderStyle">이메일</th>
                    <td className="erCellStyle">
                      <div>
                        <input type="text" className="erInputStyle" />
                      </div>
                    </td>
                    <td className="erCellStyle">
                      <div class="email-cell">
                        <input type="text" className="erInputStyle" />
                      </div>
                    </td>
                    <td className="erCellStyle">
                      <select className="erInputStyle erSelectBox">
                        <option value="0" selected>직접입력</option>
                        <option value="1">gmail.com</option>
                        <option value="2">naver.com</option>
                        <option value="3">daum.net</option>
                      </select>
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
                      <select className="erInputStyle erSelectBox">
                        <option value="0" selected>기본직급</option>
                      </select>
                    </td>
                    <td className="erCellStyle">
                      <select className="erInputStyle erSelectBox">
                        <option value="0" selected>직급없음</option>
                        <option value="1">회장</option>
                        <option value="2">사장</option>
                        <option value="3">부사장</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <th className="erHeaderStyle">퇴사일자</th>
                    <td className="erCellStyle">
                      <CustomCalendar width="120" id="erDate2" />
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
              <div>

              </div>
            </div>
        </section>
        
      </>
    );
  }
}

export default EmployeeRegister;
