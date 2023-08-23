import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import PrivateRoute from "../containers/PrivateRoute";
import MainPage from "../pages/MainPage";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import MemberRegister from "../pages/MemberRegister";
import EmployeeRegister from "../pages/EmployeeRegister";
import HRManagement from "../pages/HRManagement";
import WorkContract from "../pages/WorkContract";
import SalaryData from "../pages/SalaryData";

function AppContent() {
  const location = useLocation();

  return (
    <div id="wrap">
      {location.pathname !== "/login" &&
        location.pathname !== "/register" &&
        location.pathname !== "/signup" && <Header />}
      <div className="contents">
        <Routes>
          <Route path="/register" element={<MemberRegister />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* 로그인이 필요한 라우트들을 PrivateRoute 안에 묶기 */}
          <Route path="/" element={<PrivateRoute />}>
            <Route path="/main" element={<MainPage />} />
            <Route path="/er" element={<EmployeeRegister />} />
            <Route path="/hrm" element={<HRManagement />} />
            <Route path="/wc" element={<WorkContract />} />
            <Route path="/sd" element={<SalaryData />} />
          </Route>
        </Routes>
      </div>
      {location.pathname !== "/login" &&
        location.pathname !== "/register" &&
        location.pathname !== "/signup" && <Footer />}
    </div>
  );
}

export default AppContent;
