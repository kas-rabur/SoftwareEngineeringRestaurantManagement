import React from "react";
import "../styles/CustomerPage.css";
import CheckAvailabilityCard from "../components/CheckAvailabilityCard";


const CustomerPage = () => {

  return (
    <div className="customer-page">
      <header className="dashboard-header">
        <h1>Welcome to Our Restaurant</h1>
        <p>Select an action from the dashboard below.</p>
      </header>

      <div className="dashboard-cards">
        
        <CheckAvailabilityCard></CheckAvailabilityCard>
        <div className="card-customer" id="make-reservation">
          <h2>Make Reservation</h2>
          <p>Plan your special occasions and events with us.</p>
        </div>

        <div className="card-customer" id="view-reservation">
          <h2>View Reservation</h2>
          <p>Check details of your upcoming reservations.</p>
        </div>

        <div className="card-customer" id="order-food">
          <h2>Order Food</h2>
          <p>Browse our menu and order your favorite dishes directly.</p>
        </div>
      </div>
    </div>
  );
};

export default CustomerPage;
