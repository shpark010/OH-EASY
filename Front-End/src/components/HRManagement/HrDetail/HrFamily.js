import React from "react";
import Table from "../../Tables/Table";

const HrFamily = (empCode) => {
  console.log("가족탭********************");
  console.log(empCode);

  return (
    <Table
      headers={[
        "연말정산관계",
        "성명",
        "주민번호",
        "가족관계",
        "학력",
        "졸업구분",
        "동거",
        "양음",
        "생년월일",
        "직업",
        "직장명",
        "직급",
      ]}
      colWidths={["8%"]}
    />
  );
};

export default HrFamily;
