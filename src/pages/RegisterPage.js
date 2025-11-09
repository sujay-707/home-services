// src/pages/RegisterPage.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import "./AuthPages.css";

export default function RegisterPage() {
  const [form, setForm] = useState({ username: "", password: "", role: "customer" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.username || !form.password) {
      alert("⚠️ Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/register", form);
      alert("🎉 Registration successful! Please log in.");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      alert(err?.response?.data?.error || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card shadow-lg rounded-4">
        <h2 className="text-center text-success fw-bold mb-3">Sign Up</h2>
        <p className="text-center text-muted mb-4">Create your account to get started</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="fw-semibold">Username</label>
            <input
              type="text"
              name="username"
              className="form-control rounded-pill"
              placeholder="Choose a username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="fw-semibold">Password</label>
            <input
              type="password"
              name="password"
              className="form-control rounded-pill"
              placeholder="Create a password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="fw-semibold">Role</label>
            <select
              name="role"
              className="form-select rounded-pill"
              value={form.role}
              onChange={handleChange}
              required
            >
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            className="btn btn-success w-100 rounded-pill fw-semibold"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center mt-4 text-muted">
          Already have an account?{" "}
          <Link to="/login" className="text-decoration-none text-success fw-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
