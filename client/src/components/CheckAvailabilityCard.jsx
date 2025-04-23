import "../styles/CheckAvailabilityCard.css";
import React, { useState } from "react";

const CheckAvailabilityCard = () => {
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
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/getTableAvailability",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ date, time }),
        }
      );

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
    <div className="check-availability-card" id="book-table">
      <h2>Check Availability</h2>
      <p>Find available tables at your desired date and time.</p>

      <div className="availability-booking-form">
        <label className="availability-form-label">
          Select Date:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="availability-input-field"
          />
        </label>

        <label className="availability-form-label">
          Select Time:
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="availability-input-field"
          />
        </label>

        <button
          className="availability-check-btn"
          onClick={handleCheckAvailability}
        >
          {loading ? "Checking..." : "Check Availability"}
        </button>

        {errorMsg && <p className="availability-error-text">{errorMsg}</p>}

        {availableTables.length > 0 && (
          <div>
            <strong>Available Tables:</strong>
            <div className="availability-table-grid">
              {availableTables.map(({ table_id, capacity, available }) => (
                <div
                  key={table_id}
                  className={`availability-table-card ${
                    !available ? "unavailable" : ""
                  }`}
                  title={available ? "Available" : "Unavailable"}
                >
                  <p>
                    <strong>Table {table_id}</strong>
                  </p>
                  <p>Capacity: {capacity}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {availableTables.length === 0 &&
          !loading &&
          date &&
          time &&
          !errorMsg && <p>No tables available at this time.</p>}
      </div>
    </div>
  );
};

export default CheckAvailabilityCard;
