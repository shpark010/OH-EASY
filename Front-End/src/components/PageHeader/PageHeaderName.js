import React from "react";
import styled from "styled-components";

const PageHeaderNameStyle = styled.h2`
  font-size: 20px;
`;

const PageHeaderName = ({ text }) => {
  return <PageHeaderNameStyle>{text}</PageHeaderNameStyle>;
};

export default PageHeaderName;
