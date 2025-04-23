import React, { useState } from "react";
import "../styles/StaffPage.css";
import MenuItemsCard from "./MenuItemsCard";

const StaffPage = () => {
  const [selectedItems, setSelectedItems] = useState([]);

  const handleAddItem = (item) => {
    setSelectedItems((prev) => [...prev, item]);
  };

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
                        <button className="remove-button" onClick={() => setSelectedItems((prev) => prev.filter((_, i) => i !== index))}>x</button>
                        </li>
                    ))}
                    </ul>
                )}
            </div>
            <div className="customer-details">stuff</div>
        </div>
    </div>
  );
};

export default StaffPage;
