import React from "react";
import Table from "../../Tables/Table";

const HrLicense = () => {
  return (
    <Table
      headers={[
        "구분",
        "자격증(외국어명",
        "급수(구사력)",
        "취득일",
        "자격번호",
        "발행기관명",
      ]}
    />
    // <div className="hrInfoDetailLicense">
    //   <table className="hrInfoDetailTable">
    //     <thead>
    //       <tr>
    //         <th>구분</th>
    //         <th>자격증(외국어명)</th>
    //         <th>급수(구사력)</th>
    //         <th>취득일</th>
    //         <th>자격번호</th>
    //         <th>발행기관명</th>
    //       </tr>
    //     </thead>
    //     <tbody>
    //       <tr>
    //         <td>자격증</td>
    //         <td>정보처리기사</td>
    //         <td></td>
    //         <td>2021.05</td>
    //         <td></td>
    //         <td>한국산업인력공단</td>
    //       </tr>
    //     </tbody>
    //   </table>
    // </div>
  );
};

export default HrLicense;
