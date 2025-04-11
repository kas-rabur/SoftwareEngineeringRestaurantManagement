import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import HomePage from "./components/HomePage"; 
import CustomerPage from "./components/CustomerPage";

const App = () => {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/customer" element={<CustomerPage/>} />
        <Route path="/staff" element={<div>Staff Page</div>} />
        <Route path="/management" element={<div>Management Page</div>} />
      </Routes>
    </Router>
  );
};

export default App;
