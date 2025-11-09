// frontend/src/pages/MyBookings.js
import React, { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";

export default function MyBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user bookings
  const fetchBookings = async () => {
    try {
      const res = await api.get(`/bookings/my/${user._id}`);
      setBookings(res.data);
    } catch (err) {
      console.error(err);
      alert("❌ Could not fetch your bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchBookings();
  }, [user]);

  // Cancel Booking
  const handleCancel = async (id) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this booking?");
    if (!confirmCancel) return;
    try {
      await api.delete(`/bookings/${id}`);
      alert("✅ Booking canceled successfully");
      setBookings(bookings.filter((b) => b._id !== id));
    } catch (err) {
      console.error(err);
      alert("❌ Failed to cancel booking");
    }
  };

  if (loading)
    return <p className="text-center mt-5">Loading your bookings...</p>;

  if (!bookings.length)
    return (
      <div className="container mt-5 text-center">
        <h4>No bookings found.</h4>
        <p>Book a service to see it here!</p>
      </div>
    );

  return (
    <div className="container mt-4 mb-5">
      <h2 className="mb-4 text-center">📅 My Bookings</h2>
      <div className="row">
        {bookings.map((b) => (
          <div key={b._id} className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm border-0 rounded-4">
              <img
                src={b.serviceId?.image || "https://via.placeholder.com/400x200"}
                className="card-img-top"
                alt={b.serviceId?.name}
                style={{
                  height: 200,
                  objectFit: "cover",
                  borderTopLeftRadius: "0.8rem",
                  borderTopRightRadius: "0.8rem",
                }}
              />
              <div className="card-body">
                <h5 className="card-title fw-bold">{b.serviceId?.name}</h5>
                <p className="mb-1 text-muted">
                  <strong>Date:</strong> {b.date}
                </p>
                <p className="mb-1 text-muted">
                  <strong>Address:</strong> {b.address}
                </p>
                <p className="mb-1 text-muted">
                  <strong>Contact:</strong> {b.contact}
                </p>
                <p className="mb-1 text-muted">
                  <strong>Notes:</strong> {b.notes || "None"}
                </p>
              </div>
              <div className="card-footer d-flex justify-content-between align-items-center bg-light">
                <small className="text-muted">
                  Booked on {new Date(b.createdAt).toLocaleDateString()}
                </small>
                <button
                  onClick={() => handleCancel(b._id)}
                  className="btn btn-outline-danger btn-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
