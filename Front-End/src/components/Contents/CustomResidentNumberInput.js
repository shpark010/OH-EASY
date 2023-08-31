import React, { useState } from "react";
import styled from "styled-components";

const Input = styled.input`
    width: ${(props) => props.width || "100px"};
    border-radius: 2px;
    border: 1px solid var(--color-primary-gray);
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
    height: 32px;
    padding: 0 5px;

    &:focus {
        outline: 1px solid var(--color-primary-black);
    }
`;

function CustomResidentNumberInput({ width, id, className, onChange }) {
    const [value, setValue] = useState("");

    const handleInputChange = (e) => {
        const inputValue = e.target.value;
        const sanitizedValue = inputValue.replace(/[^\d]/g, "");

        let formattedValue = sanitizedValue.slice(0, 13);
        if (formattedValue.length > 6) {
            formattedValue = `${formattedValue.slice(0, 6)}-${formattedValue.slice(6)}`;
        }

        setValue(formattedValue);
        onChange && onChange(formattedValue);
    };

    return (
        <Input
            type="text"
            id={id}
            className={className}
            width={`${width}px`}
            value={value}
            onChange={handleInputChange}
        />
    );
}

export default CustomResidentNumberInput;
