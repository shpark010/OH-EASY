import React from "react";
import { useLocation } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

function Layout({ children }) {
  const location = useLocation();

  const shouldDisplayHeaderFooter = ![
    "/login",
    "/register",
    "/signup",
  ].includes(location.pathname);

  return (
    <div id="wrap">
      {shouldDisplayHeaderFooter && <Header />}
      <div className="contents">{children}</div>
      {shouldDisplayHeaderFooter && <Footer />}
    </div>
  );
}

export default Layout;
