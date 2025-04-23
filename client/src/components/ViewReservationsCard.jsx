import "../styles/ViewReservationsCard.css";
import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";

const ViewReservationsCard = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const getEmailFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      const decoded = jwtDecode(token);
      return decoded.email;
    } catch (err) {
      console.error("Invalid token", err);
      return null;
    }
  };
  const handleViewReservations = async () => {
    const customerEmail = getEmailFromToken();
    if (!customerEmail) {
      setErrorMsg("You must be logged in to view reservations.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setReservations([]);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/getReservations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email: customerEmail }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setReservations(data.reservations);
      } else {
        setErrorMsg(data.message || "Could not fetch reservations.");
      }
    } catch (error) {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="view-reservations-card" id="view-reservations">
      <h2>View Reservations</h2>
      <p>Check your existing reservations.</p>

      <button
        onClick={handleViewReservations}
        className="view-reservations-button"
      >
        View Reservations
      </button>

      {loading && <p>Loading...</p>}
      {errorMsg && <p className="error-message">{errorMsg}</p>}
      {reservations.length > 0 ? (
        <ul className="reservations-list">
          {reservations.map((reservation, index) => (
            <li key={index} className="reservation-item">
              {`Reservation on ${reservation.reservation_date} at ${reservation.reservation_time} at table ${reservation.table_number}`}
            </li>
          ))}
        </ul>
      ) : (
        !loading && <p>No reservations found.</p>
      )}
    </div>
  );
};

export default ViewReservationsCard;
