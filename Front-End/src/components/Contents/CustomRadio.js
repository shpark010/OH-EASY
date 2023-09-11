import React from "react";
import styled from "styled-components";

const Div = styled.div`
  display: flex; /* 항목들을 수평으로 배열 */
`;

const Input = styled.input`
  appearance: auto;
  height: 29px;
  margin-right: 5px; /* 오른쪽 간격 추가 */
`;

const Label = styled.label`
  display: flex; /* 요소들을 수평으로 배치 */
  align-items: center; /* 내부 요소를 중앙 정렬 */
  margin-right: 15px; /* 각 라벨 사이의 간격 추가 */
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
}) {
  const handleRadioChange = (e) => {
    if (onChange) {
      onChange(e);
    }
  };
  return (
    <Div id={id} className={classNameBox}>
      {options.map(([labelText, optionValue]) => (
        <Label key={optionValue}>
          <Input
            className={classNameRadio}
            type="radio"
            name={name}
            value={optionValue}
            onChange={handleRadioChange}
            checked={String(value) === optionValue}
          />
          <Span>{labelText}</Span>
        </Label>
      ))}
    </Div>
  );
}

export default CustomRadio;
