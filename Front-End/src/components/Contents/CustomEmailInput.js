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

function CustomEmailInput({ width, id, className, maxLength, onChange }) {
    const [value, setValue] = useState("");

    const handleInputChange = (e) => {
        const inputValue = e.target.value;
        const sanitizedValue = inputValue.replace(/[^a-zA-Z0-9@._-]/g, ""); // 영문자, 숫자, @, ., _만 허용
        const limitedValue = sanitizedValue.slice(0, maxLength);
        setValue(limitedValue);
        onChange && onChange(limitedValue);
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

export default CustomEmailInput;
