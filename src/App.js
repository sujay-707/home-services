import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import { AuthProvider, useAuth } from "./context/AuthContext";
import RequireAuth from "./components/RequireAuth";

// ✅ Pages
import HomePage from "./pages/HomePage";
import BookingForm from "./pages/BookingForm";
import AdminDashboard from "./pages/AdminDashboard";
import AddService from "./pages/AddService";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MyBookings from "./pages/MyBookings";
import PaymentPage from "./pages/PaymentPage"; // ✅ added payment page
import UserBookings from "./pages/UserBookings";

// ✅ Components
import Footer from "./components/Footer";
import "./components/Navbar.css"; // 👈 Import custom white-blue styles

function Navbar() {
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
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Nav Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            {/* Not logged in */}
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

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />

        <div className="flex-grow-1" style={{ minHeight: "80vh" }}>
          <Routes>
            {/* Public */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Customer and Admin shared */}
            <Route
              path="/"
              element={
                <RequireAuth allowedRoles={["customer", "admin"]}>
                  <HomePage />
                </RequireAuth>
              }
            />

            {/* Customer Routes */}
            <Route
              path="/book/:id"
              element={
                <RequireAuth allowedRoles={["customer"]}>
                  <BookingForm />
                </RequireAuth>
              }
            />
            <Route
              path="/payment/:bookingId"
              element={
                <RequireAuth allowedRoles={["customer"]}>
                  <PaymentPage />
                </RequireAuth>
              }
            />
            <Route
              path="/my-bookings"
              element={
                <RequireAuth allowedRoles={["customer"]}>
                  <MyBookings />
                </RequireAuth>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <RequireAuth allowedRoles={["admin"]}>
                  <AdminDashboard />
                </RequireAuth>
              }
            />
            <Route
              path="/admin/services"
              element={
                <RequireAuth allowedRoles={["admin"]}>
                  <AddService />
                </RequireAuth>
              }
            />

            <Route
              path="/admin/user/:username"
              element={
                <RequireAuth allowedRoles={["admin"]}>
                  <UserBookings />
                </RequireAuth>
              }
            />

            {/* 404 fallback */}
            <Route
              path="*"
              element={
                <div className="container mt-5 text-center">
                  <h2>404 - Page Not Found</h2>
                  <Link to="/" className="btn btn-primary mt-3">
                    Go Home
                  </Link>
                </div>
              }
            />
          </Routes>
        </div>

        <Footer />
      </Router>
    </AuthProvider>
  );
}
