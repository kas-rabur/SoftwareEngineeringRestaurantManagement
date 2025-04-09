import React from "react";
import "../styles/NavBar.css" // Import external CSS for styling

const NavBar = () => {
  return (
    
    <nav className="navbar">
      <div className="navbar-logo">Restaurant </div>
      <ul className="navbar-links">
        <li><a href="#home">Home</a></li>
        <li><a href="#about">Customer</a></li>
        <li><a href="#services">Staff</a></li>
        <li><a href="#contact">Management</a></li>
      </ul>
      <button class="button">Sign Up</button>
    </nav>
  );
};

export default NavBar;
