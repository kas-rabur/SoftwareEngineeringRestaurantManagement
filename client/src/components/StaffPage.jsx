import React from "react";
import "../styles/StaffPage.css";
import OrderSection from "./OrderSection";
import ReservationsSection from "./ReservationSection";
import ViewOrdersSection from "./ViewOrderSection";

const StaffPage = () => (
  <div className="staff-page">
    <header className="dashboard-header">
      <h1>Welcome to the Staff Dashboard</h1>
      <p>
        Select an action from the dashboard below.
      </p>
    </header>
    <OrderSection />
    <ReservationsSection />
    <ViewOrdersSection />
  </div>
);

export default StaffPage;
