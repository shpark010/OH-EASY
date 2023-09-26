import React from "react";
import PageHeaderIconButton from "../PageHeader/PageHeaderIconButton";
import PageHeaderName from "../PageHeader/PageHeaderName";
import PageHeaderTextButton from "../PageHeader/PageHeaderTextButton";

import Setting from "../../images/pages/common/setting.png";
import Calc from "../../images/pages/common/calc.png";
import Print from "../../images/pages/common/print.png";
import Delete from "../../images/pages/common/delete.png";
import useApiRequest from "../Services/ApiRequest";
import SweetAlert from "../Contents/SweetAlert";

const HrPageHeader = ({ checkedRows, setEmpList, setClickEmpCode }) => {
  const apiRequest = useApiRequest();

  // 알림창 표시 상태 관리
  const [showAlert, setShowAlert] = React.useState(false);

  // 체크된 사원들을 가져와서 db에서 삭제
  const handleSendCheckedCdEmpListDelete = async () => {
    try {
      const responseData = await apiRequest({
        method: "POST",
        url: "/api2/hr/HrEmpDataDelete",
        data: {
          selectedEmpCodes: checkedRows,
        },
      });
      if (responseData === 1) {
        // 삭제성공
        alert("삭제성공");
      } else {
        // 삭제 실패
        alert("삭제실패");
      }
    } catch (error) {
      console.error("api 요청 실패:", error);
    }
  };

  // 사원정보 API 요청 후 사원정보 setEmpList
  const handleGetEmpList = async () => {
    try {
      const responseData = await apiRequest({
        method: "GET",
        url: "/api2/hr/getAllEmpList",
      });
      setEmpList(responseData);
      setClickEmpCode();
    } catch (error) {
      console.error("Failed to fetch emp data:", error);
    }
  };
  const handleCloseAlert = () => {
    setShowAlert(false); // 알림창 표시 상태를 false로 설정
  };

  return (
    <div className="pageHeader">
      {showAlert && (
        <SweetAlert
          text="인사테이블에 등록되지않은 사원 정보를 불러올까요?"
          showCancel={true}
          //type="success"
          type="warning"
          //type="error"
          //type="question"
          onConfirm={() => {
            handleGetEmpList();
            handleCloseAlert();
          }}
          onCancel={handleCloseAlert}
        />
      )}
      <div className="innerBox fxSpace">
        <PageHeaderName text="인사관리등록" />
        <div className="fxAlignCenter">
          <div className="btnWrapper textBtnWrap">
            <PageHeaderTextButton
              text="사원불러오기"
              onClick={(e) => {
                setShowAlert(true);
              }}
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
              onClick={handleSendCheckedCdEmpListDelete}
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
