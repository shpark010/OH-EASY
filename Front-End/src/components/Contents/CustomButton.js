import React from "react";
import styled from "styled-components";

const Button = styled.button`
  height: 32px;
  padding: 6px 12px;
  font-size: 14px;
  vertical-align: bottom;
  background-color: ${(props) =>
    props.backgroundColor || "var(--color-primary-white)"};
  color: ${(props) => props.color || "var(--color-primary-white)"};
`;
//color 안주면 기본 화이트
const CustomButton = ({
  text,
  color,
  backgroundColor,
  id,
  className,
  onClick,
}) => {
  return (
    <Button color={color} id={id} className={className} onClick={onClick}>
      {text}
    </Button>
  );
};

export default CustomButton;
