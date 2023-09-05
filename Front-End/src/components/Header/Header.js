import React, { Component } from "react";
import imgLogo from "../../images/logo2.png";
import { Link } from "react-router-dom";
import Logo from "../Header/HeaderComponents/Logo";
import Company from "../Header/HeaderComponents/Company";
import Profile from "../Header/HeaderComponents/Profile";
import Notice from "../Header/HeaderComponents/Notice";
import styled from "styled-components";

class Header extends Component {
  render() {
    return (
      <header id="header" className="header">
        <div className="wrapper">
          <Logo />
          <nav id="headerNav" className="nav headerNav">
            <Company />
            <Profile />
            <Notice />
          </nav>
        </div>
      </header>
    );
  }
}

export default Header;
