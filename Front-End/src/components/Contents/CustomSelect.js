import React from "react";
import styled from "styled-components";

const SelectContainer = styled.div`
  &.customSelect {
    /* 여기에 .customSelect 스타일을 추가하세요 */
  }
`;

const StyledSelect = styled.select`
  width: ${(props) => (props.width ? `${props.width}px` : "100%")};
  pointer-events: ${(props) => (props.readOnly ? "none" : "auto")}; // 클릭 방지
  cursor: ${(props) => (props.readOnly ? "not-allowed" : "pointer")};
  color: black;
  &:disabled {
    cursor: not-allowed;
    background-color: var(--color-opacity-gray);
  }
`;
function CustomSelect({
  id,
  className,
  options,
  value,
  defaultValue,
  width,
  onChange,
  placeholder,
  readOnly,
  disabled,
}) {
  const showPlaceholder = value === ""; // value가 ""이면 true, 아니면 false

  return (
    <SelectContainer className={`customSelect ${className}`}>
      <StyledSelect
        id={id}
        className="selectBox"
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        width={width}
        readOnly={readOnly}
        disabled={disabled}
      >
        {placeholder && (
          <option value="" disabled hidden={!showPlaceholder}>
            {placeholder}
          </option>
        )}
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </StyledSelect>
    </SelectContainer>
  );
}

export default CustomSelect;
