import React from 'react';

const DeleteButton = ({ imageSrc, altText }) => {
    return (
        <button className="delete">
        <img src={imageSrc} alt={altText} />
        </button>
    );
};

export default DeleteButton;