import React from "react";
import "../styles/CustomerPage.css";
import CheckAvailabilityCard from "../components/CheckAvailabilityCard";
import ReservationCard from "../components/ReservationCard";
import ViewReservationsCard from "../components/ViewReservationsCard";
import MenuItemsCard from "../components/MenuItemsCard";

const CustomerPage = () => {
  return (
    <div className="customer-page">
      <header className="dashboard-header">
        <h1>Welcome to Our Restaurant</h1>
        <p>
          Select an action from the dashboard below.
          <br />
          <strong>Note:</strong> Reservations are for a{" "}
          <strong>1-hour time slot</strong>. Food orders will be handled on the
          day by our <strong>catering team</strong>.
        </p>
      </header>

      <div className="dashboard-cards">
        <CheckAvailabilityCard />
        <ReservationCard />
        <ViewReservationsCard />
        <MenuItemsCard showAddButton={false} />
      </div>
    </div>
  );
};

export default CustomerPage;
