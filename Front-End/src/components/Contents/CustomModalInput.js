import React, { useState } from "react";
import Modal from "react-modal";
import styled from "styled-components";
import { TbCalendarSearch } from "react-icons/tb";

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const Input = styled.input`
  width: ${(props) => props.width || "100px"};
  border-radius: 2px;
  border: 1px solid var(--color-primary-gray);
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
  height: 32px;
  padding: 0 5px;

  &:focus {
    outline: 1px solid var(--color-primary-black);
  }
`;

function CustomModalInput({ width, id, className, children }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <InputWrapper>
      <div>
        <Input
          id={id}
          className={className}
          width={`${width}px`}
          onClick={openModal}
          readOnly
        />
        <IconWrapper onClick={() => setIsModalOpen(!isModalOpen)}>
          <TbCalendarSearch size={18} />
        </IconWrapper>
        {/* CustomModal 사용 */}
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          style={{
            overlay: {
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            },
            content: {
              backgroundColor: "white",
              width: "30%",
              height: "55%",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            },
          }}
        >
          {children}
          <button onClick={closeModal}>닫기</button>
        </Modal>
      </div>
    </InputWrapper>
  );
}

const IconWrapper = styled.div`
  position: absolute;
  top: -1px;
  right: 0;
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 5px;
  cursor: pointer;
`;

export default CustomModalInput;
