import React from "react";
import styled from "styled-components";

const StyledButton = styled.button.withConfig({
  shouldForwardProp: (prop) => !["color", "backgroundColor"].includes(prop),
})`
  font-family: "NanumSquare", sans-serif;
  font-weight: 400;
  height: 32px;
  padding: 6px 12px;
  font-size: 14px;
  vertical-align: bottom;
  border: 1px solid
    ${({ backgroundColor }) => backgroundColor || "var(--color-primary-black)"};
  background-color: ${({ backgroundColor }) =>
    backgroundColor || "var(--color-primary-white)"};
  color: ${({ color }) => color || "var(--color-primary-black)"};

  & + button {
    margin-left: 10px;
  }

  &:disabled {
    cursor: not-allowed;
    background-color: var(--color-opacity-gray);
  }
`;

const CustomButton = ({
  text,
  color,
  backgroundColor,
  id,
  className,
  onClick,
  disabled,
}) => {
  return (
    <StyledButton
      id={id}
      className={className}
      onClick={onClick}
      color={color}
      backgroundColor={backgroundColor}
      disabled={disabled}
    >
      {text}
    </StyledButton>
  );
};

export default CustomButton;
