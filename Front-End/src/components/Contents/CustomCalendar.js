import React, { useState, useRef, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styled from "styled-components";
import moment from "moment";
import { FaRegCalendarAlt } from "react-icons/fa";

const InputWrapper = styled.div`
  position: relative;
  width: ${(props) => props.width || "100px"};

  input[readonly] + div {
    cursor: not-allowed;
  }
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

  /* 조건부 스타일링 readOnly가 true 일경우 */
  ${(props) =>
    props.readOnly &&
    `
    background-color: var(--color-opacity-gray);
    cursor: not-allowed;
  `}
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

function CustomCalendar({
  width,
  id,
  className,
  onChange,
  type,
  name,
  value,
  readOnly,
}) {
  const [date, setDate] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  // if (
  //   value &&
  //   typeof value === "string" &&
  //   !moment(value, "YYYYMMDD").isValid()
  // ) {
  //   console.error("Invalid value prop passed to CustomCalendar:", value);
  // }

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

  function convertDBDateToMoment(dateStr) {
    if (!dateStr || !moment(dateStr, "YYYYMMDD").isValid()) {
      //console.error("Invalid date conversion:", dateStr);
      return "";
    }
    return moment(dateStr, "YYYYMMDD").format("YYYY-MM-DD");
  }

  const handleDateChange = (newDate) => {
    setDate(formatDate(newDate));
    setIsOpen(false);
    onChange(formatDate(newDate));

    console.log("새로 선택한 날짜 : " + formatDate(newDate));
  };

  const handleMonthChange = (newDate) => {
    const selectedMonth = moment(newDate).format("YYYY-MM");
    console.log("선택한 월 : " + newDate);
    console.log("저장될 월 : " + selectedMonth);

    setDate(newDate);
    onChange(selectedMonth);
    setIsOpen(false);
  };

  const formatDate = (date) => {
    const formattedDate =
      typeof date === "string" ? convertDBDateToMoment(date) : date;
    return formattedDate
      ? type === "month"
        ? moment(formattedDate).format("YYYY-MM")
        : moment(formattedDate).format("YYYY-MM-DD")
      : "";
  };

  return (
    <InputWrapper ref={ref} width={`${width}px`}>
      <Input
        id={id}
        className={className}
        value={formatDate(value)}
        //onClick={() => setIsOpen(!isOpen)}
        onClick={() => !readOnly && setIsOpen(!isOpen)}
        onChange={onChange}
        readOnly={readOnly}
        name={name}
      />
      <IconWrapper onClick={() => !readOnly && setIsOpen(!isOpen)}>
        <FaRegCalendarAlt size={17} />
      </IconWrapper>
      {isOpen && (
        <StyledCalendar
          locale="ko"
          formatDay={(locale, date) => moment(date).format("DD")}
          onChange={type === "month" ? handleMonthChange : handleDateChange}
          value={formatDate(value) || new Date()}
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
