import React from "react";
import styled from "styled-components";
import Spinner from "../images/spinner3.gif";

export const Background = styled.div`
  position: absolute;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  /* background: gray; */
  background: none;
  z-index: 999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const LoadingText = styled.div`
  font-family: "NanumSquare", sans-serif;
  font-weight: 600;
  font-size: 50px;
  text-align: center;
`;

const Loading = () => {
  return (
    <Background>
      {/* <LoadingText>잠시만 기다려 주세요.</LoadingText> */}
      <img src={Spinner} alt="로딩중" width="20%" />
    </Background>
  );
};

export default Loading;
