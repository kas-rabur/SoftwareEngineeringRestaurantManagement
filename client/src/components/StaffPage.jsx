import React from "react";
import "../styles/StaffPage.css";
import OrderSection from "./OrderSection";
import ReservationsSection from "./ReservationSection";
import ViewOrdersSection from "./ViewOrderSection";

const StaffPage = () => (
  <div className="staff-page">
    <OrderSection />
    <ReservationsSection />
    <ViewOrdersSection />
  </div>
);

export default StaffPage;
