import React, { useState, useRef, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styled from "styled-components";
import moment from "moment";

const InputWrapper = styled.div`
  position: relative;
  width: ${(props) => props.width || "100px"};
`;

const Input = styled.input`
  width: 100%;
  border-radius: 2px;
  border: 1px solid var(--color-primary-gray);
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
  height: 32px;
  padding: 0 5px;
  text-align: center;

  &:focus {
    outline: 1px solid var(--color-primary-black);
  }
`;

const StyledCalendar = styled(Calendar)`
  width: 270px; // 달력사이즈 줄일려면
  max-width: none;
  position: absolute;
  top: 100%;
  left: 0;
  border-radius: 10px;
  border: 1px solid #c8c8c8;
  background-color: white;
  z-index: 100;
  font-size: 16px;

  .react-calendar__navigation__label > span {
    color: var(--color-primary-black);
    font-size: 15px;
    font-weight: 600;
  }

  .react-calendar__month-view__days__day--weekend:nth-child(7n-1) {
    color: var(--color-primary-blue);
  }
  .react-calendar__month-view__days__day--weekend:nth-child(7n) {
    color: red;
  }

  .react-calendar__tile:enabled:hover,
  .react-calendar__tile:enabled:focus {
    background: var(--color-primary-blue);
    color: var(--color-primary-white);
  }

  .react-calendar__tile--now {
    background: var(--color-secondary-blue);
    color: var(--color-primary-white);
  }

  .react-calendar__tile--active {
    background: var(--color-primary-blue);
    color: white;
  }
`;

function CustomCalendar({ width, id }) {
  const [date, setDate] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleOutsideClick(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleDateChange = (newDate) => {
    setDate(newDate);
    setIsOpen(false);
  };

  const formatDate = (date) => {
    return moment(date).format("YYYY-MM-DD");
  };

  return (
    <InputWrapper ref={ref} width={`${width}px`}>
      <Input
        id={id}
        readOnly
        value={formatDate(date)}
        onClick={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <StyledCalendar
          locale="ko"
          formatDay={(locale, date) => moment(date).format("DD")}
          onChange={handleDateChange}
          value={date}
        />
      )}
    </InputWrapper>
  );
}

export default CustomCalendar;