import { Navigate, Outlet } from "react-router-dom";

function PrivateRoute() {
  const token = localStorage.getItem("token");

  // 토큰이 있으면 요청한 페이지로 이동
  if (token) {
    return <Outlet />;
  }

  // 토큰이 없으면 로그인 페이지로 리디렉션
  return <Navigate to="/login" />;
}
export default PrivateRoute;
