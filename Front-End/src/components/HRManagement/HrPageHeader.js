import React, { useState } from "react";
import PageHeaderIconButton from "../PageHeader/PageHeaderIconButton";
import PageHeaderName from "../PageHeader/PageHeaderName";
import PageHeaderTextButton from "../PageHeader/PageHeaderTextButton";

import Setting from "../../images/pages/common/setting.png";
import Calc from "../../images/pages/common/calc.png";
import Print from "../../images/pages/common/print.png";
import Delete from "../../images/pages/common/delete.png";
import useApiRequest from "../Services/ApiRequest";
import SweetAlert from "../Contents/SweetAlert";

const HrPageHeader = ({
  checkedRows,
  setEmpList,
  clickEmpCode,
  setClickEmpCode,
  deleteEmp,
  setEmpStats,
  setCheckedRows,
  empList,
}) => {
  const apiRequest = useApiRequest();

  // 알림창 표시 상태 관리
  const [showAlert, setShowAlert] = useState(false);
  const [showAlertDelete, setShowAlertDelete] = useState(false);
  const [showAlertDeleteError, setShowAlertDeleteError] = useState(false);

  // 체크된 사원들을 가져와서 db에서 삭제
  const handleSendCheckedCdEmpListDelete = async () => {
    if (checkedRows.length === 0) {
      setShowAlertDeleteError(true);
      return;
    }
    try {
      const responseData = await apiRequest({
        method: "POST",
        url: "/api2/hr/HrEmpDataDelete",
        data: {
          selectedEmpCodes: checkedRows,
        },
      });
      if (responseData === 1) {
        checkedRows.forEach((empCode) => {
          deleteEmp(empCode); // 여기에서 부모의 함수를 호출
        });
        console.log("************************");
        console.log("************************");
        console.log("************************");
        console.log(empList[0].cdEmp);
        setClickEmpCode(empList[0].cdEmp);
        console.log(clickEmpCode);
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
        url: "/api2/hr/insertAllHrEmpData",
      });
      console.log(responseData);
      setEmpList(responseData.result);

      setEmpStats({
        total: responseData.total,
        working: responseData.working,
        resigned: responseData.resigned,
      });
      setClickEmpCode(responseData.result[0].cdEmp);
    } catch (error) {
      console.error("Failed to fetch emp data:", error);
    }
    setCheckedRows([]);
  };
  const handleCloseAlert = () => {
    setShowAlert(false); // 알림창 표시 상태를 false로 설정
  };
  const handleCloseDeleteAlert = () => {
    setShowAlertDelete(false); // 알림창 표시 상태를 false로 설정
  };
  const handleCloseDeleteErrorAlert = () => {
    setShowAlertDeleteError(false); // 알림창 표시 상태를 false로 설정
  };
  return (
    <div className="pageHeader">
      {showAlert && (
        <SweetAlert
          text="인사관리에 등록하지않은 사원을 전부 등록 후 모든 사원을 불러옵니다. 실행하시겠습니까?"
          showCancel={true}
          type="question"
          onConfirm={() => {
            handleGetEmpList();
            handleCloseAlert();
          }}
          onCancel={handleCloseAlert}
        />
      )}
      {showAlertDelete && (
        <SweetAlert
          text="선택한 사원을 전부 삭제합니까?"
          showCancel={true}
          //type="success"
          type="warning"
          //type="error"
          //type="question"
          onConfirm={() => {
            handleSendCheckedCdEmpListDelete();
            handleCloseDeleteAlert();
          }}
          onCancel={handleCloseDeleteAlert}
        />
      )}
      {showAlertDeleteError && (
        <SweetAlert
          text="선택한 사원이 없습니다."
          //type="success"
          //type="warning"
          type="error"
          //type="question"
          onConfirm={() => {
            handleCloseDeleteErrorAlert();
          }}
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
              onClick={(e) => {
                if (checkedRows.length === 0) {
                  setShowAlertDeleteError(true);
                } else {
                  setShowAlertDelete(true);
                }
              }}
            />
            {/* <PageHeaderIconButton
              btnName="calc"
              imageSrc={Calc}
              altText="계산기"
            /> */}
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
