import "../styles/ViewReservationsCard.css";
import React, { useState } from "react";

const ViewReservationsCard = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [customerEmail, setCustomerEmail] = useState("");

    const handleViewReservations = async () => {
        if (!customerEmail) {
            setErrorMsg("Please enter your email.");
            return;
        }

        setLoading(true);
        setErrorMsg("");
        setReservations([]);

        try {
            const response = await fetch("http://localhost:5000/api/getReservations", {
                method: "POST", 
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: customerEmail })
            });

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

            <input
                type="email"
                placeholder="Enter your email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="email-input"
            />

            <button onClick={handleViewReservations} className="view-reservations-button">
                View Reservations
            </button>

            {loading && <p>Loading...</p>}
            {errorMsg && <p className="error-message">{errorMsg}</p>}
            {reservations.length > 0 ? (
                <ul className="reservations-list">
                    {reservations.map((reservation, index) => (
                        <li key={index} className="reservation-item">
                            {`Reservation for ${customerEmail} on ${reservation.reservation_date} at ${reservation.reservation_time} at table ${reservation.table_number}`}
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
