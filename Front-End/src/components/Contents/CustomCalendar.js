import React, { useState, useRef, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styled from "styled-components";
import moment from "moment";
import { FaRegCalendarAlt } from "react-icons/fa";

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
  font-family: "NanumSquare", sans-serif;
  font-weight: 700;

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
  font-family: "NanumSquare", sans-serif;
  .react-calendar__navigation__label {
    padding: 0;
  }
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

function CustomCalendar({ width, id, className, onChange, type, name }) {
  const [date, setDate] = useState(null);
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
    setDate(formatDate(newDate));
    setIsOpen(false);
    onChange(formatDate(newDate));
    console.log("새로 선택한 날짜 : " + formatDate(newDate));

    // 일반 달력에서 날짜를 선택한 경우, onChange 콜백 호출
    if (type !== "month" && onChange) {
    }
  };

  const handleMonthChange = (newDate) => {
    // 이 함수는 월 선택 달력에서 월을 선택했을 때 호출됩니다.
    // 선택한 월을 date 상태에 반영합니다.
    console.log("선택한 월 : " + newDate);

    // 월 선택 달력에서 선택한 월을 추출합니다.
    const selectedMonth = moment(newDate).format("YYYY-MM");

    console.log("저장될 월 : " + selectedMonth); // 선택된 월 출력

    setDate(newDate);
    onChange(selectedMonth);

    // 월 선택 달력에서 월을 선택한 경우, onChange 콜백 호출
    if (type === "month" && onChange) {
    }

    setIsOpen(false); // 월 선택 후, 달력을 닫습니다.
  };

  const formatDate = (date) => {
    return date
      ? type === "month"
        ? moment(date).format("YYYY-MM")
        : moment(date).format("YYYY-MM-DD")
      : "";
  };

  return (
    <InputWrapper ref={ref} width={`${width}px`}>
      <Input
        id={id}
        className={className}
        value={formatDate(date)}
        onClick={() => setIsOpen(!isOpen)}
        onChange={onChange}
        name={name}
      />
      <IconWrapper onClick={() => setIsOpen(!isOpen)}>
        <FaRegCalendarAlt size={17} />
      </IconWrapper>
      {isOpen && (
        <StyledCalendar
          locale="ko"
          formatDay={(locale, date) => moment(date).format("DD")}
          onChange={type === "month" ? handleMonthChange : handleDateChange}
          value={date || new Date()}
          view={type === "month" ? "year" : "month"}
          onClickMonth={type === "month" ? handleMonthChange : undefined}
        />
      )}
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

export default CustomCalendar;
