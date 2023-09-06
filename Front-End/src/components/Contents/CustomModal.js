import React, { useState } from "react";
import Modal from "react-modal";
import { styled } from "styled-components";

function CustomModal({
  isOpen, //클릭했을 경우 모달 창 오픈하는 함수
  onRequestClose, //'닫기' 버튼 클릭했을 경우 모달 창 닫는 함수
  children, //모달에 들어갈 내용
  overlayStyle, //바깥쪽 스타일
  contentStyle, //모달 안쪽 스타일
}) {
  const defaultOverlayStyle = {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  };

  const defaultContentStyle = {
    backgroundColor: "white",
    width: "600px",
    height: "400px",
    margin: "auto",
  };
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="모달 창"
      style={{
        overlay: { ...defaultOverlayStyle, ...overlayStyle },
        content: { ...defaultContentStyle, ...contentStyle },
      }}
    >
      {children}
    </Modal>
  );
}

export default CustomModal;
