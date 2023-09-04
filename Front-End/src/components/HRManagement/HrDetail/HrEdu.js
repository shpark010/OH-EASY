import React from "react";
import Table from "../../Tables/Table";

const HrEdu = () => {
  return (
    <Table
      headers={[
        "학교명",
        "입학일",
        "졸업일",
        "구분",
        "소재지",
        "전공과목",
        "부전공",
        "학위",
        "주야",
        "분교",
      ]}
    />
  );
};

export default HrEdu;
