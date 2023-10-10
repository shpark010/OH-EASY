import React from "react";
import styled from "styled-components";

const PageHeaderNameStyle = styled.h2`
  font-size: 20px;
  .ReactModalPortal & {
    padding-bottom: 20px;
    font-size: 18px;
  }
`;

const PageHeaderName = ({ text }) => {
  return <PageHeaderNameStyle>{text}</PageHeaderNameStyle>;
};

export default PageHeaderName;
