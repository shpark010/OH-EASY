import React from "react";

const SearchBarDateBox = ({ text, id }) => {
  return (
    <div className="searchBarBox">
      <span className="searchBarName">{text}</span>
      <input type="date" id={id} />
    </div>
  );
};
/*

                <div className="searchBarBox">
                  <span className="searchBarName">귀속연월</span>
                  <input type="date" />
                </div>
*/

export default SearchBarDateBox;
