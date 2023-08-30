import React, { Component } from "react";

import HrPageHeader from "../components/HRManagement/HrPageHeader";
import HrSearchBar from "../components/HRManagement/HrSearchBar";

import "../styles/css/pages/HRManagement.css";
import CustomInput from "../components/Contents/CustomInput";
import CustomButton from "../components/Contents/CustomButton";
import CustomCalender from "../components/Contents/CustomCalendar";
import CustomRadio from "../components/Contents/CustomRadio";

import HrFamily from "../components/HRManagement/HrDetail/HrFamily";
import HrEdu from "../components/HRManagement/HrDetail/HrEdu";
import HrCareer from "../components/HRManagement/HrDetail/HrCareer";
import HrBody from "../components/HRManagement/HrDetail/HrBody";
import HrMilitary from "../components/HRManagement/HrDetail/HrMilitary";
import HrLicense from "../components/HRManagement/HrDetail//HrLicense";
import { handlePageHeaderSearchSubmit } from "../components/Services/PageHeaderSearchService";
class HRManagement extends Component {
  state = {
    activeTab: "family",
    empList: [],
  };

  handleTabClick = (tabName) => {
    this.setState({ activeTab: tabName });
  };

  handleFetchEmpData = async () => {
    try {
      const url = "/hr/getAllEmpList";
      const data = await handlePageHeaderSearchSubmit(url);
      this.setState({ empList: data });
    } catch (error) {
      console.error("Failed to fetch emp data:", error);
    }
  };

  renderContent() {
    switch (this.state.activeTab) {
      case "family":
        return <HrFamily />;
      case "edu":
        return <HrEdu />;
      case "career":
        return <HrCareer />;
      case "body":
        return <HrBody />;
      case "military":
        return <HrMilitary />;
      case "license":
        return <HrLicense />;
      default:
        return null;
    }
  }

  render() {
    return (
      <>
        <HrPageHeader onFetchEmpData={this.handleFetchEmpData} />
        <HrSearchBar />
        <section className="section hr-section">
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
                    {this.state.empList.map((emp) => (
                      <tr key={emp.cdEmp}>
                        <td>
                          <input type="checkbox" />
                        </td>
                        <td>{emp.cdEmp}</td>
                        <td>{emp.nmEmp}</td>
                      </tr>
                    ))}
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
                  <li className="on">기초정보</li>
                </ul>
                <div className="hrInfoBase borderTopBold borderbottomBold">
                  <div className="hrInfoBaseProfileImg">
                    <img
                      src="https://picsum.photos/180/180"
                      alt="이미지 샘플"
                      width="180px"
                      height="180px"
                    />
                    <div className="hrInfoBaseProfileImgBtnBox">
                      <CustomButton
                        text="등록"
                        color="black"
                        backgroundColor="white"
                        className="hrInfoBaseProfileImgBtn"
                      />
                      <CustomButton
                        text="삭제"
                        color="black"
                        backgroundColor="white"
                        className="hrInfoBaseProfileImgBtn"
                      />
                    </div>
                  </div>
                  <div className="hrInfoBaseProfileTitle">
                    <p className="hrInfoBaseProfileOnePtag">영문성명</p>
                    <p className="hrInfoBaseProfileOnePtag">주민등록번호</p>
                    <p className="hrInfoBaseProfileOnePtag">생년월일</p>
                    <p className="hrInfoBaseProfileOnePtag">부서</p>
                    <p className="hrInfoBaseProfileOnePtag">직무</p>
                    <p className="hrInfoBaseProfileOnePtag">입사년월일</p>
                  </div>
                  <div className="hrInfoBaseProfiletwo">
                    <CustomInput className="hrInfoBaseInput" width="300" />
                    <CustomInput className="hrInfoBaseInput" width="300" />
                    <CustomCalender className="hrInfoBaseInput" width="300" />
                    <CustomInput className="hrInfoBaseInput" width="300" />
                    <CustomInput className="hrInfoBaseInput" width="300" />
                    <CustomCalender className="hrInfoBaseInput" width="300" />
                  </div>
                  <div className="hrInfoBaseProfileTitle">
                    <p className="hrInfoBaseProfileOnePtag">한자성명</p>
                    <p className="hrInfoBaseProfileOnePtag">성별</p>
                    <p className="hrInfoBaseProfileOnePtag">결혼여부</p>
                    <p className="hrInfoBaseProfileOnePtag">직급</p>
                    <p className="hrInfoBaseProfileOnePtag">근로계약서</p>
                    <p className="hrInfoBaseProfileOnePtag">퇴사년연월일</p>
                  </div>
                  <div className="hrInfoBaseProfiletwo">
                    <CustomInput className="hrInfoBaseInput" width="300" />
                    <CustomRadio
                      classNameBox="hrInfoBaseBox"
                      classNameRadio="classNameRadio"
                      name="gender"
                      options={[
                        ["남", "male"],
                        ["여", "female"],
                      ]}
                    />
                    <CustomRadio
                      classNameBox="hrInfoBaseBox"
                      classNameRadio="classNameRadio"
                      name="married"
                      options={[
                        ["미혼", "0"],
                        ["기혼", "1"],
                      ]}
                    />
                    <CustomInput className="hrInfoBaseInput" width="300" />
                    <CustomRadio
                      classNameBox="hrInfoBaseBox"
                      classNameRadio="classNameRadio"
                      name="married"
                      options={[
                        ["작성", "0"],
                        ["미작성", "1"],
                      ]}
                    />
                    <CustomCalender className="hrInfoBaseInput" width="300" />
                  </div>
                </div>
              </div>
              <div className="hrInfoDetailWrap">
                <ul className="pageTab">
                  <li
                    className={this.state.activeTab === "family" ? "on" : ""}
                    onClick={() => this.handleTabClick("family")}
                  >
                    가족
                  </li>
                  <li
                    className={this.state.activeTab === "edu" ? "on" : ""}
                    onClick={() => this.handleTabClick("edu")}
                  >
                    학력
                  </li>
                  <li
                    className={this.state.activeTab === "career" ? "on" : ""}
                    onClick={() => this.handleTabClick("career")}
                  >
                    경력
                  </li>
                  <li
                    className={this.state.activeTab === "body" ? "on" : ""}
                    onClick={() => this.handleTabClick("body")}
                  >
                    신체
                  </li>
                  <li
                    className={this.state.activeTab === "military" ? "on" : ""}
                    onClick={() => this.handleTabClick("military")}
                  >
                    병역
                  </li>
                  <li
                    className={this.state.activeTab === "license" ? "on" : ""}
                    onClick={() => this.handleTabClick("license")}
                  >
                    병역
                  </li>
                </ul>
                <div className="hrInfoDetail borderTopBold">
                  {this.renderContent()}
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }
}

export default HRManagement;
