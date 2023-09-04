import React from "react";
import CustomInput from "../../Contents/CustomInput";
import CustomSelect from "../../Contents/CustomSelect";
import CustomCalender from "../../Contents/CustomCalendar";

const HrMilitary = () => {
  return (
    <div className="hrDetail borderTopBold">
      <div className="hrDetailTitle">
        <p>제대구분</p>
        <p>복무시작일</p>
        <p>군별</p>
      </div>
      <div className="hrDetailInputBox">
        <CustomSelect
          className={"hrDetailSelect"}
          options={[
            { value: "AB", label: "0. 만기제대" },
            { value: "A", label: "1. 의병제대" },
            { value: "B", label: "2. 의가사제대" },
            { value: "O", label: "4. 소집해제" },
          ]}
          defaultValue="AB"
          width="200"
        />
        <CustomCalender className="hrInfoBaseInput" width="200" />
        <CustomSelect
          className={"hrDetailSelect"}
          options={[
            { value: "AB", label: "0. 육군" },
            { value: "A", label: "1. 해군" },
            { value: "B", label: "2. 공군" },
            { value: "O", label: "4. ROTC" },
          ]}
          defaultValue="AB"
          width="200"
        />
      </div>
      <div className="hrDetailTitle">
        <p>병역구분</p>
        <p>복무종료일</p>
        <p>병과</p>
      </div>
      <div className="hrInputBox">
        <CustomSelect
          className={"hrDetailSelect"}
          options={[
            { value: "AB", label: "0. 현역" },
            { value: "A", label: "1. 공익근무" },
            { value: "B", label: "2. 방위산업체" },
            { value: "O", label: "4. 기간산업체" },
            { value: "O", label: "5. 산업기능" },
            { value: "O", label: "6. 미필" },
            { value: "O", label: "7. 면제" },
          ]}
          defaultValue="AB"
          width="200"
        />
        <CustomCalender className="hrInfoBaseInput" width="200" />
        <CustomInput className="hrDetailInput" width="200" />
      </div>
      <div className="hrDetailTitle">
        <p>면제사유</p>
        <p>병역기간</p>
        <p>계급</p>
      </div>
      <div className="hrInputBox">
        <CustomInput className="hrDetailInput" width="200" />
        <CustomInput className="hrDetailInput" width="200" />
        <CustomSelect
          className={"hrDetailSelect"}
          options={[
            { value: "AB", label: "0. 이병" },
            { value: "A", label: "1. 일병" },
            { value: "B", label: "2.상병" },
            { value: "O", label: "4. 병장" },
            { value: "O", label: "5. 하사" },
            { value: "O", label: "6. 중사" },
            { value: "O", label: "7. 상사" },
            { value: "O", label: "8. 원사" },
            { value: "O", label: "9. 준사관" },
            { value: "O", label: "10. 장교" },
          ]}
          defaultValue="AB"
          width="200"
        />
      </div>
    </div>
  );
};

export default HrMilitary;
