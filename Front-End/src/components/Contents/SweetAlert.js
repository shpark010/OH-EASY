import React from "react";
import Swal from "sweetalert2";
import styled, { createGlobalStyle } from "styled-components";

// SweetAlert2의 스타일을 오버라이드하는 전역 스타일
const GlobalStyle = createGlobalStyle`
  .swal2-popup {
    z-index: 10003;
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
  // 확인 버튼 
  div:where(.swal2-container) button:where(.swal2-styled).swal2-confirm {
  background-color: var(--color-primary-blue);
  }

// 취소버튼
div:where(.swal2-container) button:where(.swal2-styled).swal2-cancel {
    background-color: var(--color-primary-gray);
  }
  
  #swal2-html-container  {
    z-index: 10001;
    font-weight: 700;
    font-family: "NanumSquare", sans-serif;
    font-size: 20px;
    overflow: initial !important; 
    
  }

  .div:where(.swal2-container) {

    overflow: initial !important;
  }

  .swal2-backdrop {
    z-index: 10000;
  }
`;

const SweetAlert = ({
  text,
  type = "info",
  showCancel = false,
  confirmText = "확인",
  cancelText = "취소",
  onConfirm = () => {},
  onCancel = () => {},
}) => {
  React.useEffect(() => {
    Swal.fire({
      text,
      icon: type,
      showCancelButton: showCancel,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      allowOutsideClick: true,
      heightAuto: false,
      focusConfirm: true,
      allowEscapeKey: true,
    }).then((result) => {
      if (result.isConfirmed) {
        onConfirm();
      } else if (result.isDismissed) {
        onCancel();
      }
    });
  }, [text, type, showCancel, confirmText, cancelText, onConfirm, onCancel]);
  return <GlobalStyle />;
};
export default SweetAlert;
