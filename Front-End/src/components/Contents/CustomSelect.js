import React from "react";
import styled from "styled-components";

const SelectContainer = styled.div`
  &.searchBarBox {
    /* 여기에 .searchBarBox 스타일을 추가하세요 */
  }
`;

const StyledSelect = styled.select`
  width: ${(props) => (props.width ? `${props.width}px` : "100%")};
  /* 여기에 기본 select 스타일을 추가하세요 */
`;

function CustomSelect({
  id,
  className,
  options,
  value,
  defaultValue,
  width,
  onChange,
  placeholder, // 추가한 props
}) {
  const showPlaceholder = value === ""; // value가 ""이면 true, 아니면 false

  return (
    <SelectContainer className={`searchBarBox ${className}`}>
      <StyledSelect
        id={id}
        className="selectBox"
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        width={width}
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
