import React from "react";
import styled from "styled-components";

const Input = styled.input`
  width: ${(props) => props.width || "100px"};
  border-radius: 2px;
  border: 1px solid var(--color-primary-gray);
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
  height: 32px;
  padding: 0 5px;
  background-color: ${(props) => props.backgroundColor || "transparent"};
  font-weight: 700;
  font-family: "NanumSquare", sans-serif;

  &:focus {
    outline: 1px solid var(--color-primary-black);
  }
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
  onblur,
  backgroundColor,
  readOnly,
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

      // 13자리 이상 입력 방지
      if (newValue.length > 13) {
        newValue = newValue.substring(0, 13);
      }
    }

    if (onChange) {
      e.target.value = newValue;
      onChange(e);
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
      onBlur={onblur}
      onChange={handleInputChange}
      backgroundColor={backgroundColor}
      readOnly={readOnly}
    />
  );
}

export default CustomInput;
