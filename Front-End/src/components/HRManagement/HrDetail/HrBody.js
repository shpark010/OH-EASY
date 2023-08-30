import React from "react";
import CustomInput from "../../Contents/CustomInput";
import CustomRadio from "../../Contents/CustomRadio";
import CustomSelect from "../../Contents/CustomSelect";

const HrBody = () => {
  return (
    <div className="hrDetail">
      <div className="hrDetailTitle">
        <p>신장</p>
        <p>가슴둘레</p>
        <p>색신</p>
        <p>청력</p>
        <p>장애등급</p>
      </div>
      <div className="hrDetailInputBox">
        <div className="hrDetailText">
          <CustomInput width="100" />
          <p>cm</p>
        </div>
        <div className="hrDetailText">
          <CustomInput width="100" />
          <p>cm</p>
        </div>
        <CustomInput className="hrDetailInput" width="200" />
        <CustomRadio
          className="hrDetailInput"
          name="ear"
          options={[
            ["이상없음", "0"],
            ["이상", "1"],
          ]}
        />
        <CustomInput className="hrDetailInput" width="200" />
      </div>
      <div className="hrDetailTitle">
        <p>체중</p>
        <p>병력</p>
        <p>시력(좌)</p>
        <p>장애구분</p>
        <p>보훈등급</p>
      </div>
      <div className="hrDetailBox">
        <div className="hrDetailText">
          <CustomInput width="100" /> <p>kg</p>
        </div>
        <CustomInput className="hrDetailInput" width="200" />
        <CustomInput className="hrDetailInput" width="100" />
        <CustomInput className="hrDetailInput" width="200" />
        <CustomInput className="hrDetailInput" width="200" />
      </div>
      <div className="hrDetailTitle">
        <p>혈압</p>
        <p>혈액형</p>
        <p>시력(우)</p>
        <p>보훈구분</p>
        <p>보훈관계</p>
      </div>
      <div className="hrDetailBox">
        <div className="hrDetailText">
          <CustomInput width="100" /> <p>~</p>
          <CustomInput width="100" /> <p>mb</p>
        </div>
        <CustomSelect
          className={"hrDetailSelect"}
          options={[
            { value: "AB", label: "0. AB" },
            { value: "A", label: "1. A" },
            { value: "B", label: "2. B" },
            { value: "O", label: "4. O" },
          ]}
          defaultValue="AB"
        />
        <CustomInput className="hrDetailInput" width="100" />
        <CustomInput className="hrDetailInput" width="200" />
        <CustomInput className="hrDetailInput" width="200" />
      </div>
    </div>
  );
};

export default HrBody;
