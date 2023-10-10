import React from "react";
import styled from 'styled-components';

const StyledButton = styled.button`
  &:disabled {
    cursor: not-allowed;
  }
`;

const PageHeaderButton = ({ btnName, imageSrc, altText, onClick, disabled }) => {
  return (
    <StyledButton className={btnName} onClick={onClick} disabled={disabled}>
      <img src={imageSrc} alt={altText} />
    </StyledButton>
  );
};

export default PageHeaderButton;
