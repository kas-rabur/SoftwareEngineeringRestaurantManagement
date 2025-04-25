import React from "react";
import "../styles/StaffPage.css"; 
const SelectedItems = ({ items, onRemove }) => (
  <div className="selected-items">
    <h3>Selected Items</h3>
    {items.length === 0 ? (
      <p>No items selected yet.</p>
    ) : (
      <ul className="menu-items-list">
        {items.map((item, idx) => (
          <li key={idx} className="menu-item">
            <h3>{item.item_name}</h3>
            <p>£{item.price.toFixed(2)}</p>
            <button
              className="remove-button"
              onClick={() => onRemove(idx)}
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default SelectedItems;
