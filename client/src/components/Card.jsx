import React from "react";
import "../styles/Card.css";

const Card = ({ id, title, description, expandedContent, isExpanded, onToggle }) => (
  <div className="card" id={id}>
    <div className="card-header" onClick={() => onToggle(id)}>
      <h2>{title}</h2>
      <span className={`arrow ${isExpanded ? "expanded" : ""}`}>▼</span>
    </div>
    <p>{description}</p>
    {isExpanded && (
      <div className="card-expanded">
        {expandedContent || <p>No additional information available.</p>}
      </div>
    )}
  </div>
);

export default Card;
