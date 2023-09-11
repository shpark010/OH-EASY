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
  onEnterPress,
  onTabPress,
  isDoubleClick,
  onChange,
  type,
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
    setReadOnlyState(true);
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
    clearTimeout(singleClickTimer);

    singleClickTimer = setTimeout(() => {
      if (otherProps.onClick) {
        otherProps.onClick(e);
      }
    }, 200);
  };

  const handleDoubleClick = (e) => {
    e.preventDefault();
    clearTimeout(singleClickTimer);

    if (isDoubleClick) {
      setReadOnlyState(false);

      const inputElement = e.target;
      const endOfInput = inputElement.value.length;
      inputElement.selectionStart = endOfInput;
      inputElement.selectionEnd = endOfInput;
    }
  };

  const handleInputChange = (e) => {
    let newValue = e.target.value;

    if (onChange) {
      e.target.value = newValue;
      onChange(e);
    }
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
      onChange={handleInputChange}
    />
  );
}

export default React.memo(Input);
