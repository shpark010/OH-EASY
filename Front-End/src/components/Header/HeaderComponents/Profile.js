import React, { useState } from "react";
import styled from "styled-components";
import { setCookie, getCookie, removeCookie } from "../../../containers/Cookie";
import axios from "axios";

const ProfileWrapper = styled.div`
  /* profile */
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 40px;
  border: 1px solid #ccc;
  border-radius: 20px;
  text-align: center;
  cursor: pointer;
  /* toggleModal */
  position: relative;
`;

const ProfileName = styled.span`
  display: inline-block;
  font-weight: 600;
  font-size: 14px;
  padding: 0 15px 0 26px;
`;

const ProfileImageWrapper = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  outline: 1px solid #ccc;
  background-color: #fff;
`;

const ProfileBox = styled.div`
  /*profileBox*/
  font-size: 14px;
  font-weight: 500;
  z-index: 1;
  /*toggleModalBox*/
  position: absolute;
  top: calc(100% + 15px);
  right: 0;
  padding: 18px 22px;
  background-color: #fff;
  color: var(--color-primary-gray);
  border-radius: 10px;
  border: 1px solid #eee;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.12);
`;

const ProfileBoxItem = styled.a`
  display: flex;
  align-items: center;

  & + & {
    margin-top: 10px;
  }
`;

const IconWrapper = styled.div`
  width: 24px;
  height: 24px;
  margin-right: 5px;
`;

const logout = async (event) => {
  event.preventDefault();
  const cookieData = getCookie("loginInfo").split(".");
  const logoutId = cookieData[0];
  const token = cookieData.slice(1).join(".");
  console.log("분리한 토큰값 : " + token);
  removeCookie("loginInfo");
  try {
    const response = await axios.post("/api1/auth/logout", {
      logoutId,
      token,
    });
    if (response.data) {
      console.log("삭제");
      window.location.reload();
    }
  } catch (error) {
    console.error("오류 : ", error);
  }
};

const Profile = (props) => {
  const [isProfileBoxVisible, setIsProfileBoxVisible] = useState(false);

  const toggleProfileBox = () => {
    setIsProfileBoxVisible((prev) => !prev);
  };

  return (
    <ProfileWrapper onClick={toggleProfileBox}>
      <ProfileName>{props.name} 님</ProfileName>
      <ProfileImageWrapper>
        <img src="https://picsum.photos/50/50" alt="이미지 샘플" />
      </ProfileImageWrapper>
      {isProfileBoxVisible && (
        <ProfileBox>
          <ProfileBoxItem href="">
            <IconWrapper className="ico-person"></IconWrapper>
            <span>마이페이지</span>
          </ProfileBoxItem>
          <ProfileBoxItem onClick={logout}>
            <IconWrapper className="ico-logout"></IconWrapper>
            <span>로그아웃</span>
          </ProfileBoxItem>
        </ProfileBox>
      )}
    </ProfileWrapper>
  );
};

export default Profile;
