import React from "react";
import "../styles/Card.css";

const Card = ({ title, description }) => (
  <div className="card">
    <div className="card-header">
      <h2>{title}</h2>
    </div>
    <p>{description}</p>
  </div>
);

export default Card;
