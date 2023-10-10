import React from "react";
import styled from "styled-components";

const Input = styled.input`
  width: ${(props) => props.width || "100px"};
  border-radius: 2px;
  border: 1px solid var(--color-primary-gray);
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
  height: 32px;
  padding: 0 12px;
  background-color: ${(props) => props.backgroundColor || "transparent"};
  font-weight: 700;
  font-family: "NanumSquare", sans-serif;

  &:focus {
    outline: 1px solid var(--color-primary-black);
  }

  ${(props) =>
    props.readOnly &&
    `
    background-color: var(--color-opacity-gray);
    cursor: not-allowed;
  `}
`;

//사이즈를 주면 그사이즈대로 안주면 100px
function CustomInput({
  type,
  width,
  id,
  className,
  value,
  onChange,
  name,
  onBlur,
  backgroundColor,
  readOnly,
  placeholder,
  maxLength,
  style,
  onKeyDown,
}) {
  const handleInputChange = (e) => {
    let newValue = e.target.value;

    if (type === "price") {
      // 쉼표(,) 제거 후 숫자만 남김
      newValue = newValue.replace(/,/g, "");
      // 숫자만 허용
      newValue = newValue.replace(/[^0-9]/g, "");
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

      // 14자리 이상 입력 방지
      if (newValue.length > 14) {
        newValue = newValue.substring(0, 14);
      }
    } else if (type === "email") {
      // 영문 및 숫자만 허용
      newValue = newValue.replace(/[^a-zA-Z0-9]/g, "");
    } else if (type === "number") {
      // 숫자만 허용
      newValue = newValue.replace(/[^0-9]/g, "");
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

  const handleKeyDown = (e) => {
    if (e.key === "Tab" || e.key === "Enter") {
      if (onKeyDown) {
        onKeyDown(e);
      }
    }
  };

  return (
    <Input
      type="text"
      id={id}
      className={className}
      width={`${width}px`}
      value={value}
      name={name}
      onBlur={onBlur}
      onChange={handleInputChange}
      backgroundColor={backgroundColor}
      readOnly={readOnly}
      placeholder={placeholder}
      maxLength={maxLength}
      style={style}
      onKeyDown={handleKeyDown}
    />
  );
}

export default CustomInput;
