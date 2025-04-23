import "../styles/PlaceOrderCard.css";
import React, { useState } from "react";

const PlaceOrderCard = () => {
    const [orderData, setOrderData] = useState({
        customerName: "",
        item: "",
        quantity: 1,
        instructions: ""
    });

    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setOrderData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
 
    };

    return (
        <div className="place-order-card">
            <h2>Place an Order</h2>
            <p>Fill in the form to order your favorite dish.</p>

            <form onSubmit={handleSubmit} className="order-form">
                <input
                    type="text"
                    name="customerName"
                    placeholder="Your Name"
                    value={orderData.customerName}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="item"
                    placeholder="Item Name"
                    value={orderData.item}
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    name="quantity"
                    placeholder="Quantity"
                    min="1"
                    value={orderData.quantity}
                    onChange={handleChange}
                    required
                />
                <textarea
                    name="instructions"
                    placeholder="Special Instructions"
                    value={orderData.instructions}
                    onChange={handleChange}
                    rows={3}
                />
                <button type="submit" className="submit-order-button">Submit Order</button>
            </form>

            {submitted && (
                <div className="order-summary">
                    <h3>Order Summary</h3>
                    <p><strong>Name:</strong> {orderData.customerName}</p>
                    <p><strong>Item:</strong> {orderData.item}</p>
                    <p><strong>Quantity:</strong> {orderData.quantity}</p>
                    <p><strong>Instructions:</strong> {orderData.instructions || "None"}</p>
                </div>
            )}
        </div>
    );
};

export default PlaceOrderCard;
