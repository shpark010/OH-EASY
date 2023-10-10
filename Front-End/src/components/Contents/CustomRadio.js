import React from "react";
import styled from "styled-components";

const Div = styled.div`
  display: flex;
`;

const Input = styled.input`
  appearance: auto;
  height: 29px;
  margin-right: 5px;

  /* 조건부 스타일링 */
  ${({ readOnly }) =>
    readOnly &&
    `
    accent-color: gray;
  `}
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  margin-right: 15px;

  /* 조건부 스타일링 */
  ${({ readOnly }) =>
    readOnly &&
    `
    pointer-events: none;
  `}
`;

const Span = styled.span`
  text-align: center;
`;

function CustomRadio({
  id,
  classNameBox,
  classNameRadio,
  name,
  options,
  onChange,
  value,
  readOnly = false, // default로 false 값을 설정
}) {
  const handleRadioChange = (e) => {
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <Div id={id} className={classNameBox}>
      {options.map(([labelText, optionValue]) => (
        <Label key={optionValue} readOnly={readOnly}>
          <Input
            className={classNameRadio}
            type="radio"
            name={name}
            value={optionValue}
            onChange={handleRadioChange}
            checked={String(value) === optionValue}
            readOnly={readOnly}
          />
          <Span>{labelText}</Span>
        </Label>
      ))}
    </Div>
  );
}

export default CustomRadio;
