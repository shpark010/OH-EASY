import React from "react";
import styled from "styled-components";

const FooterContainer = styled.footer`
  height: 35px;
  min-height: 35px;
  border-top: 1px solid var(--color-primary-gray);
  font-size: 12px;
  position: fixed;
  bottom: 0;
  background-color: white;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 1640px;
  min-width: 1640px;
  height: 100%;
  margin: 0 auto;
  padding: 0 15px;
`;

class Footer extends React.Component {
  render() {
    return (
      <FooterContainer>
        <Wrapper>프로젝트 제작 : 이재훈, 박성환, 김의진, 조병국</Wrapper>
      </FooterContainer>
    );
  }
}

export default Footer;
