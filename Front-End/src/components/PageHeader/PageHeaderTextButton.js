import React from "react";
import styled from "styled-components";

const PageHeaderTextButtonStyle = styled.button``;

const PageHeaderTextButton = ({ text, onClick }) => {
  return (
    <PageHeaderTextButtonStyle onClick={onClick}>
      {text}
    </PageHeaderTextButtonStyle>
  );
};

export default PageHeaderTextButton;
