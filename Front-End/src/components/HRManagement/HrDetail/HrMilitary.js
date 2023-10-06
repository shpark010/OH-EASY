import React, { useRef, useState, useEffect } from "react";
import CustomInput from "../../Contents/CustomInput";
import CustomCalender from "../../Contents/CustomCalendar";
import CustomSelect from "../../Contents/CustomSelect";
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
  const [militaryDataCopy, setMilitaryDataCopy] = useState({
    ...defaultMilitaryData,
  });

  const handleInputBlur = async (e) => {
    const { name, value } = e.target;
    if (!cdEmp || value === "") {
      return;
    }
    console.log(militaryDataCopy[name]);
    if (value === militaryDataCopy[name]) {
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
    setMilitaryDataCopy((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSelectChange = async (e, columns) => {
    if (cdEmp === undefined || cdEmp == null || cdEmp === "") {
      return;
    }
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
    if (!cdEmp) {
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
        setMilitaryDataCopy({
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
                readOnly={true}
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
                readOnly={true}
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
                onKeyDown={handleInputBlur}
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
                onKeyDown={handleInputBlur}
                onBlur={handleInputBlur}
                onChange={handleInputChange}
              />
            </td>
          </tr>
          <tr>
            <th>병역기간</th>
            <td>
              <CustomInput
                width={"50"}
                name={"mmMilitary"}
                value={militaryData.mmMilitary || ""}
                onKeyDown={handleInputBlur}
                onBlur={handleInputBlur}
                onChange={handleInputChange}
              />
              <span> 개월 </span>
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
  );
};

export default HrMilitary;
