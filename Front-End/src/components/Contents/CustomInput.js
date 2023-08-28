import React from "react";
import styled from "styled-components";

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

//사이즈를 주면 그사이즏대로 안주면 100px
function CustomInput({ width, id }) {
  return <Input type="text" id={id} width={`${width}px`} />;
}

export default CustomInput;
