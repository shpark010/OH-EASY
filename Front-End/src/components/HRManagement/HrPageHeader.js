import React from "react";
import PageHeaderIconButton from "../PageHeader/PageHeaderIconButton";
import PageHeaderName from "../PageHeader/PageHeaderName";
import PageHeaderTextButton from "../PageHeader/PageHeaderTextButton";

import Setting from "../../images/pages/common/setting.png";
import Calc from "../../images/pages/common/calc.png";
import Print from "../../images/pages/common/print.png";
import Delete from "../../images/pages/common/delete.png";

const HrPageHeader = ({ onFetchEmpData }) => {
  return (
    <div className="pageHeader">
      <div className="innerBox fxSpace">
        <PageHeaderName text="인사관리등록" />
        <div className="fxAlignCenter">
          <div className="btnWrapper textBtnWrap">
            <PageHeaderTextButton
              text="사원불러오기"
              onClick={onFetchEmpData}
            />
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
  );
};

export default HrPageHeader;
