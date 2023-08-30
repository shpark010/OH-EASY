import React from "react";
import SearchBarBox from "../SearchBar/SearchBarBox";
import SearchSubmitButton from "../SearchBar/SearchSubmitButton";

const HrSearchBar = () => {
  return (
    <div className="searchBar">
      <div className="innerBox fxSpace">
        <div className="selectWrapper">
          <SearchBarBox
            label="조회구분"
            id="hr-category"
            options={[
              { value: "0", label: "0. 재직자+당해년도 퇴사자" },
              { value: "1", label: "1. 재직자+당해년도 퇴사자" },
              { value: "2", label: "2. 작년퇴사자+당해년도 퇴사자" },
              { value: "3", label: "4. 박성환" },
            ]}
            defaultValue="1"
          />
          <SearchBarBox
            label="정렬"
            id="hr-order"
            options={[
              { value: "0", label: "0. 코드순" },
              { value: "1", label: "1. 이름순" },
              { value: "1", label: "1. 입사순" },
            ]}
            defaultValue="0"
          />
        </div>
        <div className="btnWrapper">
          <SearchSubmitButton text="조회" />
        </div>
      </div>
    </div>
  );
};

export default HrSearchBar;
