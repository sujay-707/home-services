import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css"

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg custom-navbar shadow-sm sticky-top">
      <div className="container">
        {/* Brand */}
        <Link className="navbar-brand fw-bold text-primary" to="/">
          🏠 Home <span className="text-dark">Services</span>
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Nav Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            {/* Public (Login/Signup) */}
            {!user && (
              <>
                <li className="nav-item">
                  <Link className="nav-link nav-btn" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link nav-btn" to="/register">
                    Sign Up
                  </Link>
                </li>
              </>
            )}

            {/* Customer Nav */}
            {user?.role === "customer" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link nav-btn" to="/">
                    Services
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link nav-btn" to="/my-bookings">
                    My Bookings
                  </Link>
                </li>
              </>
            )}

            {/* Admin Nav */}
            {user?.role === "admin" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link nav-btn" to="/admin">
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link nav-btn" to="/admin/services">
                    Manage Services
                  </Link>
                </li>
              </>
            )}

            {/* Logout */}
            {user && (
              <li className="nav-item">
                <button
                  className="btn btn-outline-primary ms-3 logout-btn"
                  onClick={logout}
                >
                  Logout ({user.username})
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
