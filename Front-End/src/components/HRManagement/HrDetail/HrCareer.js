import React from "react";
import Table from "../../Tables/Table";

const HrCareer = () => {
  return (
    <Table
      headers={[
        "입사일",
        "퇴사일",
        "근무기간",
        "직장명",
        "담당업무",
        "직급",
        "급여",
        "퇴직사유",
      ]}
    />
  );
};

export default HrCareer;
