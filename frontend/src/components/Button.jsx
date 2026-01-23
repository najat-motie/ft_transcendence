import React from "react";
import "../styles/components.css";

export default function Button({ children, onClick, type = "button", variant = "primary", className = "" }) {
  return (
    <button
      type={type}
      className={`btn btn-${variant} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
