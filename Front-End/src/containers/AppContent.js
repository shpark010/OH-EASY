import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import MainPage from "../pages/MainPage";
import LoginPage from "../pages/LoginPage";
import MemberRegister from "../pages/MemberRegister";
import EmployeeRegister from "../pages/EmployeeRegister";
import HRManagement from "../pages/HRManagement";
import WorkContract from "../pages/WorkContract";
import SalaryData from "../pages/SalaryData";

function AppContent() {
  const location = useLocation();

  return (
    <div id="wrap">
      {location.pathname !== "/login" && location.pathname !== "/register" && (
        <Header />
      )}
      <div className="contents">
        <Routes>
          <Route exact path="/main" element={<MainPage />} />
          <Route path="/register" element={<MemberRegister />} />
          <Route path="/login" element={<LoginPage />} />

          <Route path="/er" element={<EmployeeRegister />} />
          <Route path="/hrm" element={<HRManagement />} />
          <Route path="/wc" element={<WorkContract />} />
          <Route path="/sd" element={<SalaryData />} />
        </Routes>
      </div>
      {location.pathname !== "/login" && location.pathname !== "/register" && (
        <Footer />
      )}
    </div>
  );
}

export default AppContent;
