import React from "react";
import Logo from "../Header/HeaderComponents/Logo";
import Company from "../Header/HeaderComponents/Company";
import Profile from "../Header/HeaderComponents/Profile";
import Notice from "../Header/HeaderComponents/Notice";
import { getCookie } from "../../containers/Cookie";
const Header = () => {
  const companyName = getCookie("companyName");
  const name = getCookie("name");

  return (
    <header id="header" className="header">
      <div className="wrapper">
        <Logo />
        <nav id="headerNav" className="nav headerNav">
          <Company companyName={companyName} />
          <Profile name={name} />
          {/* <Notice /> */}
        </nav>
      </div>
    </header>
  );
};

export default Header;
