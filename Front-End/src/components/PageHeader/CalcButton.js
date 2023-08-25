import React from 'react';

const CalcButton = ({ imageSrc, altText }) => {
    return (
        <button className="calc">
        <img src={imageSrc} alt={altText} />
        </button>
    );
};

export default CalcButton;