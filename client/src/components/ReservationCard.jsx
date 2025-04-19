import "../styles/ReservationCard.css";
import React, { useState } from "react";

const ReservationCard = () => {
    const [CustomerEmail, setCustomerEmail] = useState("");
    const [ReservationDate, setReservationDate] = useState("");
    const [ReservationTime, setReservationTime] = useState("");
    const [TableID, setTableID] = useState("");

    const handleReservation = async () => {
        if (!CustomerEmail || !ReservationDate || !ReservationTime || !TableID) {
            alert("Please fill in all fields.");
            return;
        }
        try {
            const res = await fetch("http://localhost:5000/api/makeReservation", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                CustomerEmail,
                ReservationDate,
                ReservationTime,
                TableID
              }),              
            });
      
            const data = await res.json();
            if (res.ok) {
              alert("Reservation successful!");
            } else {
              alert("Error: " + data.message);
            }
          } catch (err) {
            console.error("Submission error:", err);
            alert("Failed to reserve.");
          }
 
    }
    return (
        <div className="reservation-card" id="book-table">
            <h2>Make a Reservation</h2>
            <p>Reserve your table for a delightful dining experience.</p>

            <div className="reservation-form">
                <label className="reservation-form-label">
                    Customer Email:
                    <input
                        type="text"
                        value={CustomerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className="reservation-input-field"
                    />
                </label>

                <label className="reservation-form-label">
                    Reservation Date:
                    <input
                        type="date"
                        value={ReservationDate}
                        onChange={(e) => setReservationDate(e.target.value)}
                        className="reservation-input-field"
                    />
                </label>

                <label className="reservation-form-label">
                    Reservation Time:
                    <input
                        type="time"
                        value={ReservationTime}
                        onChange={(e) => setReservationTime(e.target.value)}
                        className="reservation-input-field"
                    />
                </label>

                <label className="reservation-form-label">
                    Table:
                    <input
                        type="text"
                        value={TableID}
                        onChange={(e) => setTableID(e.target.value)}
                        className="reservation-input-field"
                    />
                </label>

                <button onClick={handleReservation} className="reservation-button">Reserve Now</button>
            </div>
        </div>
    );
}
export default ReservationCard;