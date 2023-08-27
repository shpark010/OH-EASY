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

export default SearchBarBox;
