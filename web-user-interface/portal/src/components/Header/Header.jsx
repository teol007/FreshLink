import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header style={{ background: "#1f2937", color: "white", padding: "1rem", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
      <nav style={{ display: "flex", justifyContent: "space-between", maxWidth: "1200px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "1.25rem", fontWeight: "600" }}>My Dashboard</h1>
        <ul style={{ display: "flex", gap: "1.5rem", listStyle: "none", margin: 0, padding: 0 }}>
          <li><Link to="/profile" style={{ color: "white", textDecoration: "none" }}>Profile</Link></li>
          <li><Link to="/products" style={{ color: "white", textDecoration: "none" }}>Products offering</Link></li>
          <li><Link to="/orders" style={{ color: "white", textDecoration: "none" }}>Order products</Link></li>
        </ul>
      </nav>
    </header>
  );
}
