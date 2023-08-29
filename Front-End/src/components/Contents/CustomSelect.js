import React from "react";

function CustomSelect({
  id,
  className,
  options,
  defaultValue,
  width,
  onChange,
}) {
  return (
    <div className={`searchBarBox ${className}`}>
      <select
        id={id}
        className="selectBox"
        defaultValue={defaultValue}
        style={{ width: `${width}px` }}
        onChange={onChange}
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

export default CustomSelect;
