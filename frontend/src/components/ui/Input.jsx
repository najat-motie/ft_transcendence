import React from "react";
import "../../styles/ui/input.css";

export default function Input({ value, onChange, placeholder = "", type = "text", className = "" }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`input ${className}`}
    />
  );
}
