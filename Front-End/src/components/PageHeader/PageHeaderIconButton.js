import React from "react";

const PageHeaderButton = ({ btnName, imageSrc, altText, onClick }) => {
  return (
    <button className={btnName} onClick={onClick}>
      <img src={imageSrc} alt={altText} />
    </button>
  );
};

export default PageHeaderButton;
