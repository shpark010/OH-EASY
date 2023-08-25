import React from 'react';
import styled from 'styled-components';

const BtnWrapDiv = styled.div`
  display: flex;
  align-items: center;
`;

const TextBtnWrap = styled.div`
  display: flex;
  align-items: center;

  button {
    padding: 8px 16px;
    border: 1px solid var(--color-primary-white);
    color: var(--color-primary-white);
    font-size: 16px;
    margin-left: 4px;
    margin-right: 4px;
  }
`;

const BtnWrapper = ({ label }) => {
  return (
    <BtnWrapDiv>
      <TextBtnWrap>
        <button>{label}</button>
      </TextBtnWrap>
    </BtnWrapDiv>
  );
};

export default BtnWrapper;
