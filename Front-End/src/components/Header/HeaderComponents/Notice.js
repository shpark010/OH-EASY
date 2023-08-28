import React from "react";
import styled from "styled-components";

const NoticeWrapper = styled.div`
  /*headerNotice*/
  padding-left: 20px;
  /*toggleModal*/
  position: relative;
`;

const NoticeIcon = styled.div`
  position: relative;
  cursor: pointer;

  &.active::after {
    content: "";
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    width: 6px;
    height: 6px;
    background-color: #ff6060;
    border-radius: 50%;
  }
`;

const NoticeBox = styled.div`
  /* headerNoticeBox*/
  width: 330px;
  padding: 22px 25px;
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

const NoticeTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2px 10px 15px 10px;
  font-size: 14px;
  font-weight: 500;
  border-bottom: 1px solid #ccc;
`;

const CloseButton = styled.div`
  cursor: pointer;
  color: var(--color-primary-gray);
`;

const NoticeItem = styled.li`
  padding: 14px 0px 13px 15px;
  font-size: 12px;
  font-weight: 500;
  border-bottom: 1px solid #eee;
  cursor: pointer;

  &:nth-child(even) {
    background-color: #fdfdfd;
  }

  &:hover {
    background-color: #fcfcfc;
  }

  & > span {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 10px;
    ::after {
      content: "";
      display: inline-block;
      margin-left: 5px;
      width: 12px;
      height: 12px;
      background: url("../../images/icon/arw-right.png") no-repeat center/cover;
      filter: invert(0.7);
      flex-shrink: 0;
    }
  }
`;
class Notice extends React.Component {
  state = {
    isNoticeBoxVisible: false,
  };

  toggleNoticeBox = () => {
    this.setState((prevState) => ({
      isNoticeBoxVisible: !prevState.isNoticeBoxVisible,
    }));
  };
  render() {
    const { isNoticeBoxVisible } = this.state;

    return (
      <NoticeWrapper>
        <NoticeIcon
          className={isNoticeBoxVisible ? "active" : ""}
          onClick={this.toggleNoticeBox}
        >
          <div className="ico-bell"></div>
        </NoticeIcon>
        {isNoticeBoxVisible && (
          <NoticeBox>
            <NoticeTop>
              <div className="title">알림</div>
              <CloseButton className="btn-close"></CloseButton>
            </NoticeTop>
            <ul>
              <NoticeItem>
                <span>표준근로계약서 작성이 필요합니다(이재훈)</span>
              </NoticeItem>
              <NoticeItem>
                <span>
                  텍스트가 길어지면 몇글자까지 나오는 것이 좋을까요 다 보여주는
                  것이 더 좋아보임
                </span>
              </NoticeItem>
              <NoticeItem>
                <span>표준근로계약서 작성이 필요합니다(이재훈)</span>
              </NoticeItem>
            </ul>
          </NoticeBox>
        )}
      </NoticeWrapper>
    );
  }
}

export default Notice;
