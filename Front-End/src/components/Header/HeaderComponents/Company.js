import React from "react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import { useYear } from "../../../containers/YearContext";

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

const Company = (props) => {
  const { selectedYear, setSelectedYear } = useYear();
  const location = useLocation();

  const handleChange = (event) => {
    setSelectedYear(event.target.value);
  };

  // 경로가 '/main'이 아니면 셀렉트 박스를 비활성화
  const isDisabled = location.pathname !== "/main";
  return (
    <CompanyDiv>
      <CompanyNameSpan>{props.companyName}</CompanyNameSpan>
      <select
        name="targetYear"
        id="targetYear"
        className="targetYear companyYear selectBox blue"
        value={selectedYear}
        onChange={handleChange}
        disabled={isDisabled} // 셀렉트 박스의 disabled 속성 설정
      >
        <option value="2023">2023</option>
        <option value="2022">2022</option>
        <option value="2021">2021</option>
      </select>
    </CompanyDiv>
  );
};

export default Company;
