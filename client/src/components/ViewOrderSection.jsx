

import React, { useState, useEffect } from "react";
import "../styles/StaffPage.css";

const ViewOrdersSection = () => {
  const [open, setOpen]       = useState(false);
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (open) {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");

      fetch("/api/getAllOrders", {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : ""
        }
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch orders");
          return res.json();
        })
        .then((data) => setOrders(data.orders || []))
        .catch((err) => {
          console.error(err);
          setError(err.message);
        })
        .finally(() => setLoading(false));
    }
  }, [open]);

  return (
    <>
      <div className="dropdown-header">
        <button
          className="dropdown-toggle"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "Hide Orders ▲" : "View Orders ▼"}
        </button>
      </div>

      {open && (
        <div className="dropdown-panel">
          {loading && <p>Loading orders…</p>}
          {error   && <p className="error">Error: {error}</p>}
          {!loading && !error && orders.length === 0 && (
            <p>No orders found.</p>
          )}
          {!loading && !error && orders.length > 0 && (
            <table className="orders-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Email</th>
                  <th>Table</th>
                  <th>Items</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.order_id}>
                    <td>{order.order_id}</td>
                    <td>{order.email}</td>
                    <td>{order.table_number}</td>
                    <td>
                      {Array.isArray(order.items)
                        ? order.items.join(", ")
                        : order.items}
                    </td>
                    <td>{order.total_amount.toFixed(2)}</td>
                    <td>{order.status}</td>
                    <td>{order.order_date}</td>
                    <td>{order.order_time}</td>
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

export default ViewOrdersSection;
