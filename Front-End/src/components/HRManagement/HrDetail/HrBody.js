import React, { useRef, useState, useEffect } from "react";
import CustomButton from "../../Contents/CustomButton";
import CustomInput from "../../Contents/CustomInput";
import Input from "../../Contents/Input";
import CustomCalender from "../../Contents/CustomCalendar";
import CustomSelect from "../../Contents/CustomSelect";

import CustomRadio from "../../Contents/CustomRadio";
import useApiRequest from "../../Services/ApiRequest";
const defaultBodyData = {
  cdEmp: "", // 사원코드
  lenBody: "", // 신장
  wgtBody: "", // 체중
  nclBloodMin: "", //  최저혈압
  nclBloodMax: "", // 최대혈압
  lenBust: "", // 가슴둘레
  dcCaseHistory: "", // 병력
  fgBloodType: "", // 혈액형
  fgEye: "", // 색신
  leftEyesight: "", // 시력(좌)
  rightEyesight: "", // 시력(우)
  apilityHearing: "", // 청력
  fgObstacle: "", //장애구분
  fgVerterans: "", //보훈구분
  lvObstacle: "", //장애등급
  lvVerterans: "", //보훈등급
  relationVerterans: "", //보훈관계
};

const HrBody = ({ cdEmp }) => {
  const apiRequest = useApiRequest();
  const [bodyData, setBodyData] = useState({ ...defaultBodyData });

  const handleInputBlur = async (e) => {
    console.log("블러이벤 ****************************");
    const { name, value } = e.target;
    if (cdEmp == null || cdEmp === "" || cdEmp === undefined || value === "") {
      return;
    }

    try {
      const responseData = await apiRequest({
        method: "GET",
        url: `/api2/hr/updateBodyData?cdEmp=${cdEmp}&${name}=${value}`,
      });
      console.log("API Response:", responseData);
    } catch (error) {
      console.error("Failed to fetch emp data:", error);
    }
    setBodyData((prevState) => ({
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
        url: `/api2/hr/updateBodyData?cdEmp=${cdEmp}&${columns}=${value}`,
      });
    } catch (error) {
      console.error("Failed to fetch emp data:", error);
    }
    console.log("*************");
    console.log(columns);
    console.log(value);
    console.log("*************");

    setBodyData((prevState) => ({
      ...prevState,
      [columns]: value,
    }));
  };
  useEffect(() => {
    if (cdEmp === undefined || cdEmp === null || cdEmp === "") {
      setBodyData(defaultBodyData);
      return;
    }

    const handleGetEmpBasicData = async (cdEmp) => {
      try {
        const responseData = await apiRequest({
          method: "GET",
          url: `/api2/hr/getBodyData?cdEmp=${cdEmp}`,
        });
        setBodyData({
          ...defaultBodyData,
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
    setBodyData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className="hrBody borderTopBold">
      <table className="table">
        <tbody>
          <tr>
            <th>신장</th>
            <td>
              <CustomInput
                width={100}
                name={"lenBody"}
                onBlur={handleInputBlur}
                onChange={handleInputChange}
                value={bodyData.lenBody || ""}
              />
              <span> cm</span>
            </td>
          </tr>
          <tr>
            <th>가슴둘레</th>
            <td>
              <CustomInput
                width={100}
                name={"lenBust"}
                onBlur={handleInputBlur}
                onChange={handleInputChange}
                value={bodyData.lenBust || ""}
              />
              <span> cm</span>
            </td>
          </tr>
          <tr>
            <th>색신</th>
            <td>
              <CustomInput
                width={200}
                name={"fgEye"}
                onBlur={handleInputBlur}
                onChange={handleInputChange}
                value={bodyData.fgEye || ""}
              />
            </td>
          </tr>
          <tr>
            <th>청력</th>
            <td>
              <CustomRadio
                name="apilityHearing"
                classNameBox="hrInfoBaseBox"
                classNameRadio="classNameRadio"
                options={[
                  ["이상없음", "0"],
                  ["이상", "1"],
                ]}
                value={bodyData.apilityHearing || "0"}
                onChange={handleInputBlur}
              />
            </td>
          </tr>
          <tr>
            <th>장애등급</th>
            <td>
              <CustomSelect
                options={[
                  { value: "0", label: "없음" },
                  { value: "1", label: "1등급" },
                  { value: "2", label: "2등급" },
                  { value: "3", label: "3등급" },
                ]}
                placeholder="선택"
                value={bodyData.lvObstacle || "0"}
                onChange={(e) => handleSelectChange(e, "lvObstacle")}
              />
            </td>
          </tr>
        </tbody>
        <tbody>
          <tr>
            <th>체중</th>
            <td>
              <CustomInput
                width={100}
                name={"wgtBody"}
                onBlur={handleInputBlur}
                onChange={handleInputChange}
                value={bodyData.wgtBody || ""}
              />
              <span> kg</span>
            </td>
          </tr>
          <tr>
            <th>병력</th>
            <td>
              <CustomInput
                width={200}
                name={"dcCaseHistory"}
                onBlur={handleInputBlur}
                onChange={handleInputChange}
                value={bodyData.dcCaseHistory || ""}
              />
            </td>
          </tr>
          <tr>
            <th>시력(좌)</th>
            <td>
              <CustomInput
                width={100}
                name={"leftEyesight"}
                onBlur={handleInputBlur}
                onChange={handleInputChange}
                value={bodyData.leftEyesight || ""}
              />
            </td>
          </tr>
          <tr>
            <th>장애구분</th>
            <td>
              <CustomInput
                width={200}
                name={"fgObstacle"}
                onBlur={handleInputBlur}
                onChange={handleInputChange}
                value={bodyData.fgObstacle || ""}
              />
            </td>
          </tr>
          <tr>
            <th>보훈등급</th>
            <td>
              <CustomSelect
                options={[
                  { value: "0", label: "미선택" },
                  { value: "1.1", label: "1급1항" },
                  { value: "1.2", label: "1급2항" },
                  { value: "1.3", label: "1급3항" },
                  { value: "2", label: "2급" },
                  { value: "3", label: "3급" },
                  { value: "4", label: "4급" },
                  { value: "5", label: "5급" },
                  { value: "6", label: "6급1항" },
                  { value: "6.2", label: "6급2항" },
                  { value: "6.3", label: "6급3항" },
                  { value: "7", label: "7급" },
                ]}
                placeholder="선택"
                value={bodyData.lvVerterans || ""}
                onChange={(e) => handleSelectChange(e, "lvVerterans")}
              />
            </td>
          </tr>
        </tbody>
        <tbody>
          <tr>
            <th>혈압</th>
            <td>
              <CustomInput
                width={80}
                name={"nclBloodMin"}
                onBlur={handleInputBlur}
                onChange={handleInputChange}
                value={bodyData.nclBloodMin || ""}
              />
              <span> ~ </span>
              <CustomInput
                width={80}
                name={"nclBloodMax"}
                onBlur={handleInputBlur}
                onChange={handleInputChange}
                value={bodyData.nclBloodMax || ""}
              />
              <span> mb </span>
            </td>
          </tr>
          <tr>
            <th>혈액형</th>
            <td>
              <CustomSelect
                options={[
                  { value: "0", label: "미선택" },
                  { value: "1", label: "AB형" },
                  { value: "2", label: "A형" },
                  { value: "3", label: "B형" },
                  { value: "4", label: "O형" },
                ]}
                placeholder="선택"
                value={bodyData.fgBloodType || "0"}
                onChange={(e) => handleSelectChange(e, "fgBloodType")}
              />
            </td>
          </tr>
          <tr>
            <th>시력(우)</th>
            <td>
              <CustomInput
                width={100}
                name={"rightEyesight"}
                onBlur={handleInputBlur}
                onChange={handleInputChange}
                value={bodyData.rightEyesight || ""}
              />
            </td>
          </tr>
          <tr>
            <th>보훈구분</th>
            <td>
              <CustomInput
                width={100}
                name={"fgVerterans"}
                onBlur={handleInputBlur}
                onChange={handleInputChange}
                value={bodyData.fgVerterans || ""}
              />
            </td>
          </tr>
          <tr>
            <th>보훈관계</th>
            <td>
              <CustomSelect
                options={[
                  { value: "미선택", label: "미선택" },
                  { value: "본인", label: "본인" },
                  { value: "배우자", label: "배우자" },
                  { value: "자녀", label: "자녀" },
                  { value: "제매", label: "제매" },
                ]}
                placeholder="선택"
                value={bodyData.relationVerterans || "미선택"}
                onChange={(e) => handleSelectChange(e, "relationVerterans")}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default HrBody;
