import React from "react";
import styled from "styled-components";

const PageHeaderTextButtonStyle = styled.button``;

const PageHeaderTextButton = ({ text }) => {
  return <PageHeaderTextButtonStyle>{text}</PageHeaderTextButtonStyle>;
};

export default PageHeaderTextButton;
