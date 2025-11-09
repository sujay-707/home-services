// src/components/Footer.js
import React from "react";

export default function Footer() {
  return (
    <footer
      className="text-light text-center py-3 mt-5"
      style={{
        background: "linear-gradient(90deg, #0d47a1, #1976d2)",
        boxShadow: "0 -2px 10px rgba(0,0,0,0.2)",
      }}
    >
      <div className="container">
        <p className="mb-1 fw-semibold">
          © {new Date().getFullYear()} <span className="text-warning">Home Services Platform</span>
        </p>
        <small style={{ color: "#dce3f1" }}>
          Major Project - <strong>NHCE - MCA </strong> — Simplifying home services digitally
        </small>
      </div>
    </footer>
  );
}
