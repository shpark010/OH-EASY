import React, { useRef, useState, useEffect } from "react";
import CustomButton from "../../Contents/CustomButton";
import CustomInput from "../../Contents/CustomInput";
import Input from "../../Contents/Input";
import CustomCalender from "../../Contents/CustomCalendar";
import CustomSelect from "../../Contents/CustomSelect";

import CustomRadio from "../../Contents/CustomRadio";
import useApiRequest from "../../Services/ApiRequest";

const defaultMilitaryData = {
  cdEmp: "", // 사원코드
  fgMilitaryDischarge: "", // 제대구분
  fgMilitaryService: "", // 병역구분
  dcExemption: "", // 면제사유
  dtMilitaryStart: "", // 복무시작일
  dtMilitaryEnd: "", // 복무종료일
  yyMilitary: "", //  병역기간 (년)
  mmMilitary: "", //   병역기간 (월)
  ddMilitary: "", // 병역기간 (일)
  fgMilitaryType: "", // 군별 육군/해군
  dcClassMilitary: "", // 병과
  fgMilitaryRank: "", // 계급
};

const HrMilitary = ({ cdEmp }) => {
  const apiRequest = useApiRequest();
  const [militaryData, setMilitaryData] = useState({ ...defaultMilitaryData });

  const handleInputBlur = async (e) => {
    console.log("블러이벤 ****************************");
    const { name, value } = e.target;
    if (cdEmp == null || cdEmp === "" || cdEmp === undefined || value === "") {
      return;
    }

    try {
      const responseData = await apiRequest({
        method: "GET",
        url: `/api2/hr/updateMilitaryData?cdEmp=${cdEmp}&${name}=${value}`,
      });
      console.log("API Response:", responseData);
    } catch (error) {
      console.error("Failed to fetch emp data:", error);
    }
    setMilitaryData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSelectChange = async (e, columns) => {
    if (cdEmp === undefined || cdEmp == null || cdEmp === "") {
      return;
    }
    console.log("handleSelectChange 이벤 ***********");
    const { name, value } = e.target;
    console.log(name);
    console.log(value);
    try {
      const responseData = await apiRequest({
        method: "GET",
        url: `/api2/hr/updateMilitaryData?cdEmp=${cdEmp}&${columns}=${value}`,
      });
    } catch (error) {
      console.error("Failed to fetch emp data:", error);
    }
    console.log("*************");
    console.log(columns);
    console.log(value);
    console.log("*************");

    setMilitaryData((prevState) => ({
      ...prevState,
      [columns]: value,
    }));
  };

  const handleDateChange = async (value, name) => {
    if (cdEmp === undefined) {
      return;
    }
    value = value.replace(/-/g, "");
    try {
      const responseData = await apiRequest({
        method: "GET",
        url: `/api2/hr/updateMilitaryData?cdEmp=${cdEmp}&${name}=${value}`,
      });
    } catch (error) {
      console.error("Failed to fetch emp data:", error);
    }
    setMilitaryData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (cdEmp === undefined || cdEmp === null || cdEmp === "") {
      setMilitaryData(defaultMilitaryData);
      return;
    }

    const handleGetEmpBasicData = async (cdEmp) => {
      try {
        const responseData = await apiRequest({
          method: "GET",
          url: `/api2/hr/getMilitaryData?cdEmp=${cdEmp}`,
        });
        setMilitaryData({
          ...defaultMilitaryData,
          ...responseData,
        });
      } catch (error) {
        console.error("Failed to fetch emp data:", error);
      }
    };

    handleGetEmpBasicData(cdEmp);
  }, [cdEmp]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log("인풋값변경~~~~~~~~~~~~~~~~~");
    console.log(value);
    setMilitaryData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  return (
    <div className="hrBody borderTopBold">
      <table className="table">
        <tbody>
          <tr>
            <th>제대구분</th>
            <td>
              <CustomSelect
                options={[
                  { value: "0", label: "미선택" },
                  { value: "10100", label: "만기제대" },
                  { value: "10200", label: "의병제대" },
                  { value: "10300", label: "의가사제대" },
                  { value: "10400", label: "소집해제" },
                ]}
                placeholder="선택"
                value={militaryData.fgMilitaryDischarge || "0"}
                onChange={(e) => handleSelectChange(e, "fgMilitaryDischarge")}
              />
            </td>
          </tr>
          <tr>
            <th>복무시작일</th>
            <td>
              <CustomCalender
                width={212}
                className="hrInfoBaseInput"
                value={militaryData.dtMilitaryStart}
                name="dtMilitaryStart"
                onChange={(e) => handleDateChange(e, "dtMilitaryStart")}
              />
            </td>
          </tr>
          <tr>
            <th>군별</th>
            <td>
              <CustomSelect
                options={[
                  { value: "0", label: "미선택" },
                  { value: "40100", label: "육군" },
                  { value: "40200", label: "해군" },
                  { value: "40300", label: "공군" },
                  { value: "40400", label: "의무경찰" },
                ]}
                placeholder="선택"
                value={militaryData.fgMilitaryType || "0"}
                onChange={(e) => handleSelectChange(e, "fgMilitaryType")}
              />
            </td>
          </tr>
        </tbody>
        <tbody>
          <tr>
            <th>병역구분</th>
            <td>
              <CustomSelect
                options={[
                  { value: "0", label: "미선택" },
                  { value: "20100", label: "현역" },
                  { value: "20200", label: "공익근무" },
                  { value: "20300", label: "방위산업체" },
                  { value: "20400", label: "기간산업체" },
                  { value: "20500", label: "산업기능" },
                  { value: "20600", label: "미필" },
                  { value: "20700", label: "면제" },
                ]}
                placeholder="선택"
                value={militaryData.fgMilitaryService || "0"}
                onChange={(e) => handleSelectChange(e, "fgMilitaryService")}
              />
            </td>
          </tr>
          <tr>
            <th>복무종료일</th>
            <td>
              <CustomCalender
                className="hrInfoBaseInput"
                value={militaryData.dtMilitaryEnd}
                name="dtMilitaryEnd"
                onChange={(e) => handleDateChange(e, "dtMilitaryEnd")}
              />
            </td>
          </tr>
          <tr>
            <th>병과</th>
            <td>
              <CustomInput
                width={212}
                name={"dcClassMilitary"}
                value={militaryData.dcClassMilitary || ""}
                onBlur={handleInputBlur}
                onChange={handleInputChange}
              />
            </td>
          </tr>
        </tbody>
        <tbody>
          <tr>
            <th>면제사유</th>
            <td>
              <CustomInput
                width={212}
                name={"dcExemption"}
                value={militaryData.dcExemption || ""}
                onBlur={handleInputBlur}
                onChange={handleInputChange}
              />
            </td>
          </tr>
          <tr>
            <th>병역기간</th>
            <td>
              <CustomInput
                width={"40"}
                name={"yyMilitary"}
                value={militaryData.yyMilitary || ""}
                onBlur={handleInputBlur}
                onChange={handleInputChange}
              />
              <span> 년 </span>
              <CustomInput
                width={"40"}
                name={"mmMilitary"}
                value={militaryData.mmMilitary || ""}
                onBlur={handleInputBlur}
                onChange={handleInputChange}
              />
              <span> 개월 </span>
              <CustomInput
                width={"40"}
                name={"ddMilitary"}
                value={militaryData.ddMilitary || ""}
                onBlur={handleInputBlur}
                onChange={handleInputChange}
              />
              <span> 일 </span>
            </td>
          </tr>
          <tr>
            <th>계급</th>
            <td>
              <CustomSelect
                options={[
                  { value: "0", label: "미선택" },
                  { value: "30100", label: "이병" },
                  { value: "30200", label: "일병" },
                  { value: "30300", label: "상병" },
                  { value: "30400", label: "병장" },
                  { value: "30500", label: "하사" },
                  { value: "30600", label: "중사" },
                  { value: "30700", label: "상사" },
                  { value: "30800", label: "원사" },
                  { value: "30900", label: "준사관" },
                  { value: "30950", label: "장교" },
                ]}
                placeholder="선택"
                value={militaryData.fgMilitaryRank || "0"}
                onChange={(e) => handleSelectChange(e, "fgMilitaryRank")}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    // <div className="hrDetail borderTopBold">
    //   <div className="hrDetailTitle">
    //     <p>제대구분</p>
    //     <p>복무시작일</p>
    //     <p>군별</p>
    //   </div>
    //   <div className="hrDetailInputBox">
    //     <CustomSelect
    //       className={"hrDetailSelect"}
    //       options={[
    //         { value: "AB", label: "0. 만기제대" },
    //         { value: "A", label: "1. 의병제대" },
    //         { value: "B", label: "2. 의가사제대" },
    //         { value: "O", label: "4. 소집해제" },
    //       ]}
    //       defaultValue="AB"
    //       width="200"
    //     />
    //     <CustomCalender className="hrInfoBaseInput" width="200" />
    //     <CustomSelect
    //       className={"hrDetailSelect"}
    //       options={[
    //         { value: "AB", label: "0. 육군" },
    //         { value: "A", label: "1. 해군" },
    //         { value: "B", label: "2. 공군" },
    //         { value: "O", label: "4. ROTC" },
    //       ]}
    //       defaultValue="AB"
    //       width="200"
    //     />
    //   </div>
    //   <div className="hrDetailTitle">
    //     <p>병역구분</p>
    //     <p>복무종료일</p>
    //     <p>병과</p>
    //   </div>
    //   <div className="hrInputBox">
    //     <CustomSelect
    //       className={"hrDetailSelect"}
    //       options={[
    //         { value: "AB", label: "0. 현역" },
    //         { value: "A", label: "1. 공익근무" },
    //         { value: "B", label: "2. 방위산업체" },
    //         { value: "O", label: "4. 기간산업체" },
    //         { value: "O", label: "5. 산업기능" },
    //         { value: "O", label: "6. 미필" },
    //         { value: "O", label: "7. 면제" },
    //       ]}
    //       defaultValue="AB"
    //       width="200"
    //     />
    //     <CustomCalender className="hrInfoBaseInput" width="200" />
    //     <CustomInput className="hrDetailInput" width="200" />
    //   </div>
    //   <div className="hrDetailTitle">
    //     <p>면제사유</p>
    //     <p>병역기간</p>
    //     <p>계급</p>
    //   </div>
    //   <div className="hrInputBox">
    //     <CustomInput className="hrDetailInput" width="200" />
    //     <CustomInput className="hrDetailInput" width="200" />
    //     <CustomSelect
    //       className={"hrDetailSelect"}
    //       options={[
    //         { value: "AB", label: "0. 이병" },
    //         { value: "A", label: "1. 일병" },
    //         { value: "B", label: "2.상병" },
    //         { value: "O", label: "4. 병장" },
    //         { value: "O", label: "5. 하사" },
    //         { value: "O", label: "6. 중사" },
    //         { value: "O", label: "7. 상사" },
    //         { value: "O", label: "8. 원사" },
    //         { value: "O", label: "9. 준사관" },
    //         { value: "O", label: "10. 장교" },
    //       ]}
    //       defaultValue="AB"
    //       width="200"
    //     />
    //   </div>
    // </div>
  );
};

export default HrMilitary;
