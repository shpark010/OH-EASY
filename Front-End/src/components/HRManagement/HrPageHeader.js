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
import QuickMenu from "../PageHeader/QuickMenu";

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

  // New Alert state
  const [alertState, setAlertState] = useState({
    show: false,
    text: "",
    type: "",
    onConfirm: null,
    showCancel: "",
  });

  const showAlertWithSettings = (settings) => {
    setAlertState({
      ...settings,
      show: true,
    });
  };

  const closeAlert = () => {
    setAlertState({ ...alertState, show: false });
  };

  const handleSendCheckedCdEmpListDelete = async () => {
    if (checkedRows.length === 0) {
      showAlertWithSettings({
        text: "선택한 사원이 없습니다.",
        type: "error",
      });
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
      console.log("1111111111111111111111111111111111111111111111");

      if (responseData === 1) {
        checkedRows.forEach((empCode) => {
          deleteEmp(empCode);
        });
        console.log("2222222222222222222222222222222222222222222222");

        if (empList.length > 1 && empList[empList.length - 2].cdEmp) {
          setClickEmpCode(empList[empList.length - 2].cdEmp);
        } else {
          setClickEmpCode();
        }
        setEmpStats({ total: empList.length - checkedRows.length });
      } else {
        showAlertWithSettings({
          text: "삭제 실패",
          type: "error",
        });
      }
    } catch (error) {
      console.error("API 요청 실패:", error);
    }
  };

  const handleGetEmpList = async () => {
    try {
      const responseData = await apiRequest({
        method: "GET",
        url: "/api2/hr/insertAllHrEmpData",
      });
      setEmpList(responseData.result);

      setEmpStats({
        total: responseData.total,
        working: responseData.working,
        resigned: responseData.resigned,
      });

      setClickEmpCode(
        responseData.result[responseData.result.length - 1].cdEmp,
      );
    } catch (error) {
      console.error("Failed to fetch emp data:", error);
    }

    setCheckedRows([]);
  };

  const handlePrintPdf = async () => {
    if (checkedRows.length === 0) {
      showAlertWithSettings({
        text: "선택한 사원이 없습니다.",
        type: "error",
      });
      return;
    }

    let sendResult = 0;
    try {
      const responseDataList = await apiRequest({
        method: "POST",
        url: "/api2/util/hrPdf",
        data: {
          codes: checkedRows,
        },
        responseType: "json",
      });

      for (let responseData of responseDataList) {
        console.log("responseData");
        console.log(responseData);
        const cdEmp = responseData.empInfo.cdEmp;
        const nmEmp = responseData.empInfo.nmEmp;

        const base64Pdf = responseData.pdf;
        const pdfBlob = new Blob(
          [Uint8Array.from(atob(base64Pdf), (c) => c.charCodeAt(0))],
          { type: "application/pdf" },
        );

        const link = document.createElement("a");
        link.download = `인사자료_${nmEmp}(${cdEmp}).pdf`;
        link.href = window.URL.createObjectURL(pdfBlob);
        document.body.appendChild(link);
        link.click();
      }
    } catch (error) {
      console.error("Failed to fetch emp data:", error);
    }
    return sendResult;
  };

  return (
    <div className="pageHeader">
      {alertState.show && (
        <SweetAlert
          text={alertState.text}
          showCancel={alertState.showCancel}
          type={alertState.type}
          onConfirm={() => {
            if (alertState.onConfirm) alertState.onConfirm();
            closeAlert();
          }}
          onCancel={closeAlert}
        />
      )}

      <div className="innerBox fxSpace">
        <PageHeaderName text="인사관리등록" />
        <div className="fxAlignCenter">
          <div className="btnWrapper textBtnWrap">
            <PageHeaderTextButton
              text="사원불러오기"
              onClick={(e) => {
                showAlertWithSettings({
                  type: "question",
                  text: "인사관리에 등록하지않은 사원을 전부 등록 후 모든 사원을 불러옵니다. 실행하시겠습니까?",
                  onConfirm: handleGetEmpList,
                  showCancel: true,
                });
              }}
            />
          </div>
          <div className="iconBtnWrap">
            <PageHeaderIconButton
              btnName="print"
              imageSrc={Print}
              altText="프린트"
              onClick={
                (e) => {
                  if (checkedRows.length !== 0) {
                    showAlertWithSettings({
                      text: `선택한 사원 ${checkedRows.length}명의 PDF를 다운로드 하시겠습니까?`,
                      type: "question",
                      onConfirm: handlePrintPdf,
                      showCancel: true,
                    });
                  } else {
                    showAlertWithSettings({
                      text: `선택한 사원이 없습니다.`,
                      type: "error",
                    });
                  }
                }
                //handlePrintPdf
              }
            />
            <PageHeaderIconButton
              btnName="delete"
              imageSrc={Delete}
              altText="삭제"
              onClick={() => {
                if (checkedRows.length === 0) {
                  showAlertWithSettings({
                    text: "선택한 사원이 없습니다.",
                    type: "error",
                  });
                } else {
                  showAlertWithSettings({
                    text: `선택한 사원 ${checkedRows.length}명을 전부 삭제합니까?`,
                    type: "warning",
                    onConfirm: handleSendCheckedCdEmpListDelete,
                    showCancel: true,
                  });
                }
              }}
            />
            <QuickMenu />

            {/* <PageHeaderIconButton
              btnName="calc"
              imageSrc={Calc}
              altText="계산기"
            /> */}
            {/* <PageHeaderIconButton
              btnName="setting"
              imageSrc={Setting}
              altText="세팅"
            /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HrPageHeader;
