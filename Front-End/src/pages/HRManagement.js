import React, { Component } from "react";
import Setting from "../images/pages/common/setting.png";
import Calc from "../images/pages/common/calc.png";
import Print from "../images/pages/common/print.png";
import Delete from "../images/pages/common/delete.png";

import "../styles/css/pages/EmployeeRegister.css";
import PageHeaderIconButton from "../components/PageHeader/PageHeaderIconButton";
import PageHeaderName from "../components/PageHeader/PageHeaderName";
import PageHeaderTextButton from "../components/PageHeader/PageHeaderTextButton";
import SearchBarBox from "../components/SearchBar/SearchBarBox";
import SearchSubmitButton from "../components/SearchBar/SearchSubmitButton";

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
        <section className="section one">인사등록 페이지</section>
      </>
    );
  }
}

export default HRManagement;
