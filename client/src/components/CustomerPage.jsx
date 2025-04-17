import React, { useState } from "react";
import "../styles/CustomerPage.css";

const CustomerPage = () => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [availableTables, setAvailableTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleCheckAvailability = async () => {
    if (!date || !time) {
      setErrorMsg("Please select both date and time.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setAvailableTables([]);

    try {
      const response = await fetch("http://localhost:5000/api/getTableAvailability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, time })
      });

      const data = await response.json();

      if (response.ok) {
        setAvailableTables(data.tables);
      } else {
        setErrorMsg(data.message || "Could not fetch table data.");
      }
    } catch (error) {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="customer-page">
      <header className="dashboard-header">
        <h1>Welcome to Our Restaurant</h1>
        <p>Select an action from the dashboard below.</p>
      </header>

      <div className="dashboard-cards">
        <div className="card-customer" id="book-table">
          <h2>Check Availability</h2>
          <p>Find available tables at your desired date and time.</p>

          <div className="booking-form">
            <label className="form-label">
              Select Date:
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="input-field"
              />
            </label>

            <label className="form-label">
              Select Time:
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="input-field"
              />
            </label>

            <button className="check-btn" onClick={handleCheckAvailability}>
              {loading ? "Checking..." : "Check Availability"}
            </button>

            {errorMsg && <p className="error-text">{errorMsg}</p>}

            {availableTables.length > 0 && (
              <div>
                <strong>Available Tables:</strong>
                <div className="table-grid">
                  {availableTables.map(({ table_id, capacity, available }) => (
                    <div
                      key={table_id}
                      className={`table-card ${!available ? "unavailable" : ""}`}
                      title={available ? "Available" : "Unavailable"}
                    >
                      <p><strong>Table {table_id}</strong></p>
                      <p>Capacity: {capacity}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {availableTables.length === 0 && !loading && date && time && !errorMsg && (
              <p>No tables available at this time.</p>
            )}
          </div>
        </div>

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
