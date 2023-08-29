import React, { useState } from "react";

function SearchBarBox({
  label,
  id,
  className,
  options,
  defaultValue,
  onChange,
}) {
  const [selectedValue, setSelectedValue] = useState(defaultValue);

  const handleValueChange = (event) => {
    const newValue = event.target.value;
    setSelectedValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <div className={`searchBarBox ${className}`}>
      {label && <span className="searchBarName">{label}</span>}
      <select
        id={id}
        className="selectBox"
        defaultValue={defaultValue}
        onChange={handleValueChange}
        value={selectedValue}
      >
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
