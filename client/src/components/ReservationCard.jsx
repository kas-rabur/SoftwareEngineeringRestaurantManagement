import "../styles/ReservationCard.css";
import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";

const ReservationCard = () => {
    const [ReservationDate, setReservationDate] = useState("");
    const [ReservationTime, setReservationTime] = useState("");
    const [TableID, setTableID] = useState("");

    // extract email from stored JWT
    const getEmailFromToken = () => {
        const token = localStorage.getItem("token");
        if (!token) return null;
        try {
            const decoded = jwtDecode(token);
            return decoded.email;
        } catch (err) {
            console.error("invalid token", err);
            return null;
        }
    };

    const handleReservation = async () => {
        const email = getEmailFromToken();
        if (!email || !ReservationDate || !ReservationTime || !TableID) {
            return alert("please fill in all fields and ensure you're logged in.");
        }

        // validate table ID is numeric
        const tableNum = parseInt(TableID, 10);
        if (isNaN(tableNum)) {
            return alert("table ID must be a number");
        }

        try {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/makeReservation", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ReservationDate,
                    ReservationTime,
                    TableID: tableNum,
                }),
            });

            const data = await res.json();
            if (res.ok) {
                alert("reservation successful!");
            } else {
                alert(`error: ${data.message}`);
            }
        } catch (err) {
            console.error("submission error:", err);
            alert("failed to reserve.");
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
                    Table ID:
                    <input
                        type="text"
                        value={TableID}
                        onChange={(e) => setTableID(e.target.value)}
                        className="reservation-input-field"
                    />
                </label>

                <button onClick={handleReservation} className="reservation-button">
                    Reserve Now
                </button>
            </div>
        </div>
    );
};

export default ReservationCard;
