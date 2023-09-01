import React, { Component } from "react";
import styled from "styled-components";

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

class Profile extends Component {
  state = {
    isProfileBoxVisible: false,
  };

  toggleProfileBox = () => {
    this.setState((prevState) => ({
      isProfileBoxVisible: !prevState.isProfileBoxVisible,
    }));
  };
  render() {
    const { isProfileBoxVisible } = this.state;

    return (
      <ProfileWrapper onClick={this.toggleProfileBox}>
        <ProfileName>이재훈 사원</ProfileName>
        <ProfileImageWrapper>
          <img src="https://picsum.photos/50/50" alt="이미지 샘플" />
        </ProfileImageWrapper>
        {isProfileBoxVisible && (
          <ProfileBox>
            <ProfileBoxItem href="">
              <IconWrapper className="ico-person"></IconWrapper>
              <span>마이페이지</span>
            </ProfileBoxItem>
            <ProfileBoxItem href="">
              <IconWrapper className="ico-logout"></IconWrapper>
              <span>로그아웃</span>
            </ProfileBoxItem>
          </ProfileBox>
        )}
      </ProfileWrapper>
    );
  }
}

export default Profile;
