import React, { useState, useEffect } from "react";
import "../styles/StaffPage.css";
import MenuItemsCard from "./MenuItemsCard";

const StaffPage = () => {
  const [orderOpen, setOrderOpen] = useState(false);
  const [viewResOpen, setViewResOpen] = useState(false);
  const [sendRemOpen, setViewOrderOpen] = useState(false);

  const [reservations, setReservations] = useState([]);
  const [loadingRes, setLoadingRes] = useState(false);
  const [resError, setResError] = useState("");

  const [selectedItems, setSelectedItems] = useState([]);
  const [emails, setEmails] = useState([]);
  const [tables, setTables] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [selectedTable, setSelectedTable] = useState("");
  const [orderDate, setOrderDate] = useState("");
  const [orderTime, setOrderTime] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/getCustomerEmails")
      .then(res => res.json())
      .then(data => setEmails(data.emails))
      .catch(err => console.error(err));

    fetch("http://localhost:5000/api/getTableNumbers")
      .then(res => res.json())
      .then(data => setTables(data.tables))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (!viewResOpen) return;
    setLoadingRes(true);
    setResError("");
    fetch("http://localhost:5000/api/getAllReservations")
      .then(res => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      })
      .then(data => setReservations(data.reservations || []))
      .catch(err => {
        console.error("Error fetching reservations:", err);
        setResError("Could not load reservations.");
      })
      .finally(() => setLoadingRes(false));
  }, [viewResOpen]);

  const handleAddItem = item => {
    setSelectedItems(prev => [...prev, item]);
  };

  const handleMakeOrder = () => {
    if (
      !selectedEmail ||
      !selectedTable ||
      !orderDate ||
      !orderTime ||
      selectedItems.length === 0
    ) {
      alert("Please fill in all fields and add at least one item.");
      return;
    }
    const payload = {
      email: selectedEmail,
      table_id: selectedTable,
      items: JSON.stringify(selectedItems.map(i => i.item_name)),
      amount: selectedItems.reduce((sum, i) => sum + i.price, 0),
      order_date: orderDate,
      order_time: orderTime
    };
    fetch("http://localhost:5000/api/makeOrder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message || "Order placed!");
        setSelectedItems([]);
      })
      .catch(err => console.error(err));
  };

  const totalPrice = selectedItems.reduce((sum, i) => sum + i.price, 0);

  return (
    <div className="staff-page">
      <div className="dropdown-header">
        <button className="dropdown-toggle" onClick={() => setOrderOpen(o => !o)}>
          {orderOpen ? "Hide Order ▲" : "New Order ▼"}
        </button>
      </div>
      {orderOpen && (
        <>
          <div className="staff-menu-wrapper">
            <MenuItemsCard showAddButton onAddItem={handleAddItem} />
          </div>
          <div className="staff-info-wrapper">
            <div className="selected-items">
              <h3>Selected Items</h3>
              {selectedItems.length === 0 ? (
                <p>No items selected yet.</p>
              ) : (
                <ul className="menu-items-list">
                  {selectedItems.map((item, idx) => (
                    <li key={idx} className="menu-item">
                      <h3>{item.item_name}</h3>
                      <p>£{item.price.toFixed(2)}</p>
                      <button
                        className="remove-button"
                        onClick={() =>
                          setSelectedItems(prev => prev.filter((_, i) => i !== idx))
                        }
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="customer-details">
              <form className="customer-form" onSubmit={e => e.preventDefault()}>
                <h3>Customer Details</h3>
                <div className="form-group">
                  <label>Customer Email</label>
                  <select
                    value={selectedEmail}
                    onChange={e => setSelectedEmail(e.target.value)}
                  >
                    <option value="">Select Email</option>
                    {emails.map((email, i) => (
                      <option key={i} value={email}>{email}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Table Number</label>
                  <select
                    value={selectedTable}
                    onChange={e => setSelectedTable(e.target.value)}
                  >
                    <option value="">Select Table</option>
                    {tables.map((table, i) => (
                      <option key={i} value={table}>{table}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Total (auto):</label>
                  <input type="text" disabled value={`£${totalPrice.toFixed(2)}`} />
                </div>
                <div className="form-group">
                  <label>Select Date</label>
                  <input
                    type="date"
                    value={orderDate}
                    onChange={e => setOrderDate(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Select Time</label>
                  <input
                    type="time"
                    value={orderTime}
                    onChange={e => setOrderTime(e.target.value)}
                  />
                </div>
              </form>
              <button className="order-button" onClick={handleMakeOrder}>
                Make Order
              </button>
            </div>
          </div>
        </>
      )}

      <div className="dropdown-header">
        <button className="dropdown-toggle" onClick={() => setViewResOpen(v => !v)}>
          {viewResOpen ? "Hide Reservations ▲" : "View Reservations ▼"}
        </button>
      </div>
      {viewResOpen && (
        <div className="dropdown-panel">
          {loadingRes ? (
            <p>Loading reservations…</p>
          ) : resError ? (
            <p className="error">{resError}</p>
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
                {reservations.map(res => (
                  <tr key={res.reservation_id}>
                    <td>{res.reservation_id}</td>
                    <td>{res.customer_email}</td>
                    <td>{res.table_id}</td>
                    <td>{res.reservation_date}</td>
                    <td>{res.reservation_time}</td>
                    <td>{res.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      <div className="dropdown-header">
        <button className="dropdown-toggle" onClick={() => setViewOrderOpen(s => !s)}>
          {sendRemOpen ? "Hide View Orders ▲" : "View Order ▼"}
        </button>
      </div>
      {sendRemOpen && (
        <div className="dropdown-panel">
          
        </div>
      )}
    </div>
  );
};

export default StaffPage;
