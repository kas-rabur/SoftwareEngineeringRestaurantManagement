import React, { useState, useEffect } from "react";
import "../styles/StaffPage.css";
import creditCardIcon from "../images/paymentcards.webp";

const CustomerDetails = ({ items, emails, tables, onOrderPlaced }) => {
  const [email, setEmail] = useState("");
  const [table, setTable] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [token, setToken] = useState("");
  const total = items.reduce((sum, i) => sum + i.price, 0);

  // load auth token from localStorage (or wherever you store it)
  useEffect(() => {
    const stored = localStorage.getItem("token");
    if (stored) setToken(stored);
  }, []);

  const handleSubmit = () => {
    if (!email || !table || !date || !time || items.length === 0) {
      return alert("please fill in all fields and add at least one item.");
    }

    fetch("/api/makeOrder", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // include bearer token for authorization
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        email,
        table_id: table,
        items: JSON.stringify(items.map(i => i.item_name)),
        amount: total,
        order_date: date,
        order_time: time,
      }),
    })
      .then(r => {
        if (!r.ok) {
          throw new Error(`status ${r.status}`);
        }
        return r.json();
      })
      .then(data => {
        alert(data.message || "order placed!");
        onOrderPlaced();
      })
      .catch(err => {
        console.error(err);
        alert(`failed to place order: ${err.message}`);
      });
  };

  return (
    <div className="customer-details">
      <form className="customer-form" onSubmit={e => e.preventDefault()}>
        <h3>Customer Details</h3>
        <div className="form-group">
          <label>Customer Email</label>
          <select value={email} onChange={e => setEmail(e.target.value)}>
            <option value="">Select Email</option>
            {emails.map((e, i) => (
              <option key={i} value={e}>{e}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Table Number</label>
          <select value={table} onChange={e => setTable(e.target.value)}>
            <option value="">Select Table</option>
            {tables.map((t, i) => (
              <option key={i} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Total (auto):</label>
          <input type="text" disabled value={`£${total.toFixed(2)}`} />
        </div>
        <div className="form-group">
          <label>Select Date</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Select Time</label>
          <input type="time" value={time} onChange={e => setTime(e.target.value)} />
        </div>
      </form>
      <button className="order-button" onClick={handleSubmit}>Make Order</button>
      <button className="order-button">Process Payment...</button>
      <img src={creditCardIcon} alt="Credit Card" className="credit-card-icon" />
    </div>
  );
};

export default CustomerDetails;
