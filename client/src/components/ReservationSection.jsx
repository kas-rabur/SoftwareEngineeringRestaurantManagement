import React, { useState, useEffect } from "react";
import "../styles/StaffPage.css";

const ReservationsSection = () => {
  const [open, setOpen] = useState(false);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setError("");
    fetch("/api/getAllReservations")
      .then(res => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then(data => setReservations(data.reservations || []))
      .catch(err => {
        console.error(err);
        setError("Could not load reservations.");
      })
      .finally(() => setLoading(false));
  }, [open]);

  return (
    <>
      <div className="dropdown-header">
        <button
          className="dropdown-toggle"
          onClick={() => setOpen(o => !o)}
        >
          {open ? "Hide Reservations ▲" : "View Reservations ▼"}
        </button>
      </div>
      {open && (
        <div className="dropdown-panel">
          {loading ? (
            <p>Loading reservations…</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : reservations.length === 0 ? (
            <p>No reservations found.</p>
          ) : (
            <table className="res-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Table</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map(r => (
                  <tr key={r.reservation_id}>
                    <td>{r.reservation_id}</td>
                    <td>{r.customer_email}</td>
                    <td>{r.table_id}</td>
                    <td>{r.reservation_date}</td>
                    <td>{r.reservation_time}</td>
                    <td>{r.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </>
  );
};

export default ReservationsSection;
