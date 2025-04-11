import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import HomePage from "./components/HomePage"; 
import CustomerPage from "./components/CustomerPage";
import LoginPage from "./components/LoginPage";

const App = () => {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/customer" element={<CustomerPage/>} />
        <Route path="/staff" element={<LoginPage/>} />
        <Route path="/management" element={<div>Management Page</div>} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
};

export default App;
