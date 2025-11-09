// src/pages/LoginPage.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import api from "../api";
import "./AuthPages.css";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "", role: "customer" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      toast.warning("Please fill in all fields!");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/login", form);
      const userObj = { _id: res.data._id, username: res.data.username, role: res.data.role };
      login(userObj);

      toast.success(`Welcome ${res.data.username}!`);
      if (res.data.role === "admin") navigate("/admin");
      else navigate("/");
    } catch (err) {
      showToast("error", "❌ Invalid username, password, or role", "login-error");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card shadow-lg rounded-4">
        <h2 className="text-center text-primary fw-bold mb-3">Login</h2>
        <p className="text-center text-muted mb-4">Access your account</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="fw-semibold">Username</label>
            <input
              type="text"
              name="username"
              className="form-control rounded-pill"
              placeholder="Enter your username"
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
              placeholder="Enter your password"
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
            >
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            className="btn btn-primary w-100 rounded-pill fw-semibold"
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center mt-4 text-muted">
          Don’t have an account?{" "}
          <Link to="/register" className="text-decoration-none text-primary fw-semibold">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
