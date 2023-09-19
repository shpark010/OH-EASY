import React from "react";
import Swal from "sweetalert2";
import styled, { createGlobalStyle } from "styled-components";

// SweetAlert2의 스타일을 오버라이드하는 전역 스타일
const GlobalStyle = createGlobalStyle`
  .swal2-popup {
    z-index: 10000;
    /* 여기에 .swal2-popup에 대한 추가적인 스타일을 넣을 수 있습니다. */
  }

  .swal2-title {
    /* 제목에 대한 스타일링 */
    font-size: 24px;
    color: blue;
  }

  .swal2-text {
    /* 텍스트 영역에 대한 스타일링 */
    font-size: 30px;
    color: red;
  }

  .swal2-confirm {
    /* 확인 버튼에 대한 스타일링 */
    background-color: green;
  }

  .swal2-cancel swal2-styled{
    /* 취소 버튼에 대한 스타일링 */
    background-color: black;
  }
  
  #swal2-html-container  {
    z-index: 9999;
    font-weight: 700;
    font-family: "NanumSquare", sans-serif;
    font-size: 20px;
  }

  .swal2-backdrop {
    z-index: 9998;
  }
`;

const SweetAlert = ({
  text,
  showCancel = false,
  confirmText = "확인",
  cancelText = "취소",
  onConfirm = () => {},
  onCancel = () => {},
}) => {
  React.useEffect(() => {
    Swal.fire({
      text,
      showCancelButton: showCancel,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
    }).then((result) => {
      if (result.isConfirmed) {
        onConfirm();
      } else if (result.isDismissed) {
        onCancel();
      }
    });
  }, [text, showCancel, confirmText, cancelText, onConfirm, onCancel]);

  return <GlobalStyle />; // 전역 스타일을 컴포넌트로 반환합니다.
};

export default SweetAlert;
