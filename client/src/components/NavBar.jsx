import React from "react";
import { Link } from "react-router-dom";
import "../styles/NavBar.css";

const NavBar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">Restaurant</div>
      <ul className="navbar-links">
        <li>
          <Link to="/home">Home</Link>
        </li>
        <li>
          <Link to="/customer">Customer</Link>
        </li>
        <li>
          <Link to="/staff">Staff</Link>
        </li>
        <li>
          <Link to="/management">Management</Link>
        </li>
      </ul>
      <Link to="/login">
        <button className="button">Log In</button>
      </Link>
    </nav>
  );
};

export default NavBar;
