import React from "react";

const HrCareer = () => {
  return (
    <div className="hrInfoDetailCareer">
      <table className="hrInfoDetailTable">
        <tr>
          <th>입사일</th>
          <th>퇴사일</th>
          <th>근무기간</th>
          <th>직장명</th>
          <th>담당업무</th>
          <th>직급</th>
          <th>급여</th>
          <th>퇴직사유</th>
        </tr>
        <tr>
          <td>2021.08</td>
          <td>2022.07</td>
          <td>1년</td>
          <td>한국소프트웨어협회</td>
          <td>사무보조</td>
          <td>책임</td>
          <td>300만</td>
          <td>그냥</td>
        </tr>
      </table>
    </div>
  );
};

export default HrCareer;
