import React from 'react';

const SettingButton = ({ imageSrc, altText }) => {
    return (
        <button className="setting">
        <img src={imageSrc} alt={altText} />
        </button>
    );
};

export default SettingButton;