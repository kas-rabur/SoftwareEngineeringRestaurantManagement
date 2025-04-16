import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import HomePage from "./components/HomePage"; 
import CustomerPage from "./components/CustomerPage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import ProtectedRoutes from "./components/ProtectedRoutes";
import { isTokenValid } from "./utils/auth";
import { useLocation } from "react-router-dom";

const AppWrapper = () => {
  const navigate = useNavigate();
  const location = useLocation();
  //only redirects if user is in protected route and token is invalid
  useEffect(() => {
    const protectedPaths = ["/customer", "/staff", "/management"];
    const isProtected = protectedPaths.includes(location.pathname);

    if (isProtected && !isTokenValid()) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate, location]);


  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/customer" element={
          <ProtectedRoutes>
            <CustomerPage />
          </ProtectedRoutes>
        } />
        <Route path="/staff" element={<div>Staff Page</div>} />
        <Route path="/management" element={<div>Management Page</div>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </>
  );
};

//wraps the app in a router to enable navigation then renders app components
const App = () => (
  <Router>
    <AppWrapper />
  </Router>
);

export default App;
