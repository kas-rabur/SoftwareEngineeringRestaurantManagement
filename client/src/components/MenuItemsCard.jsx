import "../styles/MenuItemsCard.css";
import React, { useState } from "react";

const MenuItemsCard = ({ showAddButton = false, onAddItem }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchMenuItems = async () => {
    setLoading(true);
    setErrorMsg("");
    setMenuItems([]);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/getMenuItems", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setMenuItems(data.items);
        console.log("Menu items fetched successfully:", data.items);
      } else {
        setErrorMsg(data.message || "Could not fetch menu items.");
      }
    } catch (error) {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="menu-items-card" id="order-food">
      <h2>Menu</h2>
      <p>Browse our menu and order your favorite dishes directly.</p>
      <button onClick={fetchMenuItems} className="fetch-menu-button">
        Fetch Menu Items
      </button>

      {loading && <p>Loading...</p>}
      {errorMsg && <p className="error-message">{errorMsg}</p>}

      <ul className="menu-items-list">
        {menuItems.length > 0
          ? menuItems
              .filter((item) => item.availability_status === 1)
              .map((item) => (
                <li key={item.menu_id} className="menu-item">
                  <h3>{item.item_name}</h3>
                  <p>{item.description}</p>
                  <p>Category: {item.category}</p>
                  <p>£{item.price.toFixed(2)}</p>
                  {showAddButton && (
                    <button
                      className="add-button"
                      onClick={() => onAddItem(item)}
                    >
                      Add
                    </button>
                  )}
                </li>
              ))
          : !loading && <p>No menu items to show.</p>}
      </ul>
    </div>
  );
};
export default MenuItemsCard;
