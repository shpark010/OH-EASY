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
  e.currentTarget.style.border = "3px solid var(--color-primary-black)";
  e.currentTarget.style.backgroundColor = "var(--color-opacity-blue)";
};
const defaultTdOnBlur = (e) => {
  e.currentTarget.style.border = "none";
  e.currentTarget.style.backgroundColor = "var(--color-opacity-white)";
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
  return (
    <InputTag
      {...props}
      spellCheck="false"
      onClick={props.onClick || defaultTdOnClick}
      onBlur={props.onBlur || defaultTdOnBlur}
    />
  );
}

export default Input;
