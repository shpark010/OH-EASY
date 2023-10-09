import React, { useEffect, useRef, useState } from "react";
// import PageHeaderButton from "../components/PageHeader/PageHeaderButton";
import PageHeaderIconButton from "../PageHeader/PageHeaderIconButton";
import Setting from "../../images/pages/common/setting.png";
import styled from "styled-components";
import { Link } from "react-router-dom";

// const DropdownMenu = styled.div`
//   position: absolute;
//   background-color: white;
//   border: 1px solid #ccc;
//   padding: 10px;
//   width: 170px;
//   left: 30px;
//   top: 50px;
//   color: black;
//   display: ${(props) => (props.show ? "block" : "none")};
//   border-radius: 5px; // 둥근 모서리 추가
//   box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); // 그림자 효과 추가
//   opacity: ${(props) => (props.show ? "1" : "0")};
//   visibility: ${(props) => (props.show ? "visible" : "hidden")};
//   z-index: 1000; // z-index 추가하여 다른 요소 위에 올라오게 함

//   a {
//     color: black; // 링크 색상 설정
//     text-decoration: none; // 밑줄 제거
//     margin-bottom: 10px; // 마진 추가
//     display: block;

//     &:hover {
//       color: #007bff; // 링크 호버 시 색상 변경
//     }
//   }
// `;

const DropdownMenu = styled.div`
  position: absolute;
  background-color: white;
  border: 1px solid #ccc;
  padding: 10px;
  width: 200px;
  right: 0px;
  top: 50px;
  //display: ${(props) => (props.show ? "block" : "none")};
  display: ${(props) => (props["data-show"] ? "block" : "none")};
  border-radius: 5px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;

  a {
    color: black;
    text-decoration: none;
    padding: 8px;
    display: block;
    border-bottom: 1px solid #eee; // 각 항목을 구분하는 하단 보더 추가

    &:last-child {
      border-bottom: none; // 마지막 항목의 하단 보더 제거
    }

    &:hover {
      background-color: #f0f0f0; // 호버 시 배경색 변경
    }
  }
`;

const QuickMenu = () => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(); // 레퍼런스 생성

  const menuItems = [
    { label: "· 사원등록", to: "/er" },
    { label: "· 인사등록", to: "/hrm" },
    { label: "· 급여등록", to: "/sd" },
    { label: "· 근로계약서", to: "/wc" },
  ];

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div
      style={{ position: "relative", display: "inline-block" }}
      ref={menuRef}
    >
      <PageHeaderIconButton
        btnName="setting"
        imageSrc={Setting}
        altText="퀵메뉴"
        onClick={() => setShowMenu(!showMenu)}
      />

      <DropdownMenu data-show={showMenu}>
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.to}
            style={{ display: "block", marginBottom: "5px" }}
          >
            {item.label}
          </Link>
        ))}
      </DropdownMenu>
    </div>
  );
};

export default QuickMenu;
