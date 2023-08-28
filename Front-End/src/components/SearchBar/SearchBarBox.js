import React from "react";

function SearchBarBox({ label, id, options, defaultValue }) {
  return (
    <div className="searchBarBox">
      <span className="searchBarName">{label}</span>
      <select id={id} className="selectBox" defaultValue={defaultValue}>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
/*
              <SearchBarBox
                label="조회구분"
                id="hr-category"
                options={[
                  { value: "0", label: "0. 재직자+당해년도 퇴사자" },
                  { value: "1", label: "1. 재직자+당해년도 퇴사자" },
                  { value: "1", label: "2. 작년퇴사자+당해년도 퇴사자" },
                ]}
                defaultValue="0"
              />

*/

export default SearchBarBox;
