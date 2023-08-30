import React, { Component } from "react";
import Setting from "../images/pages/common/setting.png";
import Calc from "../images/pages/common/calc.png";
import Print from "../images/pages/common/print.png";
import Delete from "../images/pages/common/delete.png";

import "../styles/css/pages/SalaryData.css";
import PageHeaderName from "../components/PageHeader/PageHeaderName";
import PageHeaderTextButton from "../components/PageHeader/PageHeaderTextButton";
import PageHeaderIconButton from "../components/PageHeader/PageHeaderIconButton";
import SearchBarBox from "../components/SearchBar/SearchBarBox";
import CustomCalendar from "../components/Contents/CustomCalendar";

const handleSearchBarChange = (selectedValue) => {
  console.log("선택된 값:", selectedValue);
};

class SalaryData extends Component {
  render() {
    return (
      <>
        <div className="pageHeader">
          <div className="innerBox fxSpace">
            <PageHeaderName text="급여자료입력" />
            <div className="fxAlignCenter">
              <div className="btnWrapper textBtnWrap">
                <PageHeaderTextButton text="급여대장" />
                <PageHeaderTextButton text="지급일자" />
                <PageHeaderTextButton text="수당/공제등록" />
                <PageHeaderTextButton text="재계산" />
                <PageHeaderTextButton text="완료" />
                <PageHeaderTextButton text="급여메일보내기" />
                <PageHeaderTextButton text="급여명세 문자보내기" />
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
        <section className="section sd-section">
          <div className="searchBar">
            <div className="innerBox fxSpace">
              <div className="selectWrapper">
                {/* <div className="searchBarBox">
                  <span className="searchBarName">귀속연월</span>
                  <CustomCalendar className="" width="150" />
                </div> */}
                <div className="searchBarName">
                  <div className="searchBarNameCalender">
                    <span>귀속년월</span>
                    <CustomCalendar width="150" />
                  </div>
                </div>
                <SearchBarBox
                  label="구분"
                  id="sd-salary-category"
                  options={[
                    { value: "0", label: "0. 급여" },
                    { value: "1", label: "1. 급여 + 상여" },
                    { value: "2", label: "2. 상여" },
                    { value: "3", label: "3. 추급" },
                    { value: "4", label: "4. 추상" },
                  ]}
                  defaultValue="0"
                  onChange={handleSearchBarChange}
                />
                <div className="searchBarName">
                  <div className="searchBarNameCalender">
                    <span>지급일</span>
                    <CustomCalendar width="150" />
                  </div>
                </div>
                <SearchBarBox
                  label="정렬"
                  id="sd-order-category"
                  options={[
                    { value: "0", label: "0. 코드순" },
                    { value: "1", label: "1. 이름순" },
                    { value: "2", label: "2. 직급순" },
                    { value: "3", label: "3. 입사일순" },
                  ]}
                  defaultValue="0"
                />
              </div>
              <div className="btnWrapper">
                <button className="gray">조회</button>
                <button className="btnMore">
                  <span className="hidden">펼쳐보기? 더보기?</span>
                </button>
              </div>
            </div>
          </div>
          <div className="sd-container">
            <div className="sd-item sd-item1">
              <table className="sd-empList">
                <thead>
                  <tr>
                    <th>v</th>
                    <th>Code</th>
                    <th>사원명</th>
                    <th>직급</th>
                    <th>감면율</th>
                    <th>연말</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <input type="checkbox" />
                    </td>
                    <td>0001</td>
                    <td>이재훈</td>
                    <td>조장</td>
                    <td>92%</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
              <table className="sd-empList-calTable">
                <tbody>
                  <tr>
                    <td></td>
                    <td colSpan={2}>인 원 ( 퇴 직 )</td>
                    <td>7(0)</td>
                    <td></td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="sd-item sd-item2">
              <table className="sd-allowance-top">
                <thead>
                  <tr>
                    <th>급여항목</th>
                    <th>금액</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>기본급</td>
                    <td>
                      999,999,999
                      {/* <input type="text" /> */}
                    </td>
                  </tr>
                </tbody>
              </table>
              <table className="sd-allowance-top-calTable">
                <tbody>
                  <tr>
                    <td>과세</td>
                    <td>999,999,999</td>
                  </tr>
                  <tr>
                    <td>비과세</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>감면 소득</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>지급액 계</td>
                    <td>999,999,999</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="sd-item sd-item3">
              <table className="sd-allowance-bottom">
                <thead>
                  <tr>
                    <th>급여항목</th>
                    <th>금액</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>국민연금</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>건강보험</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>고용보험</td>
                    <td>7,999,990</td>
                  </tr>
                  <tr>
                    <td>장기요양보험료</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>소득세</td>
                    <td>416,037,900</td>
                  </tr>
                  <tr>
                    <td>지방소득세</td>
                    <td>41,603,790</td>
                  </tr>
                </tbody>
              </table>
              <table className="sd-allowance-bottom-calTable">
                <tbody>
                  <tr>
                    <td>공제액 계</td>
                    <td>456,641,770</td>
                  </tr>
                  <tr>
                    <td>차인지급액</td>
                    <td>534,358,229</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="sd-item sd-item4">
              <div className="sd-searchCondition">
                <span className="searchBarName">조회구분</span>
                <SearchBarBox
                  id="hr-category"
                  options={[
                    { value: "0", label: "0. 전체사원_당월" },
                    { value: "1", label: "1. 현재사원_당월" },
                    { value: "2", label: "2. 전체사원_현재" },
                    { value: "3", label: "3. 현재사원_현재" },
                    { value: "3", label: "4. 전체사원_연간" },
                    { value: "3", label: "5. 현재사원_연간" },
                  ]}
                  defaultValue="0"
                />
              </div>
              <div className="sd-tableArea">
                <table className="sd-search-allowance-top">
                  <thead>
                    <tr>
                      <th>급여항목</th>
                      <th>TX</th>
                      <th>금액</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>기본급</td>
                      <td>과세</td>
                      <td>1,000,000.149</td>
                    </tr>
                  </tbody>
                </table>
                <table className="sd-search-allowance-top-calTable">
                  <tbody>
                    <tr>
                      <td>과세</td>
                      <td>1,000,000,149</td>
                    </tr>
                    <tr>
                      <td>비과세</td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>감면 소득</td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>지급액 계</td>
                      <td>1,000,000,149</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="sd-item sd-item5">
              <table className="sd-search-allowance-bottom">
                <thead>
                  <tr>
                    <th>급여항목</th>
                    <th>금액</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>국민연금</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>건강보험</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>고용보험</td>
                    <td>7,999,990</td>
                  </tr>
                  <tr>
                    <td>장기요양보험료</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>소득세</td>
                    <td>416,037,900</td>
                  </tr>
                  <tr>
                    <td>지방소득세</td>
                    <td>41,603,790</td>
                  </tr>
                  <tr>
                    <td>농특세</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
              <table className="sd-search-allowance-bottom-calTable">
                <tbody>
                  <tr>
                    <td>공제액 계</td>
                    <td>456,641,770</td>
                  </tr>
                  <tr>
                    <td>차인지급액</td>
                    <td>534,358,229</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="sd-item sd-item6">
              <div className="sd-empInfo">
                <div className="sd-empInfo-top">
                  <h4>
                    <span>
                      <box-icon name="user"></box-icon>
                    </span>
                    사원정보
                  </h4>
                </div>
                <div className="sd-empInfo-detail">
                  <label htmlFor="">입사일</label>
                  <p>2019-01-01</p>
                  <label htmlFor="">배우자공제</label>
                  <p>부</p>
                  <label htmlFor="">20세이하/60세이상</label>
                  <p>0 / 0</p>
                  <label htmlFor="">조정율</label>
                  <p>100%</p>
                  <label htmlFor="">거주구분</label>
                  <p>거주자/내국인</p>
                  <label htmlFor="">생산/국외</label>
                  <p>생산직X / X</p>
                  <label htmlFor="">연장근로비과세</label>
                  <p>부</p>
                  <label htmlFor="">퇴사일</label>
                  <p></p>
                  <label htmlFor="">직종</label>
                  <p></p>
                  <label htmlFor="">부서</label>
                  <p></p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }
}

export default SalaryData;
