import React, { useState, useEffect } from "react";
import "../styles/StaffPage.css"; 
import MenuItemsCard from "./MenuItemsCard";
import SelectedItems from "./SelectedItems";
import CustomerDetails from "./CustomerDetails";

const OrderSection = () => {
  const [open, setOpen] = useState(false);
  const [emails, setEmails] = useState([]);
  const [tables, setTables] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    fetch("/api/getCustomerEmails")
      .then(res => res.json())
      .then(data => setEmails(data.emails))
      .catch(console.error);
    fetch("/api/getTableNumbers")
      .then(res => res.json())
      .then(data => setTables(data.tables))
      .catch(console.error);
  }, []);

  const handleAddItem = item =>
    setSelectedItems(prev => [...prev, item]);
  const handleRemoveItem = idx =>
    setSelectedItems(prev => prev.filter((_, i) => i !== idx));

  return (
    <>
      <div className="dropdown-header">
        <button
          className="dropdown-toggle"
          onClick={() => setOpen(o => !o)}
        >
          {open ? "Hide Order ▲" : "New Order ▼"}
        </button>
      </div>
      {open && (
        <div className="staff-info-wrapper">
          <div className="staff-menu-wrapper">
            <MenuItemsCard
              showAddButton
              onAddItem={handleAddItem}
            />
          </div>
          <SelectedItems
            items={selectedItems}
            onRemove={handleRemoveItem}
          />
          <CustomerDetails
            items={selectedItems}
            emails={emails}
            tables={tables}
            onOrderPlaced={() => setSelectedItems([])}
          />
        </div>
      )}
    </>
  );
};

export default OrderSection;
