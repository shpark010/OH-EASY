import React, { Component } from "react";
import { Link } from "react-router-dom";
import imgLogo from "../../../images/logo2.png";

class Logo extends Component {
  render() {
    return (
      <div className="logo">
        <Link to="/main">
          <img src={imgLogo} alt="" width="180px" />
        </Link>
      </div>
    );
  }
}

export default Logo;
