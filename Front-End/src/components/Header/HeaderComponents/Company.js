import React, { Component } from "react";
import styled from "styled-components";

const CompanyDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: 15px;
`;

const CompanyNameSpan = styled.span`
  display: inline-block;
  padding-right: 15px;
  font-size: 16px;
  font-weight: 600;
`;

class Company extends Component {
  render() {
    return (
      <CompanyDiv>
        <CompanyNameSpan>(주)로그인시회원데이터로가져옴</CompanyNameSpan>
        <select
          name="targetYear"
          id="targetYear"
          className="targetYear companyYear selectBox blue"
          defaultValue="2022"
        >
          <option value="2022">2022</option>
          <option value="2021">2021</option>
          <option value="2020">2020</option>
          <option value="2019">2019</option>
        </select>
      </CompanyDiv>
    );
  }
}

export default Company;
