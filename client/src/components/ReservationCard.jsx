import "../styles/ReservationCard.css";
import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";

const ReservationCard = () => {
    const [ReservationDate, setReservationDate] = useState("");
    const [ReservationTime, setReservationTime] = useState("");
    const [TableID, setTableID] = useState("");

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

    const handleReservation = async () => {
        const email = getEmailFromToken();
        if (!email || !ReservationDate || !ReservationTime || !TableID) {
            alert("Please fill in all fields and ensure you're logged in.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:5000/api/makeReservation", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
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
    };

    return (
        <div className="reservation-card" id="book-table">
            <h2>Make a Reservation</h2>
            <p>Reserve your table for a delightful dining experience.</p>

            <div className="reservation-form">
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
};

export default ReservationCard;
