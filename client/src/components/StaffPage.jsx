import React, { useState, useEffect } from "react";
import "../styles/StaffPage.css";
import MenuItemsCard from "./MenuItemsCard";

const StaffPage = () => {
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
      .catch(err => console.error("Error fetching emails:", err));

    fetch("http://localhost:5000/api/getTableNumbers")
      .then(res => res.json())
      .then(data => setTables(data.tables))
      .catch(err => console.error("Error fetching tables:", err));
  }, []);

  const handleAddItem = (item) => {
    setSelectedItems((prev) => [...prev, item]);
  };

  const handleMakeOrder = () => {
    if (!selectedEmail || !selectedTable || !orderDate || !orderTime || selectedItems.length === 0) {
      alert("Please fill in all fields and add at least one item.");
      return;
    }

    const payload = {
      email: selectedEmail,
      table_id: selectedTable,
      items: JSON.stringify(selectedItems.map(item => item.item_name)),
      amount: selectedItems.reduce((acc, item) => acc + item.price, 0),
      order_date: orderDate,
      order_time: orderTime
    };

    fetch("http://localhost:5000/api/makeOrder", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message || "Order placed!");
        setSelectedItems([]);
      })
      .catch(err => console.error("Error placing order:", err));
  };

  const totalPrice = selectedItems.reduce((acc, item) => acc + item.price, 0);

  return (
    <div className="staff-page">
      <div className="staff-menu-wrapper">
        <MenuItemsCard showAddButton={true} onAddItem={handleAddItem} />
      </div>
      <div className="staff-info-wrapper">
        <div className="selected-items">
          <h3>Selected Items</h3>
          {selectedItems.length === 0 ? (
            <p>No items selected yet.</p>
          ) : (
            <ul className="menu-items-list">
              {selectedItems.map((item, index) => (
                <li key={index} className="menu-item">
                  <h3>{item.item_name}</h3>
                  <p>£{item.price.toFixed(2)}</p>
                  <button
                    className="remove-button"
                    onClick={() =>
                      setSelectedItems((prev) =>
                        prev.filter((_, i) => i !== index)
                      )
                    }
                  >
                    x
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="customer-details">
          <form className="customer-form" onSubmit={(e) => e.preventDefault()}>
            <h3>Customer Details</h3>
            <div className="form-group">
              <label className="cust-label">Customer Email</label>
              <select value={selectedEmail} onChange={(e) => setSelectedEmail(e.target.value)}>
                <option value="">Select Email</option>
                {emails.map((email, index) => (
                  <option key={index} value={email}>{email}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Table Number</label>
              <select value={selectedTable} onChange={(e) => setSelectedTable(e.target.value)}>
                <option value="">Select Table</option>
                {tables.map((table, index) => (
                  <option key={index} value={table}>{table}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Total : (auto changes)</label>
              <input type="text" disabled value={`£${totalPrice.toFixed(2)}`} />
            </div>

            <div className="form-group">
              <label>Select Date</label>
              <input type="date" value={orderDate} onChange={(e) => setOrderDate(e.target.value)} />
            </div>

            <div className="form-group">
              <label>Select Time</label>
              <input type="time" value={orderTime} onChange={(e) => setOrderTime(e.target.value)} />
            </div>
          </form>
          <button className="order-button" onClick={handleMakeOrder}>Make Order</button>
        </div>
      </div>
    </div>
  );
};

export default StaffPage;
