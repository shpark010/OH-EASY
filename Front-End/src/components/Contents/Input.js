import React from "react";
import styled from "styled-components";

const InputTag = styled.input`
  width: 100%; /* td의 전체 영역을 차지 */
  height: 100%;
  border: none; /* 불필요한 테두리 제거 */
  background: transparent; /* 배경색 투명 */
  text-align: center; /* 입력된 텍스트 중앙 배치 */
  font-size: 15px;
  font-weight: 600;
  font-family: "NanumSquare", sans-serif;

  &:focus {
    /* 포커스 상태에서 테두리 표시 제거 */
    outline: none;
  }
`;

const defaultTdOnClick = (e) => {
  console.log("클릭 이벤트");
  e.currentTarget.style.border = "3px solid var(--color-primary-black)";
  e.currentTarget.style.backgroundColor = "var(--color-opacity-blue)";
  const tdNodes = Array.from(e.currentTarget.parentNode.parentNode.childNodes);
  tdNodes.forEach((td) => {
    td.style.backgroundColor = "var(--color-opacity-blue)";
    Array.from(td.childNodes).forEach((child) => {
      child.style.backgroundColor = "var(--color-opacity-blue)";
    });
  });
};
const defaultTdOnBlur = (e) => {
  console.log("블러 이벤트");
  e.currentTarget.style.border = "none";
  const tdNodes = Array.from(e.currentTarget.parentNode.parentNode.childNodes);
  console.log(tdNodes);
  tdNodes.forEach((td) => {
    td.style.backgroundColor = "var(--color-primary-white)";
    Array.from(td.childNodes).forEach((child) => {
      child.style.backgroundColor = "var(--color-primary-white)";
    });
  });
};
const defaultTdOnFocus = (e) => {
  console.log("포커스 이벤트");
  e.currentTarget.style.border = "3px solid var(--color-primary-black)";
  e.currentTarget.style.backgroundColor = "var(--color-opacity-blue)";
  const tdNodes = Array.from(e.currentTarget.parentNode.parentNode.childNodes);
  tdNodes.forEach((td) => {
    td.style.backgroundColor = "var(--color-opacity-blue)";
    Array.from(td.childNodes).forEach((child) => {
      child.style.backgroundColor = "var(--color-opacity-blue)";
    });
  });
};

// 커스텀 프라이스 인풋꺼
const handleChange = (e) => {
  //const { onChange } = this.props;
  const inputValue = e.target.value.replace(/[^0-9]/g, ""); // 숫자 외의 문자 제거
  //onChange(inputValue);
};

// 커스텀 프라이스 인풋꺼
const formatPrice = (value) => {
  // 숫자를 3자리 단위로 쉼표 추가해서 형식화
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// 커스텀 프라이스 인풋꺼
const handleKeyUp = (e) => {
  if (e.key === "Enter") {
    //   e.target.blur(); // Remove focus from the input field on Enter key
    this.props.onBlur();
  }
};

const handleInputChange = (e) => {
  this.props.setPrice(e.target.value);
};

const toggleEditing = () => {
  this.setEditing(!this.props.editing);
  console.log(this.props.editing);
};

// * 클릭이벤트 기본 defaultTdOnClick
// * 블러이벤트 기본 defaultTdOnBlur

// import Input from "../components/Contents/Input";
// 사용하고자 하는 js페이지마다 경로가 다르니 위 주소는 참고만

// <Input onBlur={따로 정의한 함수} /> 따로정의한 함수명을 주면
// 기본이벤트가 아닌 본인들이 만든 이벤트가 실행되니 참고

// 이외의 이벤트는 모두 받을수있으나 사용하고자하는 js에서 다 정의해서 보내야함
// ex) 마우스 오버이벤트를 추가하고 싶을 경우
// <Input onfocus={따로 정의한 함수 }

function Input(props) {
  const formattedValue = formatPrice(props.value.toString()); // toString()으로 value가 숫자인 경우 문자열로 변환

  if (props.inputType === "price") {
    return (
      <InputTag
        {...props}
        //spellCheck="false"
        type="text"
        id={props.id}
        className={props.className}
        value={formattedValue}
        onChange={handleChange}
        onBlur={null || props.onBlur}
        onKeyUp={handleKeyUp}
        onDoubleClick={toggleEditing}
        onFocus={props.onFocus || defaultTdOnFocus}
      />
    );
  } else {
    return (
      <InputTag
        {...props}
        spellCheck="false"
        onClick={props.onClick || defaultTdOnClick}
        onBlur={props.onBlur || defaultTdOnBlur}
        onFocus={props.onFocus || defaultTdOnFocus}
      />
    );
  }
}

export default Input;
