import React from "react";
import Table from "../../TablesLib/Table";
import useApiRequest from "../../Services/ApiRequest";

const HrEdu = ({ cdEmp }) => {
  const apiRequest = useApiRequest();
  console.log("학력 페이지 ******");
  console.log(cdEmp);
  return <div></div>;
};

export default HrEdu;
