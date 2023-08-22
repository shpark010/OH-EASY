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

        <section className="section">
          {/* 첫 번째 그리드 영역에 .section.one 클래스 적용 */}
          <div className="emp-section">
            <div className="grid">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Header 1</th>
                      <th>Header 2</th>
                      <th>Header 3</th>
                      <th>Header 4</th>
                      <th>Header 5</th>
                      <th>Header 6</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Data 1</td>
                      <td>Data 2</td>
                      <td>Data 3</td>
                      <td>Data 4</td>
                      <td>Data 5</td>
                      <td>Data 6</td>
                    </tr>
                    {/* 여기에 추가적인 행들을 넣을 수 있습니다 */}
                  </tbody>
                </table>
              </div>
            <div className="grid">second grid area</div>
          </div>
        </section>
        


      </>
    );
  }
}

export default EmployeeRegister;
