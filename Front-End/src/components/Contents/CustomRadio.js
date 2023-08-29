import React from "react";
import styled from "styled-components";

const Div = styled.div`
  padding: 3px;
`;

const Input = styled.input`
  appearance: auto;
  height: 32px;
  align-items: center; /* 내부 요소를 중앙 정렬합니다 */
  text-align: center;
`;

function CustomRadio({
  id,
  classNameBox,
  classNameRadio,
  name,
  options,
  onClick,
}) {
  return (
    <Div id={id} className={classNameBox}>
      {options.map(([labelText, value]) => (
        <label key={value}>
          <Input
            className={classNameRadio}
            type="radio"
            name={name}
            value={value}
            onClick={onClick}
          />
          {labelText}
        </label>
      ))}
    </Div>
  );
}

export default CustomRadio;
