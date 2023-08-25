import React from 'react';

const PrintButton = ({ imageSrc, altText }) => {
    return (
        <button className="print">
        <img src={imageSrc} alt={altText} />
        </button>
    );
};

export default PrintButton;