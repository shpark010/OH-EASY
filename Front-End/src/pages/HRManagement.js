import React, { Component } from "react";
import Setting from "../images/pages/common/setting.png";
import Calc from "../images/pages/common/calc.png";
import Print from "../images/pages/common/print.png";
import Delete from "../images/pages/common/delete.png";

import "../styles/css/pages/HRManagement.css";
import PageHeaderIconButton from "../components/PageHeader/PageHeaderIconButton";
import PageHeaderName from "../components/PageHeader/PageHeaderName";
import PageHeaderTextButton from "../components/PageHeader/PageHeaderTextButton";
import SearchBarBox from "../components/SearchBar/SearchBarBox";
import SearchSubmitButton from "../components/SearchBar/SearchSubmitButton";
import CustomInput from "../components/Contents/CustomInput";
import CustomButton from "../components/Contents/CustomButton";
import CustomCalender from "../components/Contents/CustomCalendar";

class HRManagement extends Component {
  render() {
    return (
      <>
        <div className="pageHeader">
          <div className="innerBox fxSpace">
            <PageHeaderName text="인사관리등록" />
            <div className="fxAlignCenter">
              <div className="btnWrapper textBtnWrap">
                <PageHeaderTextButton text="사원불러오기" />
                <PageHeaderTextButton text="재계산" />
                <PageHeaderTextButton text="완료" />
                <PageHeaderTextButton text="급여메일 보내기" />
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
        <div className="searchBar">
          <div className="innerBox fxSpace">
            <div className="selectWrapper">
              <SearchBarBox
                label="조회구분"
                id="hr-category"
                options={[
                  { value: "0", label: "0. 재직자+당해년도 퇴사자" },
                  { value: "1", label: "1. 재직자+당해년도 퇴사자" },
                  { value: "1", label: "2. 작년퇴사자+당해년도 퇴사자" },
                ]}
                defaultValue="0"
              />

              <SearchBarBox
                label="정렬"
                id="hr-order"
                options={[
                  { value: "0", label: "0. 코드순" },
                  { value: "1", label: "1. 이름순" },
                  { value: "1", label: "2. 성적순" },
                ]}
                defaultValue="0"
              />
            </div>
            <div className="btnWrapper">
              <SearchSubmitButton text="조회" />
            </div>
          </div>
        </div>
        <section className="section hr-section">
          {/* <CustomInput width={300} id="dd" />
          <CustomButton text="조회" color="black" backgroundColor="white" />
          <CustomCalender width={100} id="hr-calender" />
          <CustomInput width={200} id="dd" />
          <CustomButton text="조회" color="black" backgroundColor="white" /> */}
          <div className="hrGrid">
            {/* 리스트 영역 */}
            <div className="listArea">
              <div className="namePickerBox">
                <table className="namePickerTable hrGridTable borderTopBold">
                  <colgroup>
                    <col width="40px"></col>
                    <col width="120px"></col>
                    <col></col>
                  </colgroup>
                  <thead>
                    <tr className="hrHeaderStyle">
                      <th>✓</th>
                      <th>Code</th>
                      <th>사원명</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <input type="checkbox" />
                      </td>
                      <td>1111</td>
                      <td>김의진</td>
                    </tr>
                    <tr>
                      <td>
                        <input type="checkbox" />
                      </td>
                      <td>2222</td>
                      <td>의진</td>
                    </tr>
                    <tr>
                      <td>
                        <input type="checkbox" />
                      </td>
                      <td>3333</td>
                      <td>의진킴</td>
                    </tr>
                    <tr>
                      <td>
                        <input type="checkbox" />
                      </td>
                      <td>4444</td>
                      <td>진의김</td>
                    </tr>
                    <tr>
                      <td>
                        <input type="checkbox" />
                      </td>
                      <td>5555</td>
                      <td>진의킴</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="totalBox">
                <table className="hrTotalTable borderTopBold">
                  <tr>
                    <th rowSpan="2">총인원</th>
                    <td rowSpan="2">7</td>
                    <th>재직</th>
                    <td>0</td>
                  </tr>
                  <tr>
                    {/* 실제 0명이면 빈칸으로 출력? */}
                    <th>퇴사</th>
                    <td>0</td>
                  </tr>
                </table>
              </div>
            </div>
            {/* 컨텐츠 영역 */}
            <div className="contentsArea">
              <div className="hrInfoBaseWrap">
                <ul className="pageTab">
                  <li class="on">기초정보</li>
                </ul>
                <div className="hrInfoBase borderTopBold"></div>
              </div>
              <div className="hrInfoDetailWrap">
                <ul className="pageTab">
                  <li class="on">가족</li>
                  <li>학력</li>
                  <li>경력</li>
                  <li>신체</li>
                  <li>병역</li>
                </ul>
                <div className="hrInfoDetail borderTopBold"></div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }
}

export default HRManagement;
