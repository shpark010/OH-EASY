import React, { useState } from "react";
import styled from "styled-components";

const InputTag = styled.input`
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  background: transparent;
  text-align: center;
  font-size: 15px;
  font-weight: 600;
  font-family: "NanumSquare", sans-serif;
  color: var(--color-primary-gray);
  cursor: pointer;

  .doubleLine {
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
    //cursor: not-allowed;
  }
`;

function formatPrice(value) {
  // 세 자리마다 쉼표 추가
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function unformatPrice(value) {
  // 쉼표 제거
  return value.replace(/,/g, "");
}

function Input({
  type,
  onEnterPress,
  onTabPress,
  isDoubleClick,
  ...otherProps
}) {
  const [readOnlyState, setReadOnlyState] = useState(true);

  let singleClickTimer;
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && onEnterPress) {
      onEnterPress(e);
    }

    if (e.key === "Tab" && onTabPress) {
      onTabPress(e);
    }
  };

  const handleBlur = (e) => {
    console.log("input : 블러이벤트");
    setReadOnlyState(true);
    if (otherProps.onBlur) {
      otherProps.onBlur(e);
    }
  };

  const handleFocus = (e) => {
    if (otherProps.onFocus) {
      otherProps.onFocus(e);
    }
    console.log("input : 포커스이벤트");
  };

  const handleClick = (e) => {
    clearTimeout(singleClickTimer); // 더블 클릭 시 타이머를 초기화

    singleClickTimer = setTimeout(() => {
      if (otherProps.onClick) {
        otherProps.onClick(e);
      }
      console.log("input : 한번클릭이벤트");
    }, 200); // 200ms 후에 단일 클릭 핸들러를 실행
  };

  const handleDoubleClick = (e) => {
    e.preventDefault();
    clearTimeout(singleClickTimer); // 단일 클릭의 타이머를 제거하여 단일 클릭 핸들러를 실행하지 않습니다.

    if (isDoubleClick) {
      setReadOnlyState(false);

      // 입력 필드의 커서 위치를 끝으로 이동
      const inputElement = e.target;
      const endOfInput = inputElement.value.length;

      inputElement.selectionStart = endOfInput;
      inputElement.selectionEnd = endOfInput;
    }
    console.log("input : 더블클릭이벤트");
  };

  return (
    <InputTag
      {...otherProps}
      spellCheck="false"
      readOnly={readOnlyState}
      onClick={handleClick}
      onBlur={handleBlur}
      onFocus={handleFocus}
      onKeyDown={handleKeyDown}
      onDoubleClick={handleDoubleClick}
    />
  );
}
export default React.memo(Input);
