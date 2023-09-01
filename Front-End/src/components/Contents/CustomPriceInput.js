import React, { Component } from "react";
import { styled } from "styled-components";

const PriceInput = styled.input`
  width: ${(props) => props.width || "100px"};
  border-radius: 2px;
  border: 1px solid var(--color-primary-gray);
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
  height: 32px;
  padding: 0 5px;
  text-align: center;
  font-size: 16px;

  &:focus {
    outline: 1px solid var(--color-primary-black);
  }
`;

class CustomPriceInput extends Component {
  handleChange = (e) => {
    const { onChange } = this.props;
    const inputValue = e.target.value.replace(/[^0-9]/g, ""); // 숫자 외의 문자 제거
    onChange(inputValue);
  };

  formatPrice = (value) => {
    // 숫자를 3자리 단위로 쉼표 추가해서 형식화
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  handleKeyUp = (e) => {
    if (e.key === "Enter") {
      //   e.target.blur(); // Remove focus from the input field on Enter key
      this.props.onBlur();
    }
  };

  render() {
    const { width, id, className, value, onBlur } = this.props;
    const formattedValue = this.formatPrice(value);

    return (
      <PriceInput
        type="text"
        id={id}
        className={className}
        width={`${width}%`}
        value={formattedValue}
        onChange={this.handleChange}
        onBlur={onBlur}
        autoFocus
        onKeyUp={this.handleKeyUp}
      />
    );
  }
}

export default CustomPriceInput;
