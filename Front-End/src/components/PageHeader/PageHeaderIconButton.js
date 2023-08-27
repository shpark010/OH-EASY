import React from "react";

const PageHeaderButton = ({ btnName, imageSrc, altText }) => {
  return (
    <button className={btnName}>
      <img src={imageSrc} alt={altText} />
    </button>
  );
};

export default PageHeaderButton;
