import React from "react";

const SearchSubmitButton = ({ text, onClick }) => {
  return (
    <button className="gray" onClick={onClick}>
      {text}
    </button>
  );
};

export default SearchSubmitButton;
