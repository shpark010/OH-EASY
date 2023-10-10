import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import PrivateRoute from "../containers/PrivateRoute";
import MainPage from "../pages/MainPage";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import EmployeeRegister from "../pages/EmployeeRegister";
import HRManagement from "../pages/HRManagement";
import WorkContract from "../pages/WorkContract";
import SalaryData from "../pages/SalaryData";
import TableTest from "../pages/SdTableTest";
import Mypage from "../pages/MyPage";

import { YearProvider } from "../containers/YearContext";

function AppContent() {
  const [selectedYear, setSelectedYear] = useState("2023");
  return (
    <YearProvider value={{ selectedYear, setSelectedYear }}>
      <Layout>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* 로그인이 필요한 라우트들을 PrivateRoute 안에 묶기 */}
          <Route path="/" element={<PrivateRoute />}>
            <Route index element={<Navigate to="/main" />} />{" "}
            {/* 추가된 부분 */}
            <Route path="/main" element={<MainPage />} />
            <Route path="/er" element={<EmployeeRegister />} />
            <Route path="/hrm" element={<HRManagement />} />
            <Route path="/wc" element={<WorkContract />} />
            <Route path="/sd" element={<SalaryData />} />
            <Route path="/test" element={<TableTest />} />
            <Route path="/mypage" element={<Mypage />} />
          </Route>
          {/* Catch-all 라우트 */}
          <Route path="*" element={<Navigate to="/main" />} />
        </Routes>
      </Layout>
    </YearProvider>
  );
}

export default AppContent;
