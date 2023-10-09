import React, { useState } from "react";
import styled from "styled-components";

const InputTag = styled.input`
  width: ${(props) => props.width || "100%"};
  height: 100%;
  border: none;
  outline: none;
  background: transparent;
  text-align: ${(props) => (props.$align === "right" ? "right" : "center")};
  padding-right: ${(props) => (props.$align === "right" ? "15px" : "0")};
  font-size: 15px;
  font-weight: 600;
  font-family: "NanumSquare", sans-serif;
  color: var(--color-primary-gray);
  cursor: pointer;

  &.doubleLine {
    border: none;
    color: var(--color-primary-gray);
    font-weight: 600;
  }

  &.doubleLine:focus {
    border: 3px ridge var(--color-primary-black);
    color: var(--color-primary-black);
    font-weight: 900;
  }

  &[readOnly] {
    /* cursor: not-allowed; */
  }
`;

function Input({
  isDoubleClick,
  onChange,
  type,
  readOnly,
  align,
  style,
  ...otherProps
}) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && otherProps.onKeyDown) {
      console.log("enter");
      otherProps.onKeyDown(e);
      e.target.blur();
    }

    if (e.key === "Tab" && otherProps.onKeyDown) {
      otherProps.onKeyDown(e);
      e.target.blur();
    }
  };

  const handleBlur = (e) => {
    if (otherProps.onBlur) {
      otherProps.onBlur(e);
    }
  };

  const handleFocus = (e) => {
    if (otherProps.onFocus) {
      otherProps.onFocus(e);
    }
  };

  const handleClick = (e) => {
    if (otherProps.onClick) {
      otherProps.onClick(e);
    }
  };

  const handleDoubleClick = (e) => {
    if (otherProps.onDoubleClick) {
      otherProps.onDoubleClick(e);
    }
  };

  const handleInputChange = (e) => {
    let newValue = e.target.value;

    if (type === "price") {
      // 쉼표(,) 제거 후 숫자만 남김
      newValue = newValue.replace(/,/g, "");
      // 숫자만 허용
      newValue = newValue.replace(/[^0-9]/g, "");
      // 숫자의 자리수가 18자리를 넘지 않도록 확인
      if (newValue.length > 14) {
        newValue = newValue.substring(0, 14); // 처음 14자리만 남김
      }
      // 앞에 0을 제거
      newValue = newValue.replace(/^0+/, "");
      // 3자리마다 쉼표 추가
      newValue = newValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      // newValue = Number(newValue).toLocaleString("ko-KR");
    } else if (type === "resident") {
      // 숫자만 허용
      newValue = newValue.replace(/[^0-9]/g, "");

      // 6자리 이상 입력 후 '-' 추가
      if (newValue.length > 6) {
        newValue = newValue.substring(0, 6) + "-" + newValue.substring(6);
      }

      // 14자리 이상 입력 방지 ('-' 포함)
      if (newValue.length > 14) {
        newValue = newValue.substring(0, 14);
      }
    } else if (type === "figure") {
      // 정수 또는 소수만 허용하는 정규 표현식
      newValue = newValue.replace(/[^0-9.]/g, "");

      // 소수점이 두 번 이상 등장하지 않도록 처리
      const decimalPoints = newValue.split(".").length - 1;
      if (decimalPoints > 1) {
        newValue = newValue.substr(0, newValue.lastIndexOf("."));
      }
    }

    if (onChange) {
      e.target.value = newValue;
      onChange(e);
    }
  };

  return (
    <InputTag
      $align={align}
      {...otherProps}
      $inputType={type}
      //spellCheck="false"
      style={style}
      readOnly={readOnly}
      onClick={handleClick}
      onBlur={handleBlur}
      onFocus={handleFocus}
      onKeyDown={handleKeyDown}
      onChange={handleInputChange}
      onDoubleClick={handleDoubleClick}
    />
  );
}

export default React.memo(Input);
