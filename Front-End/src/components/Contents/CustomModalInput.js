import styled from "styled-components";
import { TbCalendarSearch } from "react-icons/tb";
import CustomModal from "./CustomModal";

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
  
  input[disabled] + div {
    cursor: not-allowed;
  }
`;

const Input = styled.input`
  width: ${(props) => props.width || "100px"};
  border-radius: 2px;
  border: 1px solid var(--color-primary-gray);
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
  height: 32px;
  padding: 0 12px;
  font-weight: 700;
  font-family: "NanumSquare", sans-serif;

  &:focus {
    outline: 1px solid var(--color-primary-black);
  }

    ${(props) =>
    props.disabled &&
    `
    background-color: var(--color-opacity-gray);
    cursor: not-allowed;
  `}
`;

function CustomModalInput({ 
  id, 
  className, 
  width, 
  children, 
  value, 
  style, 
  onChange,
  readOnly,
  overlayStyle,
  contentStyle,
  placeholder,
  onClick,
  isOpen,
  onRequestClose,
  disabled,
}) {

  const handleInputChange = (event) => {
    if(!readOnly) {
      onChange(event.target.value);
    }
  };

  return (
    <InputWrapper>
      <Input
        id={id}
        className={className}
        width={`${width}px`}
        onClick={() => {
          if (!disabled && onClick) {
            onClick();
          }
        }}
        readOnly={readOnly}
        style={style}
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        disabled={disabled}
      />
      
      <IconWrapper 
        onClick={() => {
          if (!disabled && onClick) {
            onClick();
          }
        }}
      >
        <TbCalendarSearch size={18} />
      </IconWrapper>
      
      <CustomModal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        overlayStyle={overlayStyle}
        contentStyle={contentStyle}
        >
        {children}
      </CustomModal>
    </InputWrapper>
  );
}

const IconWrapper = styled.div`
  position: absolute;
  top: -1px;
  right: 0;
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 5px;
  cursor: pointer;
`;

export default CustomModalInput;
