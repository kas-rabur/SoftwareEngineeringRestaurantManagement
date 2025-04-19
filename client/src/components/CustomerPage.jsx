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
        <p>Select an action from the dashboard below.</p>
      </header>

      <div className="dashboard-cards">
        
        <CheckAvailabilityCard></CheckAvailabilityCard>
        <ReservationCard></ReservationCard>
        <ViewReservationsCard></ViewReservationsCard>
        <MenuItemsCard></MenuItemsCard>

        <div className="card-customer" id="order-food">
          <h2>Order Food</h2>
          <p>Browse our menu and order your favorite dishes directly.</p>
        </div>
      </div>
    </div>
  );
};

export default CustomerPage;
