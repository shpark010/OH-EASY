import React, { Component } from "react";
import imgLogo from "../../images/logo2.png";
import { Link } from "react-router-dom";

class Header extends Component {
  // 초기 상태 설정
  state = {
    isNoticeBoxVisible: false,
    isProfileBoxVisible: false,
  };

  // 알림 박스의 가시성을 전환하는 함수
  toggleNoticeBox = () => {
    this.setState((prevState) => ({
      isNoticeBoxVisible: !prevState.isNoticeBoxVisible,
    }));
  };
  toggleProfileBox = () => {
    this.setState((prevState) => ({
      isProfileBoxVisible: !prevState.isProfileBoxVisible,
    }));
  };

  render() {
    return (
      <header id="header" className="header">
        <div className="wrapper">
          <div className="logo">
            <Link to="/main">
              <img src={imgLogo} alt="" width="180px" />
            </Link>
          </div>
          <nav id="headerNav" className="nav headerNav">
            <div className="company">
              <span className="companyName">
                (주)로그인시회원데이터로가져옴
              </span>
              <select
                name="targetYear"
                id="targetYear"
                className="targetYear companyYear selectBox blue"
                defaultValue="2022"
              >
                <option value="2022">2022</option>
                <option value="2021">2021</option>
                <option value="2020">2020</option>
                <option value="2019">2019</option>
              </select>
            </div>
            <div
              className="profile toggleModal"
              onClick={this.toggleProfileBox}
            >
              <span className="profileName">이재훈 사원</span>
              <div className="profileImage">
                <img src="https://picsum.photos/50/50" alt="이미지 샘플" />
              </div>
              {this.state.isProfileBoxVisible && (
                <div className="toggleModalBox profileBox">
                  <a href="" class="profileBoxItem">
                    <div className="ico-person"></div>
                    <span>마이페이지</span>
                  </a>
                  <a href="" class="profileBoxItem">
                    <div className="ico-logout"></div>
                    <span>로그아웃</span>
                  </a>
                </div>
              )}
            </div>
            <div className="toggleModal headerNotice">
              <div
                className={`headerNoticeIcon ${
                  this.state.isNoticeBoxVisible ? "active" : ""
                }`}
                onClick={this.toggleNoticeBox}
              >
                <div className="ico-bell"></div>
              </div>
              {this.state.isNoticeBoxVisible && (
                <div className="toggleModalBox headerNoticeBox">
                  <div className="headerNoticeTop">
                    <div className="title">알림</div>
                    <div className="headerNoticeClose btn-close"></div>
                  </div>
                  <div className="headerNoticeContent">
                    <ul className="headerNoticeList">
                      <li className="headerNoticeItem">
                        <span>표준근로계약서 작성이 필요합니다(이재훈)</span>
                      </li>
                      <li className="headerNoticeItem">
                        <span>
                          텍스트가 길어지면 몇글자까지 나오는 것이 좋을까요 다
                          보여주는 것이 더 좋아보임
                        </span>
                      </li>
                      <li className="headerNoticeItem">
                        <span>표준근로계약서 작성이 필요합니다(이재훈)</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>
    );
  }
}

export default Header;
